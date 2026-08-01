import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function headers(apiKey) {
  return { 'x-api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' };
}

async function parseResponse(response, label) {
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  if (!response.ok) throw new Error(`${label} failed ${response.status}: ${body?.error?.message ?? body?.message ?? text}`);
  return body;
}

export async function listAvatars(config, { apiKey = process.env[config.apiKeyEnv], fetchImpl = fetch } = {}) {
  if (!apiKey) throw new Error(`${config.apiKeyEnv} is required`);
  const response = await fetchImpl(`${config.apiBaseUrl}/v2/avatars`, { headers: headers(apiKey) });
  return parseResponse(response, 'HeyGen avatars');
}

export async function listVoices(config, { apiKey = process.env[config.apiKeyEnv], fetchImpl = fetch } = {}) {
  if (!apiKey) throw new Error(`${config.apiKeyEnv} is required`);
  const response = await fetchImpl(`${config.apiBaseUrl}/v2/voices`, { headers: headers(apiKey) });
  return parseResponse(response, 'HeyGen voices');
}

export async function submitVideo({ segment, request, profile, config, apiKey, fetchImpl = fetch }) {
  const avatarId = process.env[profile.avatarIdEnv ?? config.avatarIdEnv];
  const voiceId = process.env[profile.voiceIdEnv ?? config.voiceIdEnv];
  if (!avatarId) throw new Error(`${profile.avatarIdEnv ?? config.avatarIdEnv} is required`);
  if (!voiceId) throw new Error(`${profile.voiceIdEnv ?? config.voiceIdEnv} is required`);
  const portrait = request.aspectRatio === '9:16';
  const payload = {
    video_inputs: [{
      character: { type: 'avatar', avatar_id: avatarId, avatar_style: segment.avatarStyle ?? profile.avatarStyle ?? 'normal' },
      voice: { type: 'text', voice_id: voiceId, input_text: segment.script, speed: segment.speed ?? profile.speed ?? config.speed }
    }],
    dimension: portrait ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 },
    test: false,
    caption: Boolean(request.captions)
  };
  if (segment.background?.type === 'color') payload.video_inputs[0].background = { type: 'color', value: segment.background.value };
  if (segment.background?.type === 'image') payload.video_inputs[0].background = { type: 'image', url: segment.background.url };
  const response = await fetchImpl(`${config.apiBaseUrl}/v2/video/generate`, { method: 'POST', headers: headers(apiKey), body: JSON.stringify(payload) });
  const body = await parseResponse(response, 'HeyGen generate');
  const videoId = body?.data?.video_id;
  if (!videoId) throw new Error('HeyGen response did not include data.video_id');
  return { videoId, payload };
}

export async function getVideoStatus(videoId, config, { apiKey = process.env[config.apiKeyEnv], fetchImpl = fetch } = {}) {
  if (!apiKey) throw new Error(`${config.apiKeyEnv} is required`);
  const url = `${config.apiBaseUrl}/v1/video_status.get?video_id=${encodeURIComponent(videoId)}`;
  const response = await fetchImpl(url, { headers: headers(apiKey) });
  const body = await parseResponse(response, 'HeyGen status');
  return body?.data ?? body;
}

export async function waitForVideo(videoId, config, { apiKey, fetchImpl = fetch, sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) } = {}) {
  const started = Date.now();
  let last = null;
  while (Date.now() - started < config.polling.timeoutMs) {
    last = await getVideoStatus(videoId, config, { apiKey, fetchImpl });
    if (last.status === 'completed') return last;
    if (last.status === 'failed') throw new Error(`HeyGen video failed: ${last.error ?? last.error_message ?? 'unknown provider error'}`);
    await sleep(config.polling.intervalMs);
  }
  throw new Error(`HeyGen polling timed out after ${config.polling.timeoutMs}ms; last status: ${last?.status ?? 'unknown'}`);
}

export async function downloadVideo(url, destination, { fetchImpl = fetch } = {}) {
  if (!/^https:\/\//.test(url ?? '')) throw new Error('completed video URL must use https');
  const response = await fetchImpl(url);
  if (!response.ok) throw new Error(`video download failed ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
  return { path: destination, bytes: bytes.length };
}
