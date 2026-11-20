import {test, expect, login} from './fixtures.js';

test('AUTH-01 invalid login and recovery request', async ({page, qa}) => {
  await page.goto('/admin');
  await page.getByLabel('E-mail', {exact: true}).fill('owner@example.test');
  await page.getByLabel('Senha', {exact: true}).fill('wrong-password');
  await page.getByRole('button', {name: 'Entrar no painel'}).click();
  await expect(page.getByRole('status')).toContainText('Não foi possível entrar');
  await page.getByRole('button', {name: 'Esqueci minha senha'}).click();
  await page.getByRole('button', {name: 'Enviar instruções'}).click();
  await expect(page.getByRole('status')).toContainText('Se o endereço estiver cadastrado');
  expect(qa.calls.some(c => c.path === '/auth/v1/recover')).toBe(true);
});

test('AUTH-02 authenticated non-owner cannot manage products', async ({page, qa}) => {
  qa.owner = false;
  await login(page);
  await expect(page.getByRole('heading', {name: 'Acesso não autorizado.'})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Nova peça'})).toHaveCount(0);
  expect(qa.calls.filter(c => c.path === '/rest/v1/products')).toEqual([]);
});

test('ADM-01 create hidden, preserve failed save, edit, publish, hide, delete, logout', async ({page, qa}, testInfo) => {
  qa.rows = [];
  await login(page);
  await expect(page.getByRole('heading', {name: 'Seu catálogo, atualizado.'})).toBeVisible();
  await page.getByRole('button', {name: 'Nova peça', exact: true}).click();
  await page.getByLabel('Nome', {exact: true}).fill('Peça QA');
  await page.getByLabel('Preço (R$)', {exact: true}).fill('159.90');
  await page.getByLabel('Cores, separadas por vírgula').fill('Preto');
  await page.getByLabel('Foto da peça').setInputFiles({name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('invalid')});
  await expect(page.getByRole('status')).toContainText('Escolha JPG, PNG ou WebP');
  await page.getByLabel('Foto da peça').setInputFiles('public/favicon.png');
  qa.failSave = true;
  await page.getByRole('button', {name: 'Salvar peça', exact: true}).click();
  await expect(page.getByRole('status')).toContainText('Seus campos foram mantidos');
  await expect(page.getByLabel('Nome', {exact: true})).toHaveValue('Peça QA');
  qa.failSave = false;
  await page.getByRole('button', {name: 'Salvar peça', exact: true}).click();
  await expect(page.locator('.admin-row')).toHaveCount(1);
  expect(qa.rows[0].hidden).toBe(true);
  expect(qa.rows[0].price).toBe(15990);
  await page.getByRole('button', {name: 'Editar Peça QA', exact: true}).click();
  await page.getByLabel('Preço (R$)', {exact: true}).fill('179.90');
  await page.getByRole('button', {name: 'Salvar peça', exact: true}).click();
  await expect(page.locator('.admin-row')).toContainText('179,90');
  await page.getByRole('button', {name: 'Publicar Peça QA', exact: true}).click();
  await expect(page.locator('.admin-row')).toContainText('Publicada');
  await page.screenshot({path: testInfo.outputPath('owner-panel.png'), fullPage: true});
  await page.goto('/');
  await expect(page.locator('.product')).toHaveCount(1);
  await expect(page.locator('.product')).toContainText('Peça QA');
  await page.goto('/admin');
  await page.getByRole('button', {name: 'Ocultar Peça QA', exact: true}).click();
  await expect(page.locator('.admin-row')).toContainText('Oculta');
  await page.goto('/');
  await expect(page.getByText('Nenhuma peça por aqui.')).toBeVisible();
  await page.goto('/admin');
  await page.getByRole('button', {name: 'Excluir Peça QA', exact: true}).click();
  await page.getByRole('button', {name: 'Cancelar', exact: true}).click();
  await expect(page.locator('.admin-row')).toHaveCount(1);
  await page.getByRole('button', {name: 'Excluir Peça QA', exact: true}).click();
  await page.getByRole('button', {name: 'Excluir peça', exact: true}).click();
  await expect(page.locator('.admin-row')).toHaveCount(0);
  await page.getByRole('button', {name: 'Sair do painel'}).click();
  await expect(page.getByRole('heading', {name: 'Sua loja começa aqui.'})).toBeVisible();
});
