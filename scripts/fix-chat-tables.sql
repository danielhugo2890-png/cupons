-- Script para corrigir as tabelas de chat e adicionar o campo 'lida'
-- Este script deve ser executado no seu banco MySQL

USE linux;

-- Adicionar coluna 'lida' na tabela mensagens_chat se não existir
ALTER TABLE mensagens_chat
ADD COLUMN IF NOT EXISTS lida BOOLEAN DEFAULT FALSE AFTER mensagem;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_lida ON mensagens_chat(lida);

-- Atualizar todas as mensagens antigas para 'lida = TRUE'
UPDATE mensagens_chat SET lida = TRUE WHERE lida IS NULL;
