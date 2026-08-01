#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { validatePresenterRequest } from '../src/validate.js';
import { assertWithinBudget, estimateCost } from '../src/cost.js';
import { renderMock } from '../src/mock.js';
import { renderLive } from '../src/live.js';
import { loadHeyGenConfig } from '../src/config.js';
import { runHeyGenSetup } from '../src/setup.js';
import { runHeyGenDoctor } from '../src/doctor.js';
import { listAvatars, listVoices } from '../src/provider.js';

const VERSION = '0.2.0';
const HELP = `CANO HeyGen Presenter ${VERSION}

Usage:
  cano-heygen init [--seed config.json] [--config config/heygen.local.json]
  cano-heygen doctor [--config file]
  cano-heygen avatars [--config file]
  cano-heygen voices [--config file]
  cano-heygen validate <request.json>
  cano-heygen estimate <request.json> [--config file]
  cano-heygen render <request.json> [--mock|--live --approve-spend] [--config file]
  cano-heygen --help | --version

Live generation requires an authorized identity, configured environment variables and --approve-spend.`;

async function load(file) { return JSON.parse(await readFile(file, 'utf8')); }
function valueAfter(args, name, fallback = null) { const index = args.indexOf(name); return index >= 0 ? (args[index + 1] ?? fallback) : fallback; }

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  if (!cmd || ['help','--help','-h'].includes(cmd)) { console.log(HELP); return; }
  if (['version','--version','-v'].includes(cmd)) { console.log(VERSION); return; }
  const configFile = valueAfter(args, '--config', 'config/heygen.local.json');

  if (cmd === 'init') {
    const result = await runHeyGenSetup({ seedFile: valueAfter(args, '--seed'), outputFile: configFile });
    console.log(JSON.stringify({ status: 'CONFIGURED', ...result }, null, 2));
    return;
  }
  if (cmd === 'doctor') { console.log(JSON.stringify(await runHeyGenDoctor({ configFile }), null, 2)); return; }

  const { config } = await loadHeyGenConfig(configFile);
  if (cmd === 'avatars') { console.log(JSON.stringify(await listAvatars(config), null, 2)); return; }
  if (cmd === 'voices') { console.log(JSON.stringify(await listVoices(config), null, 2)); return; }

  const file = args[1];
  if (!file) throw new Error('request file is required. Run cano-heygen --help');
  const request = await load(file);
  const check = validatePresenterRequest(request);
  if (!check.ok) throw new Error(check.errors.join('; '));
  const estimate = estimateCost(request, { creditsPerMinute: config.creditsPerMinute });
  assertWithinBudget(estimate, config);
  if (cmd === 'validate') { console.log(JSON.stringify({ ok: true, projectId: request.projectId }, null, 2)); return; }
  if (cmd === 'estimate') { console.log(JSON.stringify(estimate, null, 2)); return; }
  if (cmd === 'render') {
    const profile = await load(path.resolve(request.profile));
    const out = path.resolve(config.runtimeDir, 'jobs', request.projectId, 'presenter');
    const live = args.includes('--live');
    if (live && !args.includes('--approve-spend')) throw new Error('live generation requires --approve-spend after reviewing the estimate');
    const result = live ? await renderLive(request, profile, out, { config }) : await renderMock(request, out);
    console.log(JSON.stringify({ ...result, outDir: out, cost: estimate }, null, 2));
    return;
  }
  throw new Error(`unknown command: ${cmd}`);
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
