# ENGC - Plataforma de Engenharia Clínica

Sistema completo de gestão para Engenharia Clínica Hospitalar.

## 🚀 Funcionalidades

- ✅ **Inventário de Equipamentos** - Gestão completa de ativos médicos
- ✅ **Rondas de Inspeção** - Sistema multi-setorial com assinatura digital
- ✅ **Chamados Técnicos** - Abertura e acompanhamento de solicitações
- ✅ **Ordens de Serviço** - Gestão de manutenções preventivas e corretivas
- ✅ **Autenticação Completa** - Login, cadastro e recuperação de senha
- ✅ **Assistente IA** - Suporte técnico inteligente
- ✅ **Dashboard KPI** - Indicadores de performance
- ✅ **Relatórios** - Geração de documentos oficiais

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/1moldefer/ENGC-PLATAFORMA.git
cd ENGC-PLATAFORMA
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Supabase:
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

4. Execute o projeto:
```bash
npm run dev
```

## 🗄️ Banco de Dados

Execute as migrations do Supabase localizadas em `/supabase/migrations/` na ordem:
1. `20240101_init.sql`
2. Demais arquivos em ordem cronológica

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons**: Lucide React

## 📝 Licença

Proprietary - Todos os direitos reservados

## 👥 Autor

ENGC - Engenharia Clínica
