# Estrutura de Tabelas do Banco de Dados MySQL

## Tabelas em Português

Todas as tabelas do projeto estão padronizadas em **PORTUGUÊS** para manter consistência.

### 1. usuarios
- `id` - INT AUTO_INCREMENT PRIMARY KEY
- `nome` - VARCHAR(255)
- `email` - VARCHAR(255) UNIQUE
- `senha` - VARCHAR(255)
- `papel` - ENUM('usuario', 'admin')
- `avatar_url` - TEXT
- `stripe_customer_id` - VARCHAR(255)
- `criado_em` - TIMESTAMP
- `atualizado_em` - TIMESTAMP

### 2. cupons
- `id` - INT AUTO_INCREMENT PRIMARY KEY
- `titulo` - VARCHAR(255)
- `descricao` - TEXT
- `codigo` - VARCHAR(100) UNIQUE
- `desconto` - VARCHAR(50)
- `categoria` - VARCHAR(100)
- `loja` - VARCHAR(255)
- `expira_em` - DATE
- `e_premium` - BOOLEAN
- `criado_em` - TIMESTAMP
- `atualizado_em` - TIMESTAMP

### 3. favoritos
- `id` - INT AUTO_INCREMENT PRIMARY KEY
- `usuario_id` - INT (FK → usuarios.id)
- `cupon_id` - INT (FK → cupons.id)
- `criado_em` - TIMESTAMP

### 4. sessoes
- `id` - VARCHAR(255) PRIMARY KEY
- `usuario_id` - INT (FK → usuarios.id)
- `expira_em` - TIMESTAMP
- `criado_em` - TIMESTAMP

### 5. planos_assinatura
- `id` - INT AUTO_INCREMENT PRIMARY KEY
- `nome` - VARCHAR(255)
- `slug` - VARCHAR(100) UNIQUE
- `descricao` - TEXT
- `preco` - DECIMAL(10,2)
- `duracao_dias` - INT
- `limite_favoritos` - INT
- `acesso_premium` - BOOLEAN
- `ativo` - BOOLEAN
- `criado_em` - TIMESTAMP
- `atualizado_em` - TIMESTAMP

### 6. assinaturas
- `id` - INT AUTO_INCREMENT PRIMARY KEY
- `usuario_id` - INT (FK → usuarios.id)
- `plano_id` - INT (FK → planos_assinatura.id)
- `status` - ENUM('ativa', 'cancelada', 'expirada', 'pendente')
- `inicio_periodo_atual` - DATE
- `fim_periodo_atual` - DATE
- `cancelar_no_fim_periodo` - BOOLEAN
- `cancelada_em` - TIMESTAMP
- `stripe_subscription_id` - VARCHAR(255)
- `criado_em` - TIMESTAMP
- `atualizado_em` - TIMESTAMP

### 7. historico_assinaturas
- `id` - INT AUTO_INCREMENT PRIMARY KEY
- `assinatura_id` - INT (FK → assinaturas.id)
- `usuario_id` - INT (FK → usuarios.id)
- `plano_anterior_id` - INT (FK → planos_assinatura.id)
- `plano_novo_id` - INT (FK → planos_assinatura.id)
- `acao` - ENUM('criacao', 'upgrade', 'downgrade', 'cancelamento', 'renovacao')
- `observacoes` - TEXT
- `criado_em` - TIMESTAMP

### 8. pagamentos
- `id` - INT AUTO_INCREMENT PRIMARY KEY
- `assinatura_id` - INT (FK → assinaturas.id)
- `usuario_id` - INT (FK → usuarios.id)
- `valor` - DECIMAL(10,2)
- `metodo_pagamento` - ENUM('credit_card', 'pix', 'boleto')
- `status` - ENUM('pending', 'completed', 'failed', 'refunded')
- `pago_em` - TIMESTAMP
- `id_pagamento_provedor` - VARCHAR(255)
- `stripe_payment_intent_id` - VARCHAR(255)
- `criado_em` - TIMESTAMP
- `atualizado_em` - TIMESTAMP

### 9. feedback
- `id` - INT AUTO_INCREMENT PRIMARY KEY
- `nome` - VARCHAR(255)
- `email` - VARCHAR(255)
- `telefone` - VARCHAR(20)
- `assunto` - VARCHAR(255)
- `mensagem` - TEXT
- `status` - ENUM('novo', 'lido', 'respondido', 'resolvido')
- `timestamp` - TIMESTAMP
- `criado_em` - TIMESTAMP

### 10. conversas
- `id` - INT AUTO_INCREMENT PRIMARY KEY
- `feedback_id` - INT (FK → feedback.id)
- `admin_id` - INT (FK → usuarios.id)
- `criado_em` - TIMESTAMP
- `atualizado_em` - TIMESTAMP

### 11. mensagens_chat
- `id` - INT AUTO_INCREMENT PRIMARY KEY
- `conversa_id` - INT (FK → conversas.id)
- `remetente_id` - INT (FK → usuarios.id)
- `mensagem` - TEXT
- `lida` - BOOLEAN
- `criado_em` - TIMESTAMP

## Importante

⚠️ **NUNCA use nomes de tabelas em inglês** (users, subscriptions, payments, etc.)

✅ **SEMPRE use nomes em português** conforme listado acima

Para executar o script SQL completo, rode: `scripts/01-create-database.sql`
