-- Script completo para criar o banco de dados MySQL
-- Execute este script no seu MySQL Workbench

CREATE DATABASE IF NOT EXISTS linux CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE linux;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  papel ENUM('usuario', 'admin') DEFAULT 'usuario' NOT NULL,
  avatar_url TEXT,
  stripe_customer_id VARCHAR(255),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_papel (papel),
  INDEX idx_stripe_customer_id (stripe_customer_id)
) ENGINE=InnoDB;

-- Tabela de cupons
CREATE TABLE IF NOT EXISTS cupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(100) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  desconto VARCHAR(50) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  loja VARCHAR(255) NOT NULL,
  expira_em DATE,
  e_premium BOOLEAN DEFAULT FALSE,
  url_imagem VARCHAR(500),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categoria (categoria),
  INDEX idx_loja (loja),
  INDEX idx_premium (e_premium)
) ENGINE=InnoDB;

-- Tabela de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  cupon_id INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (cupon_id) REFERENCES cupons(id) ON DELETE CASCADE,
  UNIQUE KEY favorito_unico (usuario_id, cupon_id),
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_cupon_id (cupon_id)
) ENGINE=InnoDB;

-- Tabela de sessões
CREATE TABLE IF NOT EXISTS sessoes (
  id VARCHAR(255) PRIMARY KEY,
  usuario_id INT NOT NULL,
  expira_em TIMESTAMP NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_expira_em (expira_em)
) ENGINE=InnoDB;

-- Tabela de planos de assinatura
CREATE TABLE IF NOT EXISTS planos_assinatura (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  periodo_cobranca ENUM('mensal', 'anual') NOT NULL,
  recursos JSON NOT NULL,
  max_favoritos INT DEFAULT NULL,
  acesso_cupons_premium BOOLEAN DEFAULT FALSE,
  suporte_prioritario BOOLEAN DEFAULT FALSE,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_ativo (ativo)
) ENGINE=InnoDB;

-- Tabela de assinaturas dos usuários
CREATE TABLE IF NOT EXISTS assinaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  plano_id INT NOT NULL,
  status ENUM('ativa', 'cancelada', 'expirada', 'pendente') DEFAULT 'pendente',
  inicio_periodo_atual TIMESTAMP NOT NULL,
  fim_periodo_atual TIMESTAMP NOT NULL,
  cancelar_no_fim_periodo BOOLEAN DEFAULT FALSE,
  cancelada_em TIMESTAMP NULL,
  stripe_subscription_id VARCHAR(255),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (plano_id) REFERENCES planos_assinatura(id),
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_plano_id (plano_id),
  INDEX idx_status (status),
  INDEX idx_fim_periodo (fim_periodo_atual)
) ENGINE=InnoDB;

-- Tabela de histórico de assinaturas
CREATE TABLE IF NOT EXISTS historico_assinaturas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assinatura_id INT NOT NULL,
  usuario_id INT NOT NULL,
  plano_anterior_id INT,
  plano_novo_id INT NOT NULL,
  acao ENUM('criada', 'upgrade', 'downgrade', 'cancelada', 'renovada', 'expirada') NOT NULL,
  observacoes TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assinatura_id) REFERENCES assinaturas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (plano_anterior_id) REFERENCES planos_assinatura(id),
  FOREIGN KEY (plano_novo_id) REFERENCES planos_assinatura(id),
  INDEX idx_assinatura_id (assinatura_id),
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_acao (acao)
) ENGINE=InnoDB;

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS pagamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assinatura_id INT NOT NULL,
  usuario_id INT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  moeda VARCHAR(3) DEFAULT 'BRL',
  metodo_pagamento ENUM('cartao_credito', 'pix', 'boleto') NOT NULL,
  provedor_pagamento VARCHAR(50),
  id_pagamento_provedor VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  status ENUM('pendente', 'processando', 'completo', 'falhou', 'reembolsado') DEFAULT 'pendente',
  pago_em TIMESTAMP NULL,
  metadados JSON,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assinatura_id) REFERENCES assinaturas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_assinatura_id (assinatura_id),
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_status (status),
  INDEX idx_id_pagamento_provedor (id_pagamento_provedor),
  INDEX idx_stripe_payment_intent_id (stripe_payment_intent_id)
) ENGINE=InnoDB;

-- Tabela de feedback/contato
CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(50),
  assunto VARCHAR(255) NOT NULL,
  mensagem TEXT NOT NULL,
  status ENUM('novo', 'lido', 'respondido', 'resolvido') DEFAULT 'novo',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- Tabela de conversas de chat
CREATE TABLE IF NOT EXISTS conversas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feedback_id INT NOT NULL,
  usuario_email VARCHAR(255) NOT NULL,
  admin_id INT,
  status ENUM('aberta', 'fechada') DEFAULT 'aberta',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_feedback_id (feedback_id),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- Tabela de mensagens do chat
CREATE TABLE IF NOT EXISTS mensagens_chat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversa_id INT NOT NULL,
  remetente_tipo ENUM('usuario', 'admin') NOT NULL,
  remetente_id INT,
  mensagem TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversa_id) REFERENCES conversas(id) ON DELETE CASCADE,
  FOREIGN KEY (remetente_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_conversa_id (conversa_id),
  INDEX idx_criado_em (criado_em)
) ENGINE=InnoDB;

-- Inserir planos padrão
INSERT INTO planos_assinatura (nome, slug, descricao, preco, periodo_cobranca, recursos, max_favoritos, acesso_cupons_premium, suporte_prioritario) VALUES
('Gratuito', 'free', 'Plano básico com acesso limitado', 0.00, 'mensal', '["Acesso a cupons básicos", "Até 10 favoritos", "Suporte por email"]', 10, FALSE, FALSE),
('Médio', 'medium', 'Plano intermediário com mais recursos', 19.90, 'mensal', '["Acesso a todos os cupons", "Favoritos ilimitados", "Suporte prioritário", "Alertas de novos cupons"]', NULL, TRUE, TRUE),
('Pro', 'pro', 'Plano completo com todos os recursos', 39.90, 'mensal', '["Tudo do plano Médio", "Cupons exclusivos", "API de acesso", "Relatórios personalizados", "Suporte 24/7"]', NULL, TRUE, TRUE)
ON DUPLICATE KEY UPDATE nome=nome;

-- Criar assinatura gratuita para todos os usuários existentes
INSERT INTO assinaturas (usuario_id, plano_id, status, inicio_periodo_atual, fim_periodo_atual)
SELECT 
  u.id,
  (SELECT id FROM planos_assinatura WHERE slug = 'free' LIMIT 1),
  'ativa',
  NOW(),
  DATE_ADD(NOW(), INTERVAL 1 YEAR)
FROM usuarios u
WHERE NOT EXISTS (
  SELECT 1 FROM assinaturas a WHERE a.usuario_id = u.id
);

-- Criar usuário admin padrão (senha: admin123 - ALTERE ISSO!)
INSERT INTO usuarios (nome, email, senha, papel) 
VALUES ('Administrador', 'admin@linux.com', '$2b$10$YourHashedPasswordHere', 'admin')
ON DUPLICATE KEY UPDATE papel = 'admin';
