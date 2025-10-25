-- Script para integrar feedback com chat
-- Adiciona feedback_id diretamente em mensagens_chat e ajusta a estrutura

USE linux;

-- Verificar se a coluna feedback_id já existe antes de adicionar
SET @dbname = DATABASE();
SET @tablename = 'mensagens_chat';
SET @columnname = 'feedback_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT NOT NULL AFTER id, ADD INDEX idx_feedback_id (feedback_id), ADD FOREIGN KEY (feedback_id) REFERENCES feedback(id) ON DELETE CASCADE;')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Verificar se a coluna remetente já existe, se não, adicionar
SET @columnname = 'remetente';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' ENUM(\'usuario\', \'admin\') NOT NULL AFTER feedback_id;')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Verificar se a coluna data já existe, se não, renomear criado_em para data
SET @columnname = 'data';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' CHANGE COLUMN criado_em data TIMESTAMP DEFAULT CURRENT_TIMESTAMP;')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Criar índice para data se não existir
CREATE INDEX IF NOT EXISTS idx_data ON mensagens_chat(data);

-- Remover colunas antigas que não são mais necessárias (se existirem)
-- conversa_id, remetente_tipo, remetente_id podem ser removidas se não forem usadas em outros lugares

-- Verificar e remover conversa_id se existir
SET @columnname = 'conversa_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  CONCAT('ALTER TABLE ', @tablename, ' DROP FOREIGN KEY IF EXISTS mensagens_chat_ibfk_1, DROP COLUMN ', @columnname, ';'),
  'SELECT 1'
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

-- Verificar e remover remetente_tipo se existir
SET @columnname = 'remetente_tipo';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  CONCAT('ALTER TABLE ', @tablename, ' DROP COLUMN ', @columnname, ';'),
  'SELECT 1'
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

-- Verificar e remover remetente_id se existir
SET @columnname = 'remetente_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  CONCAT('ALTER TABLE ', @tablename, ' DROP FOREIGN KEY IF EXISTS mensagens_chat_ibfk_2, DROP COLUMN ', @columnname, ';'),
  'SELECT 1'
));
PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;

-- Estrutura final esperada de mensagens_chat:
-- id INT PRIMARY KEY AUTO_INCREMENT
-- feedback_id INT NOT NULL (FK -> feedback.id)
-- remetente ENUM('usuario', 'admin') NOT NULL
-- mensagem TEXT NOT NULL
-- data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- lida BOOLEAN DEFAULT FALSE

SELECT 'Script executado com sucesso! Estrutura de mensagens_chat atualizada.' AS status;
