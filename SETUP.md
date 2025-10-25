# Guia de Configuração Rápida

## ⚡ Setup em 5 Minutos

### 1. Instalar Dependências
\`\`\`bash
npm install
\`\`\`

### 2. Criar Banco de Dados
\`\`\`bash
mysql -u root -p
CREATE DATABASE cupons_linux CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit
\`\`\`

### 3. Executar Scripts SQL
\`\`\`bash
# Execute todos os scripts na ordem
for script in scripts/*.sql; do
  mysql -u root -p cupons_linux < "$script"
done
\`\`\`

### 4. Configurar Variáveis de Ambiente
\`\`\`bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
\`\`\`

### 5. Iniciar Servidor
\`\`\`bash
npm run dev
\`\`\`

## 🔑 Variáveis de Ambiente Obrigatórias

\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=cupons_linux
\`\`\`

## 🎯 Próximos Passos

1. Acesse http://localhost:3000
2. Cadastre-se como usuário
3. Atualize seu papel para admin no banco:
   \`\`\`sql
   UPDATE usuarios SET papel = 'admin' WHERE email = 'seu@email.com';
   \`\`\`
4. Acesse o painel admin em http://localhost:3000/admin

## 🔧 Troubleshooting

### Erro de Conexão MySQL
- Verifique se o MySQL está rodando
- Confirme usuário e senha em `.env.local`
- Teste a conexão: `mysql -u root -p`

### Erro "Table doesn't exist"
- Execute todos os scripts SQL na ordem correta
- Verifique se o banco `cupons_linux` foi criado

### Erro no Stripe
- Configure as chaves em `.env.local`
- Siga o guia em `STRIPE_SETUP.md`
