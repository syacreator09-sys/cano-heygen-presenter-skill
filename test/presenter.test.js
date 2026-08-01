import test from 'node:test';import assert from 'node:assert/strict';import {validatePresenterRequest} from '../src/validate.js';import {estimateCost} from '../src/cost.js';
const req={version:'1.0',projectId:'demo-avatar',profile:'profiles/example.profile.json',aspectRatio:'9:16',segments:[{id:'hook',purpose:'hook',script:'Hola mundo desde Cano Digital'}]};
test('valid request passes',()=>assert.equal(validatePresenterRequest(req).ok,true));
test('cost estimate is positive',()=>assert.ok(estimateCost(req).estimatedSeconds>0));
