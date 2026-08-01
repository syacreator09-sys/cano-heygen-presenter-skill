import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { downloadVideo, submitVideo, waitForVideo } from './provider.js';

export async function renderLive(request, profile, outDir, { config, apiKey = process.env[config.apiKeyEnv], fetchImpl = fetch, sleep } = {}) {
  if (!config) throw new Error('HeyGen local config is required for live mode');
  if (!apiKey) throw new Error(`${config.apiKeyEnv} is required for live mode`);
  await mkdir(outDir, { recursive: true });
  const results = [];

  for (const segment of request.segments) {
    let lastError = null;
    for (let attempt = 1; attempt <= config.polling.maxAttempts; attempt += 1) {
      try {
        const submitted = await submitVideo({ segment, request, profile, config, apiKey, fetchImpl });
        const completed = await waitForVideo(submitted.videoId, config, { apiKey, fetchImpl, sleep });
        let asset = null;
        let bytes = null;
        if (config.downloadCompletedVideos) {
          const videoUrl = completed.video_url ?? completed.videoUrl;
          if (!videoUrl) throw new Error('completed HeyGen status did not include video_url');
          const downloaded = await downloadVideo(videoUrl, path.join(outDir, `${segment.id}.mp4`), { fetchImpl });
          asset = path.basename(downloaded.path);
          bytes = downloaded.bytes;
        }
        results.push({ id: segment.id, purpose: segment.purpose, videoId: submitted.videoId, status: 'completed', asset, bytes, provider: completed });
        lastError = null;
        break;
      } catch (error) {
        lastError = error;
        if (attempt < config.polling.maxAttempts) await (sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms))))(Math.min(30000, attempt * 5000));
      }
    }
    if (lastError) {
      results.push({ id: segment.id, purpose: segment.purpose, status: 'failed', error: lastError.message });
      break;
    }
  }

  const failed = results.find((item) => item.status === 'failed');
  const manifest = { version: '1.1', projectId: request.projectId, mode: 'live', status: failed ? 'FAILED' : 'COMPLETED', segments: results };
  await writeFile(path.join(outDir, 'presenter-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  if (failed) throw new Error(`HeyGen segment failed (${failed.id}): ${failed.error}`);
  return manifest;
}
