# 🔒 SECURITY.md - Guia de Segurança do Projeto

## ⚠️ INFORMAÇÕES CRÍTICAS DE SEGURANÇA

### 1. Variáveis de Ambiente

**NUNCA** commite arquivos `.env` no repositório. Todas as credenciais devem estar em variáveis de ambiente:

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas credenciais REAIS
# VITE_SUPABASE_URL=https://seu-projeto.supabase.co
# VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 2. Chaves do Supabase

- ✅ **ANON KEY**: Pode ser usada no frontend (é pública)
- ❌ **SERVICE ROLE KEY**: NUNCA use no frontend, apenas em backend/servidor

### 3. Row Level Security (RLS)

Todas as tabelas do Supabase DEVEM ter RLS habilitado:

```sql
ALTER TABLE nome_da_tabela ENABLE ROW LEVEL SECURITY;
```

### 4. Arquivos Sensíveis

Os seguintes arquivos/pastas estão no `.gitignore` por segurança:
- `.env*` (todos os arquivos de ambiente)
- `supabase/` (migrations podem conter dados sensíveis)
- `node_modules/`
- `dist/` e `build/`

### 5. Checklist de Segurança Antes do Deploy

- [ ] Arquivo `.env` NÃO está commitado
- [ ] `.env.example` está atualizado (sem valores reais)
- [ ] RLS está habilitado em todas as tabelas
- [ ] Políticas de RLS estão configuradas corretamente
- [ ] Service Role Key não está no código frontend
- [ ] CORS está configurado corretamente no Supabase

### 6. Configuração de Produção

Para produção, configure as variáveis de ambiente na plataforma de deploy:

**Vercel/Netlify:**
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

**Render/Railway:**
Adicione as mesmas variáveis no painel de configuração.

### 7. Auditoria de Segurança

Execute regularmente:
```bash
# Verificar se há credenciais expostas
git log --all --full-history --source -- **/.env

# Verificar arquivos grandes (possíveis dumps de DB)
git rev-list --objects --all | sort -k 2 | cut -f 2 -d\  | uniq
```

### 8. Em Caso de Vazamento de Credenciais

1. **Rotacione IMEDIATAMENTE** as chaves no Supabase
2. Revogue tokens comprometidos
3. Verifique logs de acesso não autorizado
4. Limpe o histórico do Git se necessário:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch .env" \
   --prune-empty --tag-name-filter cat -- --all
   ```

## 📞 Contato de Segurança

Para reportar vulnerabilidades de segurança, entre em contato com a equipe de desenvolvimento.

---
**Última atualização:** 2025-12-30
