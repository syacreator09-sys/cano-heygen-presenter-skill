import test from 'node:test';
import assert from 'node:assert/strict';
import { getVideoStatus, submitVideo, waitForVideo } from '../src/provider.js';

const config = { apiBaseUrl:'https://api.heygen.com', apiKeyEnv:'TEST_KEY', avatarIdEnv:'TEST_AVATAR', voiceIdEnv:'TEST_VOICE', speed:1, polling:{ intervalMs:1000, timeoutMs:30000 } };
const profile = { avatarIdEnv:'TEST_AVATAR', voiceIdEnv:'TEST_VOICE' };
const request = { aspectRatio:'9:16', captions:true };
const segment = { id:'hook', script:'Hola', purpose:'hook' };

function response(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers:{'content-type':'application/json'} });
}

test('submits v2 video generation and extracts video id', async () => {
  process.env.TEST_AVATAR = 'avatar-demo';
  process.env.TEST_VOICE = 'voice-demo';
  let payload;
  const fetchImpl = async (_url, options) => { payload = JSON.parse(options.body); return response({ data:{ video_id:'video-1' } }); };
  const result = await submitVideo({ segment, request, profile, config, apiKey:'secret', fetchImpl });
  assert.equal(result.videoId, 'video-1');
  assert.equal(payload.dimension.height, 1920);
  delete process.env.TEST_AVATAR;
  delete process.env.TEST_VOICE;
});

test('reads completed status and polling stops', async () => {
  const states = ['processing', 'completed'];
  const fetchImpl = async () => response({ data:{ status:states.shift(), video_url:'https://cdn.example/video.mp4' } });
  const result = await waitForVideo('video-1', config, { apiKey:'secret', fetchImpl, sleep:async () => {} });
  assert.equal(result.status, 'completed');
  assert.equal((await getVideoStatus('video-1', config, { apiKey:'secret', fetchImpl:async () => response({data:{status:'completed'}}) })).status, 'completed');
});
