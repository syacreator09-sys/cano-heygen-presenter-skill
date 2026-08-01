import { readFile } from 'node:fs/promises';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { normalizeHeyGenConfig, saveHeyGenConfig } from './config.js';

function yes(value, fallback) {
  const text = String(value ?? '').trim().toLowerCase();
  if (!text) return fallback;
  return ['y','yes','s','si','sí','1','true'].includes(text);
}

export async function runHeyGenSetup({ seedFile, outputFile = 'config/heygen.local.json' } = {}) {
  if (seedFile) return saveHeyGenConfig(JSON.parse(await readFile(seedFile, 'utf8')), outputFile);
  const rl = readline.createInterface({ input, output });
  try {
    output.write('\nCANO HeyGen Presenter setup\n');
    output.write('Este asistente guarda nombres de variables, nunca API keys ni IDs reales.\n\n');
    const apiKeyEnv = (await rl.question('Variable de API key (HEYGEN_API_KEY): ')).trim() || 'HEYGEN_API_KEY';
    const avatarIdEnv = (await rl.question('Variable de avatar/Digital Twin (HEYGEN_AVATAR_ID): ')).trim() || 'HEYGEN_AVATAR_ID';
    const voiceIdEnv = (await rl.question('Variable de voz (HEYGEN_VOICE_ID): ')).trim() || 'HEYGEN_VOICE_ID';
    const locale = (await rl.question('Locale de voz (es-MX): ')).trim() || 'es-MX';
    const speed = Number(await rl.question('Velocidad de voz 0.5-2 (1): ')) || 1;
    const creditsPerMinute = Number(await rl.question('Créditos estimados por minuto para control local (1): ')) || 1;
    const maxEstimatedCreditsPerJob = Number(await rl.question('Máximo estimado por trabajo (2): ')) || 2;
    const intervalMs = Number(await rl.question('Intervalo de consulta en ms (5000): ')) || 5000;
    const timeoutMs = Number(await rl.question('Timeout total en ms (900000): ')) || 900000;
    const downloadCompletedVideos = yes(await rl.question('¿Descargar automáticamente los MP4 completados? [S/n]: '), true);
    return saveHeyGenConfig(normalizeHeyGenConfig({ apiKeyEnv, avatarIdEnv, voiceIdEnv, locale, speed, creditsPerMinute, maxEstimatedCreditsPerJob, polling: { intervalMs, timeoutMs }, downloadCompletedVideos }), outputFile);
  } finally { rl.close(); }
}
