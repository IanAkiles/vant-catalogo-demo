import test from 'node:test';
import assert from 'node:assert/strict';
import {backendConfig} from '../src/backend-config.js';
const jwt=role=>`header.${Buffer.from(JSON.stringify({role})).toString('base64url')}.signature`;
test('only absent configuration enables demo mode',()=>{
 assert.equal(backendConfig().mode,'demo');
 assert.equal(backendConfig('https://example.supabase.co').mode,'invalid');
 assert.equal(backendConfig('','sb_publishable_example').mode,'invalid');
});
test('frontend rejects privileged keys and insecure or malformed project URLs',()=>{
 for(const key of ['sb_secret_example',jwt('service_role'),'broken'])assert.equal(backendConfig('https://example.supabase.co',key).mode,'invalid');
 for(const url of ['http://example.com','https://user:pass@example.com','https://example.com/path','https://example.com?key=x'])assert.equal(backendConfig(url,jwt('anon')).mode,'invalid');
 assert.equal(backendConfig('https://example.supabase.co',jwt('anon')).mode,'cloud');
 assert.equal(backendConfig('https://example.supabase.co','sb_publishable_example').mode,'cloud');
});
