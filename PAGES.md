# Testar pelo GitHub Pages

Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**. Não publique diretamente a raiz da branch: este projeto Vite precisa de compilação.

O workflow `Publish VANT to Pages` compila e envia somente `dist/client`. Roda automaticamente a cada push para `main`; também pode ser iniciado por **Actions → Publish VANT to Pages → Run workflow**.

- Catálogo: https://ianakiles.github.io/vant-catalogo-demo/
- Painel: https://ianakiles.github.io/vant-catalogo-demo/admin/

O build gera um arquivo real `admin/index.html`, por isso abrir ou recarregar o painel não depende de redirecionamento de erro 404. O mesmo código mantém suporte à raiz do domínio nas outras hospedagens.

## Configuração do catálogo

Em **Settings → Secrets and variables → Actions → Variables**, configure:

- `VITE_SUPABASE_URL`: URL do projeto da loja.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: chave pública `sb_publishable_...` (nunca uma chave secret/service_role).

O workflow recusa publicar sem configuração válida. Essas variáveis são públicas no navegador; permissões de escrita continuam protegidas pelo login e pelas políticas RLS. Nenhuma senha ou chave administrativa deve entrar no build.

No Supabase, em **Authentication → URL Configuration**, inclua a Redirect URL exata:

`https://ianakiles.github.io/vant-catalogo-demo/admin/`

Ela é necessária para o link de recuperação de senha voltar ao painel. Cadastros públicos continuam desativados e a proprietária usa sua conta autorizada. Não substituir outras URLs ainda em uso.

## Verificação

`npm run test:pages` compila com prefixo `/vant-catalogo-demo/` e backend fictício e usa um servidor estático sem fallback SPA. Testa imagens, favicon, sacola, links, acesso direto ao painel e destino da recuperação em desktop/mobile. Não envia e-mail nem altera produtos reais.
