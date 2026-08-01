import process from 'node:process';
import { loadHeyGenConfig } from './config.js';

export async function runHeyGenDoctor({ configFile = 'config/heygen.local.json' } = {}) {
  const { config, file, exists } = await loadHeyGenConfig(configFile);
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  const apiKeyConfigured = Boolean(process.env[config.apiKeyEnv]);
  const avatarConfigured = Boolean(process.env[config.avatarIdEnv]);
  const voiceConfigured = Boolean(process.env[config.voiceIdEnv]);
  return {
    ok: nodeMajor >= 20 && exists && apiKeyConfigured && avatarConfigured && voiceConfigured,
    node: process.version,
    nodeSupported: nodeMajor >= 20,
    platform: process.platform,
    arch: process.arch,
    configFile: file,
    configExists: exists,
    apiBaseUrl: config.apiBaseUrl,
    environment: {
      [config.apiKeyEnv]: apiKeyConfigured,
      [config.avatarIdEnv]: avatarConfigured,
      [config.voiceIdEnv]: voiceConfigured
    },
    costCeiling: config.maxEstimatedCreditsPerJob,
    nextSteps: [
      ...(!exists ? ['Run: cano-heygen init'] : []),
      ...(!apiKeyConfigured ? [`Set ${config.apiKeyEnv} in your local shell or credential loader`] : []),
      ...(!avatarConfigured ? [`Set ${config.avatarIdEnv} after selecting an authorized avatar`] : []),
      ...(!voiceConfigured ? [`Set ${config.voiceIdEnv} after selecting an authorized voice`] : [])
    ]
  };
}
