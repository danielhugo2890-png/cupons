# Configuração do Stripe

Este guia explica como configurar o Stripe para processar pagamentos reais no seu site de cupons.

## 1. Criar Conta no Stripe

1. Acesse [stripe.com](https://stripe.com) e crie uma conta
2. Complete o processo de verificação da sua empresa
3. Ative o suporte para PIX no Brasil

## 2. Obter as Chaves da API

No Dashboard do Stripe:

1. Vá em **Developers** → **API keys**
2. Copie as seguintes chaves:
   - **Publishable key** (começa com `pk_`)
   - **Secret key** (começa com `sk_`)

## 3. Criar os Produtos e Preços

No Dashboard do Stripe:

1. Vá em **Products** → **Add product**
2. Crie dois produtos:

### Plano Médio
- Nome: "Plano Médio"
- Preço: R$ 19,90 / mês
- Copie o **Price ID** (começa com `price_`)

### Plano Pro
- Nome: "Plano Pro"
- Preço: R$ 39,90 / mês
- Copie o **Price ID** (começa com `price_`)

## 4. Configurar Webhook

1. Vá em **Developers** → **Webhooks**
2. Clique em **Add endpoint**
3. URL do endpoint: `https://seu-dominio.com/api/webhooks/stripe`
4. Selecione os eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copie o **Signing secret** (começa com `whsec_`)

## 5. Adicionar Variáveis de Ambiente

Adicione as seguintes variáveis no seu projeto Vercel ou arquivo `.env.local`:

\`\`\`env
# Chaves do Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Price IDs dos planos
STRIPE_PRICE_ID_MEDIUM=price_...
STRIPE_PRICE_ID_PRO=price_...

# Webhook secret
STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

## 6. Executar Scripts do Banco de Dados

Execute os scripts SQL na ordem:

1. `05-create-subscriptions.sql` - Cria as tabelas de assinaturas
2. `06-add-stripe-fields.sql` - Adiciona campos do Stripe

## 7. Testar Pagamentos

### Modo de Teste (Test Mode)

Use estes cartões de teste:

- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Qualquer data futura e CVV de 3 dígitos funcionam.

### PIX em Teste

No modo de teste, o Stripe simula pagamentos PIX automaticamente.

## 8. Ativar Modo Produção

Quando estiver pronto para aceitar pagamentos reais:

1. Complete a verificação da sua empresa no Stripe
2. Substitua as chaves de teste (`sk_test_`, `pk_test_`) pelas chaves de produção (`sk_live_`, `pk_live_`)
3. Atualize os Price IDs para os IDs de produção
4. Atualize o webhook secret para o de produção

## Suporte

- Documentação Stripe: [stripe.com/docs](https://stripe.com/docs)
- Suporte Stripe: [support.stripe.com](https://support.stripe.com)
