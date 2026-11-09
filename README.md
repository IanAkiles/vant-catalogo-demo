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
   No desktop, passe o mouse na foto para revelar os tamanhos; no celular, eles ficam visíveis. Também funciona por teclado. Selecionar um tamanho abre a peça com essa opção marcada. No detalhe, toque na foto ou use “Ampliar detalhe” para aproximar a mesma imagem.
3. Prepare o pedido para revisar/copiar a mensagem. O contato padrão informado para a loja é +55 69 9317-3172. A mensagem só é enviada quando o comprador confirma no WhatsApp.
4. Abra `/admin` diretamente para cadastrar, editar, ocultar ou excluir peças. O painel é uma página separada, sem link na vitrine. “Ver vitrine” abre a loja em outra aba; alterações se refletem entre abas do mesmo navegador.
5. Opcionalmente configure um número autorizado (55 + DDD + número) em Configuração. O comprador precisa enviar a mensagem no WhatsApp.

## Limites

- Painel demonstrativo SEM autenticação. Não usar em produção.
- Separar a rota não protege o acesso. `/admin` ainda exige autenticação e autorização no servidor antes do uso real.
- Produtos e contato ficam no localStorage deste navegador. Não sincronizam; limpar dados remove alterações.
- Sem confirmação de pedido, reserva de estoque, pagamentos ou cálculo de entrega.
- Upload JPG/PNG/WebP até 1,5 MB, sujeito ao espaço do navegador. Exporte JSON e guarde as fotos originais.
- Imagens, preços e descrições ilustrativos. Imagens reaproveitam os mockups VANT por enquadramento CSS; não representam estoque real.
- Backend, autenticação, regras de acesso e recuperação de dados precisam ser implementados separadamente na versão de produção.
- Não incluir credenciais, proposta comercial ou dados pessoais da cliente no repositório.

## Publicação

`npm run build` gera `dist/client` para hospedagem estática. O adaptador Sites do template foi preservado. GitHub armazena código; push não publica automaticamente um site.

A hospedagem precisa de fallback de navegação para `index.html`, incluindo `/admin` e `/admin/`. Vite e o adaptador Sites já atendem essas rotas.

No celular, a seta ao lado da sacola abre Loja, Coleções e Sobre. A grade mantém duas peças por linha em quadros 3:4. As fotos quadradas do mockup são centralizadas com margem para preservar a peça inteira; fotos verticais originais ainda precisam ser fornecidas.

As setas nas categorias do celular permitem avançar e voltar. Cada seta aparece apenas quando há conteúdo escondido naquele lado. O contato pode ser substituído localmente no painel demonstrativo; limpar esse campo restaura o número padrão da loja.
