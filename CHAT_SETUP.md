# Sistema de Chat - Configuração e Uso

## 🔧 Configuração Necessária

### 1. Executar Script de Atualização do Banco

Antes de usar o sistema de chat, você precisa executar o script SQL para adicionar o campo `lida` na tabela:

```bash
mysql -u seu_usuario -p linux < scripts/fix-chat-tables.sql
```

Ou execute manualmente no MySQL:

```sql
USE linux;

ALTER TABLE mensagens_chat
ADD COLUMN IF NOT EXISTS lida BOOLEAN DEFAULT FALSE AFTER mensagem;

CREATE INDEX IF NOT EXISTS idx_lida ON mensagens_chat(lida);

UPDATE mensagens_chat SET lida = TRUE WHERE lida IS NULL;
```

## 📋 Como Funciona

### No Painel Administrativo

1. **Acesse**: `/admin/feedback`
2. **Visualize**: Todas as mensagens de contato recebidas
3. **Clique**: No botão "Responder via Chat" em qualquer mensagem

### O Sistema de Chat

- Quando você clicar em "Responder via Chat":
  - Uma janela de chat flutuante abre no canto inferior direito
  - Uma conversa é criada automaticamente no banco de dados
  - A mensagem é marcada como "lida"
  - Você pode enviar mensagens em tempo real

### Recursos do Chat

- ✅ **Chat em tempo real** - Atualiza automaticamente a cada 3 segundos
- ✅ **Avatares** - Mostra o avatar de cada participante
- ✅ **Hora de envio** - Exibe horário de cada mensagem
- ✅ **Marcação de leitura** - Mensagens são marcadas como lidas
- ✅ **Finalizar conversa** - Botão para marcar como resolvido

## 🗄️ Estrutura do Banco de Dados

### Tabela `conversas`

Armazena as conversas iniciadas pelo admin:

- `id` - ID da conversa
- `feedback_id` - Referência ao feedback original
- `usuario_email` - Email do usuário que enviou o feedback
- `admin_id` - ID do admin que iniciou a conversa
- `status` - 'aberta' ou 'fechada'

### Tabela `mensagens_chat`

Armazena todas as mensagens trocadas:

- `id` - ID da mensagem
- `conversa_id` - Referência à conversa
- `remetente_tipo` - 'usuario' ou 'admin'
- `remetente_id` - ID do usuário/admin
- `mensagem` - Conteúdo da mensagem
- `lida` - Se a mensagem foi lida (TRUE/FALSE)
- `criado_em` - Data/hora de criação

## 🔒 Segurança

- Apenas administradores podem iniciar conversas
- Apenas usuários autenticados podem enviar mensagens
- Validação de autorização em todas as rotas da API

## 📝 APIs Disponíveis

### GET `/api/chat/conversas`

Lista todas as conversas (admin vê todas, usuário vê apenas as suas)

### POST `/api/chat/conversas`

Cria uma nova conversa a partir de um feedback
Body: `{ feedbackId: number }`

### GET `/api/chat/[conversaId]`

Busca todas as mensagens de uma conversa

### POST `/api/chat/[conversaId]`

Envia uma nova mensagem
Body: `{ mensagem: string }`

## ✅ Próximos Passos

Depois de executar o script SQL, o sistema estará pronto para uso:

1. Faça login como admin
2. Vá para `/admin/feedback`
3. Clique em "Responder via Chat" em qualquer mensagem
4. Teste enviando mensagens no chat

O sistema está totalmente integrado com MySQL e não requer nenhuma configuração adicional!
