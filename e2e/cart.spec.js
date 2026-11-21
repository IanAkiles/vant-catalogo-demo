import {test, expect} from './fixtures.js';

async function add(page, name, size) {
  await page.getByRole('button', {name: `Ver ${name}`, exact: true}).click();
  await page.getByRole('dialog').getByRole('button', {name: size, exact: true}).click();
  await page.getByRole('button', {name: 'Adicionar à sacola', exact: true}).click();
}

test('SAC-01 multiple products, merged sizes, persistence, totals and removal', async ({page,context}, testInfo) => {
  await page.goto('/');
  await add(page,'Camiseta Logo Cream','M');
  await page.getByRole('button', {name:'Continuar comprando'}).click();
  await add(page,'Moletom Essential Preto','G');
  await page.getByRole('button', {name:'Continuar comprando'}).click();
  await add(page,'Camiseta Logo Cream','M');
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await expect(page.locator('.order-total')).toContainText('637,00');
  await page.getByRole('button', {name:'Continuar comprando'}).click();
  await add(page,'Camiseta Logo Cream','G');
  await expect(page.locator('.cart-item')).toHaveCount(3);
  await page.reload();
  await page.getByRole('button', {name:/Abrir sacola/}).click();
  await expect(page.locator('.cart-item')).toHaveCount(3);
  await expect(page.locator('.order-total')).toContainText('796,00');
  const row = page.locator('.cart-item').filter({hasText:'Moletom Essential Preto'});
  await row.getByRole('button', {name:/Aumentar/}).click();
  await expect(page.locator('.order-total')).toContainText('1.115,00');
  await row.getByRole('button', {name:/Diminuir/}).click();
  const url = new URL(await page.getByRole('link',{name:'Finalizar no WhatsApp'}).getAttribute('href'));
  expect(url.pathname).toBe('/556993173172');
  for (const part of ['Camiseta Logo Cream','Moletom Essential Preto','796,00','Tamanho: M','Tamanho: G']) expect(url.searchParams.get('text')).toContain(part);
  expect(await page.getByRole('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
  await page.screenshot({path:testInfo.outputPath('cart.png'),fullPage:true});
  await page.getByRole('link',{name:'Finalizar no WhatsApp'}).scrollIntoViewIfNeeded();
  await page.screenshot({path:testInfo.outputPath('cart-total.png')});
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.getByText('Ver mensagem do pedido',{exact:true}).click();
  await page.getByRole('button',{name:'Copiar mensagem'}).click();
  await expect(page.getByText('Mensagem copiada.',{exact:true})).toBeVisible();
  // Windows clipboard normalizes line endings to CRLF.
  expect((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n')).toBe(url.searchParams.get('text'));
  await row.getByRole('button',{name:/Remover/}).click();
  await expect(page.locator('.order-total')).toContainText('477,00');
  while(await page.locator('.cart-item').count()) await page.locator('.cart-item').first().getByRole('button',{name:/Remover/}).click();
  await expect(page.getByText('Sua sacola está vazia.')).toBeVisible();
  await expect(page.getByRole('link',{name:'Finalizar no WhatsApp'})).toHaveCount(0);
});

test('SAC-02 refresh prices and prevent ordering a hidden product', async ({page,qa}) => {
  await page.goto('/');
  await add(page,'Camiseta Logo Cream','M');
  qa.rows[0].price=19900;
  await page.reload();
  await page.getByRole('button',{name:/Abrir sacola/}).click();
  await expect(page.locator('.order-total')).toContainText('199,00');
  qa.rows[0].hidden=true;
  await page.reload();
  await page.getByRole('button',{name:/Abrir sacola/}).click();
  await expect(page.getByText('Peça ou variação indisponível. Remova para continuar.')).toBeVisible();
  await expect(page.getByRole('link',{name:'Finalizar no WhatsApp'})).toHaveCount(0);
});
