# Personas, critérios e roteiro

## Personas

- Compradora no celular: encontra peças, vê tamanhos e encaminha sua escolha à loja.
- Comprador no computador ou teclado: busca, compara, abre detalhes e fecha diálogos sem perder orientação.
- Proprietária: entra em `/admin`, mantém rascunhos e publica peças com foto e preço corretos.
- Conta sem autorização: não pode administrar o catálogo.

## Critérios executáveis

Os IDs abaixo correspondem aos títulos em `e2e/*.spec.js`; cada cenário roda em Chromium desktop e emulação Pixel 7.

| ID | Dado / Quando / Então |
| --- | --- |
| CAT-01 | Dado um catálogo com quatro peças, quando filtrar categoria e buscar um nome inexistente, então mostrar resultado vazio e permitir restaurar todas as peças; não exibir administração na vitrine. |
| PED-01 | Dada uma camiseta, quando abrir detalhes, então exigir tamanho; quando escolher M, cor Creme e duas unidades, então preparar mensagem com produto, tamanho, cor, quantidade, subtotal e link, destinada a `556993173172`. Não enviar mensagem no teste. |
| A11Y-01 | Dado o botão da peça, quando abrir o diálogo, então o leitor de tela encontra seu nome; Escape fecha e devolve foco ao botão. |
| MOB-01 | Dada a vitrine mobile, então há duas colunas, fotos em 3:4 e nenhuma rolagem horizontal da página; quando usar as setas, então categorias avançam e retornam; a seta do topo abre mais opções. |
| ERR-01 | Dado serviço indisponível, quando abrir a vitrine, então exibir erro sem produtos fictícios; quando o serviço recuperar, atualizar recarrega o catálogo. |
| AUTH-01 | Dado login incorreto, então mostrar erro; quando solicitar recuperação, então emitir pedido ao serviço e confirmação neutra. Isso não prova entrega de e-mail. |
| AUTH-02 | Dada conta autenticada sem permissão de proprietária, então bloquear painel e não carregar produtos administrativos. RLS é validada separadamente em `tests/rls.test.mjs`. |
| ADM-01 | Dada proprietária autenticada, quando cadastrar peça, então rejeitar arquivo inválido e criar oculta; falha ao salvar preserva campos; editar altera preço; publicar exibe na vitrine e ocultar remove; cancelar exclusão preserva peça, confirmar remove; sair retorna ao login. |

## Roteiro de verificação

1. Verificar diff e ambiente sem expor `.env.local`.
2. Build e testes Node (incluindo políticas SQL em PGlite).
3. Executar os oito cenários acima nos dois projetos Playwright (16 execuções).
4. Revisar screenshots desktop/mobile, erros JS e traces das falhas.
5. Conferir workflow `VANT QA` do SHA correspondente; registrar falhas e limitações.
6. Validar manualmente, com autorização e dados de teste, o Supabase real, e-mail de recuperação e continuidade da conversa no WhatsApp antes de declarar produção validada.

## Condição de aprovação

Build, testes Node e 16 execuções Playwright aprovados, sem exceções JS nem chamadas externas inesperadas; nenhum defeito crítico introduzido no diff. CI só recebe status aprovado depois de execução concluída no GitHub. Aprovação local não significa validação em produção, Firefox, Safari ou dispositivo físico.
