# QA da VANT

Playwright Test oficial (`@playwright/test`) automatiza Chromium real em desktop e emulação Pixel 7. A skill personalizada está versionada em [qa/skill/vant-qa/SKILL.md](qa/skill/vant-qa/SKILL.md) e instalada no Codex local como `$vant-qa`.

## Executar

```sh
npm ci
npx playwright install chromium
npm run build
npm test
npm run test:e2e
```

São 15 testes Node (incluindo SQL/RLS em PGlite e cálculos da sacola) e dez cenários E2E executados em dois projetos (20 execuções). Consulte [personas, roteiro e critérios](qa/skill/vant-qa/references/acceptance.md).

```sh
npm run test:e2e:ui
npm run test:e2e:debug -- -g A11Y-01
npm run test:e2e:report
```

O modo debug abre navegador e inspector. Relatórios ficam em `playwright-report/`; screenshots e traces em `test-results/`, ambos ignorados no Git. Para abrir um trace: `npx playwright show-trace caminho/trace.zip`.

## Isolamento e limites

O servidor de testes ocupa `127.0.0.1:4187` e recusa reutilizar outro servidor. A configuração de teste substitui o Supabase real por `https://vant-qa.supabase.co`; todas as respostas desse serviço são simuladas no navegador. Outras requisições externas são bloqueadas e falham o teste. O CSS de Google Fonts recebe resposta vazia local, usando a fonte alternativa. Fotos fictícias usam o favicon como fixture: screenshots são evidências funcionais/de layout, não referências fotográficas finais.

Nenhuma peça real é criada/excluída, nenhum e-mail é enviado e o link WhatsApp é inspecionado sem enviar mensagem. Autenticação/CRUD simulados não comprovam funcionamento do Supabase remoto, SMTP, recuperação completa por e-mail ou dispositivos físicos. Os testes SQL verificam políticas localmente.

## CI e revisão

O workflow `.github/workflows/qa.yml` executa build, testes Node e Playwright em pushes para main, PRs e execução manual. Relatórios são retidos por sete dias. Não usa segredos da loja. A aprovação vale para o SHA executado; pipeline de publicação do GitHub Pages não substitui o QA.

Na introdução desta suíte, o teste A11Y-01 reproduziu diálogos sem nome acessível. A correção adiciona `aria-label` com o título já exibido, sem mudança visual. A suíte verifica também fechamento por Escape e retorno do foco.

## Sacola

A sacola reúne combinações de peça, tamanho e cor; combinações iguais somam quantidades. Permite remover itens e ajustar de 1 a 10 unidades por combinação. A seleção é salva neste navegador, sem conta de comprador ou nova tabela no banco. Se o armazenamento estiver bloqueado, funciona apenas enquanto a página estiver aberta.

Preços são obtidos do catálogo carregado, nunca do armazenamento da sacola. Peças ocultas, removidas ou com variações indisponíveis bloqueiam a finalização até serem removidas. O WhatsApp recebe uma mensagem única com detalhes, subtotais e total das peças; frete continua a combinar. Abrir o WhatsApp não confirma envio nem limpa a sacola.
