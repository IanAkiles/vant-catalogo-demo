# Ativação do painel VANT

O código está preparado para Supabase, mas nenhum projeto externo foi criado ou conectado. A loja continua em modo demonstrativo enquanto as duas variáveis estiverem vazias. Uma configuração parcial ou inválida bloqueia o acesso; não libera a demonstração como alternativa.

## 1. Conta e projeto

Crie a conta em https://supabase.com/dashboard e um projeto dedicado à VANT, preferencialmente sob controle da loja. Comece no plano Free sem ativar upgrade. Guarde a senha do banco em um gerenciador de senhas; ela não entra no frontend nem no GitHub.

Referência de limites consultada em 11/11/2026: Free inclui 500 MB de banco e 1 GB de arquivos e pode pausar após uma semana sem atividade. Isso não é uma garantia de hospedagem gratuita permanente. Confira https://supabase.com/pricing antes da ativação.

## 2. Banco e fotos

Em SQL Editor, execute **uma vez, em um projeto novo**, o arquivo `supabase/migrations/202611110001_catalog.sql`. Ele cria tabela de produtos, lista privada de proprietários, políticas de acesso e bucket de fotos. Nenhum produto demonstrativo é importado automaticamente.

O catálogo remoto começa vazio. Cadastre peças reais no painel após a ativação. Fotos: JPG/PNG/WebP, até 1,5 MB, de preferência 3:4. O bucket é público: ocultar uma peça retira seu cadastro da consulta pública, mas não torna secreta uma URL de foto já conhecida. Não envie documentos pessoais ou imagens confidenciais.

## 3. Conta autorizada

Em Authentication, desative novos cadastros públicos e o acesso anônimo. Mantenha o provedor de e-mail/senha. Configure comprimento mínimo de senha em 12 caracteres. Crie ou convide a conta da proprietária pelo painel do Supabase; ela deve definir a própria senha.

Copie o UUID da conta criada e, no SQL Editor, substitua o UUID de exemplo abaixo pelo correto:

```sql
insert into private.store_owners(user_id)
values ('UUID-DA-CONTA-DA-PROPRIETARIA');
```

Estar autenticado não basta: só as contas dessa tabela podem alterar produtos e fotos. Não coloque `private` na lista de schemas expostos pela Data API. Não conceda escrita nessa tabela às funções `anon` ou `authenticated`.

## 4. Recuperação por e-mail

Configure Site URL e as Redirect URLs exatas do site, incluindo `https://SEU-DOMINIO/admin`. Para desenvolvimento, permita `http://127.0.0.1:4173/admin`. Não use curingas amplos em produção.

Configure SMTP próprio antes da entrega. O SMTP padrão do Supabase é destinado a testes e restringe destinatários aos integrantes da equipe do projeto; não assuma que ele entregará e-mails para a cliente. Documentação: https://supabase.com/docs/guides/auth/auth-smtp.

O fluxo implementado solicita a recuperação e recebe o evento `PASSWORD_RECOVERY` para definir nova senha. A entrega do e-mail e o retorno de um link real ainda precisam ser testados na conta configurada.

## 5. Conectar a aplicação

Copie `.env.example` para `.env.local` e informe a URL do projeto e a chave **publishable**. Uma chave `anon` legada também é aceita. Nunca use `service_role`, `sb_secret_`, senha do banco ou token administrativo em variáveis `VITE_`.

```dotenv
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
```

Essas duas configurações são públicas por natureza; a segurança está nas políticas do banco. `.env.local` é ignorado pelo Git. Reinicie Vite e, na hospedagem, configure as mesmas variáveis antes de gerar o build. O site precisa de fallback de navegação para `index.html`, inclusive em `/admin`.

## 6. Validação obrigatória no serviço real

- Entrar com a proprietária, sair e recuperar senha por e-mail.
- Confirmar que visitantes e uma conta não autorizada não conseguem criar/alterar/excluir por API.
- Cadastrar uma peça com foto, publicar, conferir em outro dispositivo, ocultar e excluir uma peça de teste.
- Confirmar que peças ocultas não aparecem nas respostas públicas.
- Testar erro de rede e preservação do formulário, limite e tipo dos arquivos.
- Conferir destino do WhatsApp, sem disparar pedido real por engano.

Testes locais disponíveis: `node --test tests/*.test.mjs`. O teste de RLS executa a migração em PostgreSQL embarcado (PGlite), com fixtures de Auth/Storage. Ele não substitui a validação das APIs reais de Supabase, SMTP, Storage e políticas do projeto implantado.

## Operação e limites

- Alterações aparecem no próximo carregamento da vitrine ou ao retornar o foco à aba; não há atualização contínua por websocket.
- Fotos antigas não são apagadas automaticamente ao substituir/excluir peças, para evitar remover uma imagem ainda referenciada. É necessário revisar arquivos sem referência periodicamente e acompanhar a cota de armazenamento.
- Em erro de gravação, o formulário permanece preenchido. Uma foto recém-enviada é removida como tentativa de limpeza se a gravação falhar; uma falha de rede também pode impedir essa limpeza.
- Edições simultâneas da mesma peça seguem a última gravação; esta primeira versão é destinada a uma proprietária.
- Defina uma rotina de exportação/backup do banco e guarde fotos originais antes de usar em produção.
- Nenhuma conta, custo, domínio, SMTP ou hospedagem foi ativado por esta implementação.
