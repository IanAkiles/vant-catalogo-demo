import {test, expect} from './fixtures.js';

test('CAT-01 search, categories and empty result recovery', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('.product')).toHaveCount(4);
  await page.getByRole('button', {name: 'Camisetas', exact: true}).click();
  await expect(page.locator('.product')).toHaveCount(1);
  await page.getByRole('button', {name: 'Buscar produtos'}).click();
  await page.getByLabel('Pesquisar no catálogo').fill('inexistente');
  await expect(page.getByText('Nenhuma peça por aqui.')).toBeVisible();
  await page.getByRole('button', {name: 'Ver todas as peças'}).click();
  await expect(page.locator('.product')).toHaveCount(4);
  await expect(page.getByRole('button', {name: 'Nova peça'})).toHaveCount(0);
});

test('PED-01 size, color, quantity and exact WhatsApp destination', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button', {name: 'Ver Camiseta Logo Cream', exact: true}).click();
  await expect(page.getByRole('button', {name: 'Selecione um tamanho'})).toBeDisabled();
  await page.getByRole('dialog').getByRole('button', {name: 'M', exact: true}).click();
  await page.getByRole('button', {name: 'Aumentar quantidade'}).click();
  await page.getByRole('button', {name: 'Preparar pedido'}).click();
  const link = page.getByRole('link', {name: 'Abrir no WhatsApp'});
  const url = new URL(await link.getAttribute('href'));
  expect(url.origin + url.pathname).toBe('https://wa.me/556993173172');
  const message = url.searchParams.get('text');
  for (const text of ['Produto: Camiseta Logo Cream', 'Tamanho: M', 'Cor: Creme', 'Quantidade: 2', '318,00', '#peca-vant-001']) expect(message).toContain(text);
  // Inspect destination without sending a message or contacting WhatsApp.
  await expect(page.locator('.order-total')).toContainText('318,00');
});

test('A11Y-01 dialog has an accessible name, Escape restores focus', async ({page}) => {
  await page.goto('/');
  const trigger = page.getByRole('button', {name: 'Ver Camiseta Logo Cream', exact: true});
  await trigger.click();
  await expect(page.getByRole('dialog')).toHaveAccessibleName('DETALHES DA PEÇA');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('MOB-01 columns, portrait photos, category arrows and menu', async ({page, isMobile}, testInfo) => {
  await page.goto('/');
  await expect(page.locator('.product')).toHaveCount(4);
  await page.locator('.products').evaluate(async el => {await Promise.all(el.getAnimations({subtree: true}).map(a => a.finished));});
  const cards = await page.locator('.product').evaluateAll(nodes => nodes.map(n => {const r=n.getBoundingClientRect(); return {x:r.x,y:r.y};}));
  expect(cards[0].y).toBe(cards[1].y);
  if (isMobile) expect(cards[2].y).toBeGreaterThan(cards[0].y);
  const photo = await page.locator('.product-open').first().boundingBox();
  expect(photo.height / photo.width).toBeCloseTo(4/3, 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (isMobile) {
    await page.getByRole('button', {name: 'Ver mais categorias à direita'}).click();
    await expect(page.getByRole('button', {name: 'Ver categorias anteriores'})).toBeVisible();
    await page.getByRole('button', {name: 'Ver categorias anteriores'}).click();
    await expect.poll(() => page.locator('#category-list').evaluate(el => el.scrollLeft)).toBe(0);
    await page.getByRole('button', {name: 'Mais opções', exact: true}).click();
    await expect(page.getByRole('navigation', {name: 'Mais opções da loja'})).toBeVisible();
  }
  await page.screenshot({path: testInfo.outputPath('catalog.png'), fullPage: true});
});

test('ERR-01 backend failure does not display demo products', async ({page, qa}) => {
  qa.failLoad = true;
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar', {timeout: 20000});
  await expect(page.locator('.product')).toHaveCount(0);
  qa.failLoad = false;
  await page.getByRole('button', {name: 'Atualizar catálogo'}).click();
  await expect(page.locator('.product')).toHaveCount(4);
});
