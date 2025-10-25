# Guia de Segurança - Site de Cupons Linux

## Visão Geral

Este documento descreve as medidas de segurança implementadas no sistema.

## Autenticação e Autorização

### Sistema de Sessões
- Sessões armazenadas no banco de dados com expiração de 7 dias
- Cookies HTTP-only e Secure (em produção)
- SameSite=Lax para proteção contra CSRF

### Controle de Acesso
- Sistema de roles (user/admin)
- Middleware de autorização para rotas administrativas
- Verificação de permissões em todas as operações sensíveis

## Validações

### Validação de Entrada
- Email: formato válido e sanitização
- Senha: mínimo 8 caracteres, maiúscula, minúscula e número
- Código de cupom: 3-20 caracteres alfanuméricos
- Sanitização de strings para prevenir XSS

### Rate Limiting
- Login: 10 tentativas por 5 minutos por IP
- Registro: 5 tentativas por 5 minutos por IP
- Implementado em memória (use Redis em produção)

## Proteções Implementadas

### Headers de Segurança
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: restrições de APIs sensíveis

### SQL Injection
- Uso de prepared statements em todas as queries
- Validação e sanitização de todos os inputs
- Escape de caracteres especiais

### XSS (Cross-Site Scripting)
- Sanitização de inputs do usuário
- Headers de segurança configurados
- Validação de tipos de dados

### CSRF (Cross-Site Request Forgery)
- Cookies SameSite=Lax
- Verificação de origem em operações sensíveis

## Proteções Administrativas

### Painel Admin
- Acesso restrito apenas para role=admin
- Não permite admin deletar a si mesmo
- Não permite admin alterar seu próprio role
- Proteção contra deletar último admin do sistema

### Operações de Cupons
- Validação de duplicidade de códigos
- Verificação de categorias válidas
- Validação de datas futuras

## Recomendações para Produção

### Obrigatório
1. **Usar bcrypt real** - Substituir mock de hash por bcrypt
2. **Variáveis de ambiente** - Configurar DATABASE_URL e outras secrets
3. **HTTPS** - Sempre usar HTTPS em produção
4. **Rate Limiting com Redis** - Implementar rate limiting distribuído
5. **Logs de auditoria** - Registrar operações administrativas
6. **Backup automático** - Configurar backups regulares do banco

### Recomendado
1. **2FA para admins** - Autenticação de dois fatores
2. **Monitoramento** - Alertas para atividades suspeitas
3. **WAF** - Web Application Firewall
4. **Testes de penetração** - Auditorias regulares
5. **Rotação de sessões** - Invalidar sessões antigas
6. **Política de senhas** - Expiração e histórico

## Configuração do MySQL

### Usuário do Banco
\`\`\`sql
-- Criar usuário com privilégios mínimos
CREATE USER 'cupons_app'@'localhost' IDENTIFIED BY 'senha_forte';
GRANT SELECT, INSERT, UPDATE, DELETE ON cupons_db.* TO 'cupons_app'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

### Configurações Recomendadas
- Desabilitar acesso remoto ao MySQL (se possível)
- Usar SSL para conexões ao banco
- Limitar conexões simultâneas
- Configurar logs de auditoria

## Contato

Para reportar vulnerabilidades de segurança, entre em contato com a equipe de desenvolvimento.
