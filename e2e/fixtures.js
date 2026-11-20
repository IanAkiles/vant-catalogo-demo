import {test as base, expect} from '@playwright/test';
import {initialProducts} from '../src/catalog.js';
import {readFileSync} from 'node:fs';

const photo = readFileSync(new URL('../public/favicon.png', import.meta.url));
const user = {id: '00000000-0000-0000-0000-000000000001', email: 'owner@example.test', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z'};
const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
const session = () => ({access_token: `${encode({alg: 'HS256'})}.${encode({sub: user.id, exp: Math.floor(Date.now()/1000)+3600, aud: 'authenticated', role: 'authenticated'})}.test`, refresh_token: 'test-refresh', token_type: 'bearer', expires_in: 3600, user});

export const test = base.extend({
  qa: [async ({context}, use) => {
    const state = {rows: initialProducts.map(p => ({...p, image_path: `${p.id}/photo.png`, created_at: '2026-01-01T00:00:00Z'})), owner: true, failSave: false, failLoad: false, calls: [], unexpected: [], errors: []};
    context.on('page', page => page.on('pageerror', error => state.errors.push(error.message)));
    // Fail closed: only the isolated local app and mocked service may be requested.
    await context.route('**/*', async route => {
      const req = route.request(), url = new URL(req.url());
      if (url.origin === 'http://127.0.0.1:4187') return route.continue();
      // Deterministic offline font fallback; no Google requests leave the browser.
      if (url.origin === 'https://fonts.googleapis.com') return route.fulfill({contentType: 'text/css', body: ''});
      if (url.origin !== 'https://vant-qa.supabase.co') {
        state.unexpected.push(req.url());
        return route.abort();
      }
      const path = url.pathname, method = req.method();
      state.calls.push({path, method});
      const body = req.headers()['content-type']?.includes('application/json') && req.postData() ? req.postDataJSON() : {};
      const reply = (data, status = 200) => route.fulfill({status, json: data});
      if (path === '/auth/v1/token') return body.password === 'Correct-test-password' ? reply(session()) : reply({error: 'invalid_grant', error_description: 'Invalid credentials'}, 400);
      if (path === '/auth/v1/user') return reply(user);
      if (['/auth/v1/recover', '/auth/v1/logout'].includes(path)) return reply({});
      if (path === '/rest/v1/rpc/is_store_owner') return reply(state.owner);
      if (path === '/rest/v1/products') {
        if (method === 'GET') return state.failLoad ? reply({message: 'Unavailable'}, 503) : reply(url.searchParams.get('hidden') === 'eq.false' ? state.rows.filter(p => !p.hidden) : state.rows);
        if (!state.owner) return reply({message: 'Forbidden'}, 403);
        const id = url.searchParams.get('id')?.replace('eq.', '');
        if (method === 'POST') {
          if (state.failSave) return reply({message: 'Unavailable'}, 503);
          const row = {...body, created_at: '2026-01-01T00:00:00Z'};
          state.rows = [...state.rows.filter(p => p.id !== row.id), row];
          return reply(row);
        }
        if (method === 'PATCH') {
          const row = state.rows.find(p => p.id === id); Object.assign(row, body); return reply(row);
        }
        if (method === 'DELETE') {state.rows = state.rows.filter(p => p.id !== id); return reply({id});}
      }
      if (path.startsWith('/storage/v1/object/public/')) return route.fulfill({contentType: 'image/png', body: photo});
      if (path.startsWith('/storage/v1/object/')) return reply({Key: 'product-photos/test', Id: 'test'});
      state.unexpected.push(req.url());
      return route.abort();
    });
    await use(state);
    expect(state.unexpected, 'No external or unmocked requests').toEqual([]);
    expect(state.errors, 'No browser JavaScript exceptions').toEqual([]);
  }, {auto: true}],
});
export {expect};
export async function login(page) {
  await page.goto('/admin');
  await page.getByLabel('E-mail', {exact: true}).fill(user.email);
  await page.getByLabel('Senha', {exact: true}).fill('Correct-test-password');
  await page.getByRole('button', {name: 'Entrar no painel'}).click();
}
