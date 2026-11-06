# VANT — demo de catálogo

Demo navegável: fundo creme, logo centralizada, ícones azuis, catálogo sem faixa azul e editorial. React + Vite, sem backend.

## Executar

Node.js 20.19+ ou 22.12+.

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 4173
```

```sh
node --test tests/catalog.test.mjs
npm run build
npm run test:sites
```

## Demonstrar

1. Explore categorias e busca.
2. Abra uma peça, selecione tamanho, cor e quantidade.
3. Prepare o pedido para revisar/copiar a mensagem. Não existe contato de WhatsApp predefinido.
4. No rodapé, abra **Painel demonstrativo** para cadastrar, editar, ocultar ou excluir peças.
5. Opcionalmente configure um número autorizado (55 + DDD + número) em Configuração. O comprador precisa enviar a mensagem no WhatsApp.

## Limites

- Painel demonstrativo SEM autenticação. Não usar em produção.
- Produtos e contato ficam no localStorage deste navegador. Não sincronizam; limpar dados remove alterações.
- Sem confirmação de pedido, reserva de estoque, pagamentos ou cálculo de entrega.
- Upload JPG/PNG/WebP até 1,5 MB, sujeito ao espaço do navegador. Exporte JSON e guarde as fotos originais.
- Imagens, preços e descrições ilustrativos. Imagens reaproveitam os mockups VANT por enquadramento CSS; não representam estoque real.
- Backend, autenticação, regras de acesso e recuperação de dados precisam ser implementados separadamente na versão de produção.
- Não incluir credenciais, proposta comercial ou dados pessoais da cliente no repositório.

## Publicação

`npm run build` gera `dist/client` para hospedagem estática. O adaptador Sites do template foi preservado. GitHub armazena código; push não publica automaticamente um site.
