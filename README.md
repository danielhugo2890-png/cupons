# Linux Cupons - Plataforma de Cupons de Desconto

Sistema completo de gerenciamento de cupons de desconto com painel administrativo, sistema de assinaturas e integração com Stripe.

## 🚀 Funcionalidades

- ✅ Sistema de autenticação (login/cadastro)
- ✅ Catálogo de cupons com busca e filtros
- ✅ Sistema de favoritos
- ✅ Planos de assinatura (Básico, Premium, VIP)
- ✅ Integração com Stripe para pagamentos
- ✅ Painel administrativo completo
  - Gerenciamento de usuários
  - Gerenciamento de cupons
  - Gerenciamento de assinaturas
  - Sistema de feedback/contato
  - Dashboard com estatísticas
- ✅ Sistema de feedback com status (novo, lido, respondido)
- ✅ Design responsivo e moderno

## 📋 Pré-requisitos

- Node.js 18+ 
- MySQL 8.0+
- Conta Stripe (para pagamentos)

## 🔧 Instalação

### 1. Clone o repositório

\`\`\`bash
git clone <seu-repositorio>
cd linux-cupons
\`\`\`

### 2. Instale as dependências

\`\`\`bash
npm install
# ou
pnpm install
# ou
yarn install
\`\`\`

### 3. Configure o banco de dados

Crie um banco de dados MySQL:

\`\`\`sql
CREATE DATABASE cupons_linux CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
\`\`\`

Execute os scripts SQL na ordem:

\`\`\`bash
# 1. Criar estrutura do banco
mysql -u seu_usuario -p cupons_linux < scripts/01-create-database.sql

# 2. Popular com cupons de exemplo
mysql -u seu_usuario -p cupons_linux < scripts/02-seed-coupons.sql

# 3. Atualizar cupons premium
mysql -u seu_usuario -p cupons_linux < scripts/03-update-premium-coupons.sql

# 4. Adicionar role de admin
mysql -u seu_usuario -p cupons_linux < scripts/04-add-admin-role.sql

# 5. Criar tabela de assinaturas
mysql -u seu_usuario -p cupons_linux < scripts/05-create-subscriptions.sql

# 6. Adicionar campos do Stripe
mysql -u seu_usuario -p cupons_linux < scripts/06-add-stripe-fields.sql

# 7. Criar tabela de feedback
mysql -u seu_usuario -p cupons_linux < scripts/001-create-feedback-table.sql
\`\`\`

### 4. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Edite `.env.local` com suas credenciais:

\`\`\`env
# Banco de Dados
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=cupons_linux

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Ambiente
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 5. Configure o Stripe

Siga as instruções em `STRIPE_SETUP.md` para configurar:
- Produtos e preços
- Webhook endpoint
- Chaves de API

### 6. Inicie o servidor de desenvolvimento

\`\`\`bash
npm run dev
# ou
pnpm dev
# ou
yarn dev
\`\`\`

Acesse [http://localhost:3000](http://localhost:3000)

## 👤 Usuário Admin Padrão

Após executar os scripts, você pode criar um usuário admin manualmente:

\`\`\`sql
-- Criar usuário admin (senha: admin123)
INSERT INTO usuarios (nome, email, senha, papel) 
VALUES ('Admin', 'admin@linuxcupons.com', '$2a$10$YourHashedPasswordHere', 'admin');
\`\`\`

Ou cadastre-se normalmente e atualize o papel:

\`\`\`sql
UPDATE usuarios SET papel = 'admin' WHERE email = 'seu@email.com';
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
├── app/                    # Páginas Next.js (App Router)
│   ├── admin/             # Painel administrativo
│   ├── api/               # API Routes
│   ├── assinatura/        # Gerenciamento de assinatura
│   ├── cadastro/          # Página de cadastro
│   ├── checkout/          # Checkout de pagamento
│   ├── contato/           # Página de contato
│   ├── cupons/            # Catálogo de cupons
│   ├── entrar/            # Página de login
│   ├── painel/            # Painel do usuário
│   ├── planos/            # Página de planos
│   └── sobre/             # Sobre nós
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   └── ...               # Componentes customizados
├── lib/                   # Utilitários e configurações
│   ├── auth.ts           # Autenticação
│   ├── db.ts             # Conexão MySQL
│   ├── stripe.ts         # Configuração Stripe
│   └── ...
├── scripts/              # Scripts SQL
└── public/               # Arquivos estáticos
\`\`\`

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Sessões HTTP-only cookies
- Validação de entrada em todas as APIs
- Proteção contra SQL injection
- Rate limiting (recomendado adicionar)
- HTTPS obrigatório em produção

Veja `SECURITY.md` para mais detalhes.

## 🎨 Tecnologias

- **Framework**: Next.js 16 (App Router)
- **UI**: React 18 + Tailwind CSS 4
- **Componentes**: shadcn/ui + Radix UI
- **Banco de Dados**: MySQL 8
- **Pagamentos**: Stripe
- **Autenticação**: Custom (bcrypt + sessions)
- **Validação**: Zod
- **Ícones**: Lucide React

## 📝 Funcionalidades Administrativas

### Dashboard Admin (`/admin`)
- Estatísticas gerais
- Acesso rápido a todas as seções
- Busca em todas as tabelas

### Gerenciamento de Usuários (`/admin/usuarios`)
- Listar todos os usuários
- Buscar por nome ou email
- Editar informações
- Alterar papel (usuário/admin)
- Deletar usuários

### Gerenciamento de Cupons (`/admin/cupons`)
- Criar novos cupons
- Editar cupons existentes
- Buscar por título ou categoria
- Ativar/desativar cupons
- Definir cupons premium

### Gerenciamento de Assinaturas (`/admin/assinaturas`)
- Visualizar todas as assinaturas
- Buscar por usuário ou plano
- Ver status e datas
- Cancelar assinaturas

### Sistema de Feedback (`/admin/feedback`)
- Ver todas as mensagens de contato
- Buscar por nome, email ou assunto
- Marcar como lido/respondido
- Deletar mensagens

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe o projeto no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático

### Outras Plataformas

Certifique-se de:
- Configurar todas as variáveis de ambiente
- Ter um banco MySQL acessível
- Configurar o webhook do Stripe com a URL de produção

## 📄 Licença

Este projeto é privado e proprietário.

## 🤝 Suporte

Para dúvidas ou problemas, entre em contato através do formulário de contato no site.
