import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePresenterRequest } from '../src/validate.js';
import { assertWithinBudget, estimateCost } from '../src/cost.js';
import { normalizeHeyGenConfig, validateHeyGenConfig } from '../src/config.js';

const request = { version:'1.0', projectId:'demo-avatar', profile:'profiles/example.profile.json', aspectRatio:'9:16', segments:[{ id:'hook', purpose:'hook', script:'Hola mundo desde Cano Digital' }] };

test('valid request and local config pass', () => {
  assert.equal(validatePresenterRequest(request).ok, true);
  assert.equal(validateHeyGenConfig(normalizeHeyGenConfig()).ok, true);
});

test('cost estimate is positive and budget gate works', () => {
  const estimate = estimateCost(request, { creditsPerMinute: 1 });
  assert.ok(estimate.estimatedSeconds > 0);
  assert.equal(assertWithinBudget(estimate, { maxEstimatedCreditsPerJob: 2 }), true);
  assert.throws(() => assertWithinBudget({ estimatedCredits: 3 }, { maxEstimatedCreditsPerJob: 2 }), /exceeds/);
});
