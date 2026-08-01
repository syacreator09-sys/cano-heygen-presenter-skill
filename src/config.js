import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const DEFAULT_HEYGEN_CONFIG = Object.freeze({
  version: '1.0',
  runtimeDir: '.runtime',
  apiBaseUrl: 'https://api.heygen.com',
  apiKeyEnv: 'HEYGEN_API_KEY',
  avatarIdEnv: 'HEYGEN_AVATAR_ID',
  voiceIdEnv: 'HEYGEN_VOICE_ID',
  locale: 'es-MX',
  speed: 1,
  creditsPerMinute: 1,
  maxEstimatedCreditsPerJob: 2,
  polling: { intervalMs: 5000, timeoutMs: 900000, maxAttempts: 3 },
  downloadCompletedVideos: true
});

export function normalizeHeyGenConfig(input = {}) {
  const polling = input.polling ?? {};
  return {
    version: '1.0',
    runtimeDir: input.runtimeDir || DEFAULT_HEYGEN_CONFIG.runtimeDir,
    apiBaseUrl: String(input.apiBaseUrl || DEFAULT_HEYGEN_CONFIG.apiBaseUrl).replace(/\/$/, ''),
    apiKeyEnv: input.apiKeyEnv || DEFAULT_HEYGEN_CONFIG.apiKeyEnv,
    avatarIdEnv: input.avatarIdEnv || DEFAULT_HEYGEN_CONFIG.avatarIdEnv,
    voiceIdEnv: input.voiceIdEnv || DEFAULT_HEYGEN_CONFIG.voiceIdEnv,
    locale: input.locale || DEFAULT_HEYGEN_CONFIG.locale,
    speed: Number(input.speed) || DEFAULT_HEYGEN_CONFIG.speed,
    creditsPerMinute: Number(input.creditsPerMinute) || DEFAULT_HEYGEN_CONFIG.creditsPerMinute,
    maxEstimatedCreditsPerJob: Number(input.maxEstimatedCreditsPerJob) || DEFAULT_HEYGEN_CONFIG.maxEstimatedCreditsPerJob,
    polling: {
      intervalMs: Number(polling.intervalMs) || DEFAULT_HEYGEN_CONFIG.polling.intervalMs,
      timeoutMs: Number(polling.timeoutMs) || DEFAULT_HEYGEN_CONFIG.polling.timeoutMs,
      maxAttempts: Number(polling.maxAttempts) || DEFAULT_HEYGEN_CONFIG.polling.maxAttempts
    },
    downloadCompletedVideos: typeof input.downloadCompletedVideos === 'boolean' ? input.downloadCompletedVideos : true
  };
}

export function validateHeyGenConfig(config) {
  const errors = [];
  if (!/^https:\/\//.test(config?.apiBaseUrl ?? '')) errors.push('apiBaseUrl must use https');
  for (const key of ['apiKeyEnv','avatarIdEnv','voiceIdEnv']) if (!/^[A-Z][A-Z0-9_]+$/.test(config?.[key] ?? '')) errors.push(`${key} must be an environment variable name`);
  if (!(config?.speed >= 0.5 && config?.speed <= 2)) errors.push('speed must be 0.5-2');
  if (!(config?.creditsPerMinute > 0 && config?.creditsPerMinute <= 100)) errors.push('creditsPerMinute must be positive');
  if (!(config?.maxEstimatedCreditsPerJob > 0)) errors.push('maxEstimatedCreditsPerJob must be positive');
  if (!(config?.polling?.intervalMs >= 1000 && config?.polling?.intervalMs <= 60000)) errors.push('polling.intervalMs must be 1000-60000');
  if (!(config?.polling?.timeoutMs >= 30000 && config?.polling?.timeoutMs <= 3600000)) errors.push('polling.timeoutMs must be 30000-3600000');
  return { ok: errors.length === 0, errors };
}

export async function loadHeyGenConfig(file = 'config/heygen.local.json') {
  try {
    const config = normalizeHeyGenConfig(JSON.parse(await readFile(file, 'utf8')));
    const result = validateHeyGenConfig(config);
    if (!result.ok) throw new Error(result.errors.join('; '));
    return { config, file: path.resolve(file), exists: true };
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
    return { config: normalizeHeyGenConfig(), file: path.resolve(file), exists: false };
  }
}

export async function saveHeyGenConfig(input, file = 'config/heygen.local.json') {
  const config = normalizeHeyGenConfig(input);
  const result = validateHeyGenConfig(config);
  if (!result.ok) throw new Error(result.errors.join('; '));
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(config, null, 2)}\n`, { mode: 0o600 });
  return { file: path.resolve(file), config };
}
