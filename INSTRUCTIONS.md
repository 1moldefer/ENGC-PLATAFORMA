# Instruções de Setup e Deploy - Engenharia Clínica App

Este projeto foi configurado com Supabase (Backend) e React + Vite (Frontend).

## 1. Backend (Supabase)

O banco de dados já foi inicializado com as tabelas e políticas de segurança (RLS).

### Verificações Manuais (Dashboard do Supabase)
1. **Storage**:
   - Vá até a aba **Storage**.
   - Verifique se o bucket `anexos` existe.
   - O bucket deve ser **Private** (Público = Desmarcado).
   - Se não existir, crie-o com o nome `anexos`.

2. **Authentication**:
   - Vá até **Authentication > Providers**.
   - Garanta que **Email** está habilitado.
   - Desabilite "Confirm email" se quiser testar login imediato sem verificar caixa de entrada (Opcional, apenas para dev).

## 2. Edge Functions (IA)

As funções estão localizadas em `supabase/functions/`.

### Deploy das Funções
Você precisa da CLI do Supabase instalada.

1. Instale a CLI (se não tiver):
   ```bash
   npm install -g supabase
   ```
2. Faça login:
   ```bash
   supabase login
   ```
   (Cole seu Access Token quando solicitado)

3. Link o projeto:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF_HERE
   ```
   (Digite a senha do banco quando solicitado)

4. Configure as variáveis de ambiente (Segredos):
   ```bash
   supabase secrets set OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
   supabase secrets set OPENAI_MODEL=gpt-4o-mini
   ```
   
   > ⚠️ **IMPORTANTE**: Substitua `YOUR_OPENAI_API_KEY_HERE` pela sua chave real da OpenAI.
   > Nunca commite chaves de API em repositórios públicos!

5. Faça o Deploy:
   ```bash
   supabase functions deploy ai-chat-pop
   supabase functions deploy ai-relatorio-mensal
   ```

## 3. Frontend

O código do frontend está pronto em `src/`.

### Configuração do Ambiente
1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Edite o `.env` com suas credenciais reais:
   ```
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Execute o projeto localmente:
   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:5173`.
   - Crie uma conta em "Sign Up".
   - Você será logado automaticamente e redirecionado ao Dashboard.

## 4. Estrutura do Projeto

- **/src/pages**: Telas principais (Login, Dashboard, Chamados, etc).
- **/src/components/layout**: Sidebar e estrutura base.
- **/src/contexts**: AuthContext para gerenciar sessão.
- **/src/lib**: Cliente Supabase configurado.
- **/supabase/functions**: Código backend (Serverless/Edge) para IA.
- **/supabase/migrations**: Histórico do SQL executado.

## 5. Segurança

- ⚠️ **NUNCA** commite arquivos `.env` com credenciais reais
- Use `.env.example` como template (sem valores reais)
- Rotacione chaves de API se expostas acidentalmente
- Consulte `SECURITY.md` para mais informações

## 6. Próximos Passos (Sugestões)
- Implementar formulário de criação de chamados (já existe o botão e a rota, falta o form).
- Implementar upload de imagens usando `supabase.storage`.
- Conectar o chat de IA na tela de POPs (chamar `supabase.functions.invoke('ai-chat-pop')`).
