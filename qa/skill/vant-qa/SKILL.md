---
name: vant-qa
description: Validar o catálogo e painel VANT com Playwright em navegador real, critérios de aceite em português, revisão de mudanças e diagnóstico de CI. Use ao testar compras via WhatsApp, responsividade, autenticação, cadastro de peças ou regressões da VANT.
---

# QA da VANT

1. Localize o repositório `vant-catalogo-demo` (package `vant-demo`). Neste computador, o checkout fica em `C:/Users/akile/Documents/Codex/2026-11-06/https-classofficial-com-br-https-classofficial/outputs/vant-demo`. Confira `git status`, branch e diff antes de editar. Preserve mudanças do usuário e a composição visual aprovada.
2. Leia [personas e critérios de aceite](references/acceptance.md). Identifique os critérios afetados e informações faltantes. Separe fatos observados, inferências e hipóteses.
3. Use a instalação oficial `@playwright/test` do projeto. Em checkout novo execute `npm ci` e `npx playwright install chromium`; no Linux de CI, `npx playwright install --with-deps chromium`. Não confunda o framework com uma skill fornecida pela Microsoft.
4. Execute `npm run build`, `npm test` e `npm run test:e2e`. O Playwright inicia seu próprio servidor em 4187, substitui explicitamente a configuração Supabase e intercepta o serviço com dados fictícios. Nunca reutilize um servidor de produção nem remova o bloqueio de rede para fazer um teste passar. Não altere `.env.local` nem use credenciais reais nos fixtures.
5. Para reproduzir falhas, use `npm run test:e2e:debug -- -g "ID"` ou `npm run test:e2e:ui`; para evidências use `npm run test:e2e:report` e `npx playwright show-trace caminho/trace.zip`. Clique, preencha e navegue com locators por papel/nome; aguarde condições observáveis, sem sleeps fixos. Inspecione screenshots para achados visuais. Não confunda emulação mobile com aparelho físico.
6. Reproduza defeitos antes de corrigir; diferencie seletor incorreto, fixture incompleto, falha de infraestrutura e falha do produto. Faça a menor correção e execute novamente os cenários afetados, depois a suíte. Não reduza critérios para ocultar erros. Não atualize screenshots de referência automaticamente.
7. Revise o diff: autorização no servidor/RLS, estados de erro, preservação de formulário, valores monetários, destino WhatsApp, acessibilidade, responsividade, dependências e ausência de segredos. Não alegue auditoria completa de segurança a partir de mocks.
8. Consulte o GitHub Actions do commit exato. Veja jobs e logs antes de repetir execução. Ausência de pipeline não equivale a aprovação. Não faça push, publique ou altere produtos reais sem autorização vigente da conversa. Esta skill não autoriza envios a terceiros.
9. Entregue relatório curto em português: versões, commit, critérios aprovados/reprovados, testes executados, correções, links de evidência e estado real do CI. Diferencie local, CI e produção; registre bloqueios e riscos que mudam a conclusão.

## Limites

Os testes de navegador usam backend simulado. Os testes PGlite exercitam SQL/RLS localmente. Integração real com Supabase, recebimento de e-mail, recuperação por link e envio de WhatsApp precisam de validação separada em ambiente autorizado. Nunca peça a senha da proprietária no chat; permita que ela autentique diretamente quando necessário.
