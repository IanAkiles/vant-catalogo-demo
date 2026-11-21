import {test,expect} from '@playwright/test';
import {initialProducts} from '../src/catalog.js';

test('compiled Pages site loads assets, cart, direct admin and recovery subpath',async({page,context})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let recovery;
 await context.route('https://fonts.googleapis.com/**',r=>r.fulfill({contentType:'text/css',body:''}));
 await context.route('https://vant-qa.supabase.co/**',async r=>{
  const url=new URL(r.request().url());
  if(url.pathname==='/rest/v1/products')return r.fulfill({json:initialProducts});
  if(url.pathname==='/auth/v1/recover'){recovery=url.searchParams.get('redirect_to');return r.fulfill({json:{}});}
  throw Error('Unexpected backend request: '+url.pathname);
 });
 await page.goto('./');
 await expect(page.locator('.product')).toHaveCount(4);
 await expect.poll(()=>page.locator('.brand img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
 expect(new URL(await page.locator('.brand img').getAttribute('src'),page.url()).pathname).toBe('/vant-catalogo-demo/assets/vant-reference.png');
 const favicon=await page.request.get('/vant-catalogo-demo/favicon.png');expect(favicon.ok()).toBe(true);
 await page.getByRole('button',{name:'Ver Camiseta Logo Cream',exact:true}).click();
 await page.getByRole('dialog').getByRole('button',{name:'M',exact:true}).click();
 await page.getByRole('button',{name:'Adicionar à sacola'}).click();
 const href=await page.getByRole('link',{name:'Finalizar no WhatsApp'}).getAttribute('href');
 expect(new URL(href).searchParams.get('text')).toContain('/vant-catalogo-demo/#peca-vant-001');
 const response=await page.goto('admin/');expect(response.status()).toBe(200);
 await expect(page.getByRole('heading',{name:'Sua loja começa aqui.'})).toBeVisible();
 await page.reload();await expect(page.getByRole('heading',{name:'Sua loja começa aqui.'})).toBeVisible();
 await page.getByRole('button',{name:'Esqueci minha senha'}).click();
 await page.getByLabel('E-mail',{exact:true}).fill('owner@example.test');
 await page.getByRole('button',{name:'Enviar instruções'}).click();
 await expect(page.getByRole('status')).toContainText('Se o endereço estiver cadastrado');
 expect(recovery).toBe('http://127.0.0.1:4188/vant-catalogo-demo/admin/');
 await page.getByRole('link',{name:'Ver vitrine'}).click();
 await expect(page).toHaveURL('http://127.0.0.1:4188/vant-catalogo-demo/');
 const direct=await page.goto('admin');expect(direct.status()).toBe(200);
 await expect(page.getByRole('heading',{name:'Sua loja começa aqui.'})).toBeVisible();
 expect(errors).toEqual([]);
});
