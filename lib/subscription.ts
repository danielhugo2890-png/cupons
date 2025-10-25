// Utilitários de gerenciamento de assinaturas
import { query } from "./db"

export interface SubscriptionPlan {
  id: number
  nome: string
  slug: string
  descricao: string
  preco: number
  periodo_cobranca: "mensal" | "anual"
  recursos: string[]
  max_favoritos: number | null
  acesso_cupons_premium: boolean
  suporte_prioritario: boolean
  ativo: boolean
}

export interface Subscription {
  id: number
  usuario_id: number
  plano_id: number
  status: "ativa" | "cancelada" | "expirada" | "pendente"
  inicio_periodo_atual: Date
  fim_periodo_atual: Date
  cancelar_no_fim_periodo: boolean
  cancelada_em: Date | null
  plano?: SubscriptionPlan
}

// Obter plano de assinatura por slug
export async function getPlanBySlug(slug: string): Promise<SubscriptionPlan | null> {
  const plans = await query("SELECT * FROM planos_assinatura WHERE slug = ? AND ativo = TRUE", [slug])
  if (!plans || plans.length === 0) return null

  const plan = plans[0]
  return {
    ...plan,
    recursos: typeof plan.recursos === "string" ? JSON.parse(plan.recursos) : plan.recursos,
  }
}

// Obter todos os planos ativos
export async function getAllPlans(): Promise<SubscriptionPlan[]> {
  const plans = await query("SELECT * FROM planos_assinatura WHERE ativo = TRUE ORDER BY preco ASC")
  return plans.map((plan: any) => ({
    ...plan,
    recursos: typeof plan.recursos === "string" ? JSON.parse(plan.recursos) : plan.recursos,
  }))
}

// Obter assinatura ativa do usuário
export async function getUserSubscription(userId: number): Promise<Subscription | null> {
  const subscriptions = await query(
    `SELECT a.*, p.nome, p.slug, p.descricao, p.preco, p.periodo_cobranca, 
     p.recursos, p.max_favoritos, p.acesso_cupons_premium, p.suporte_prioritario
     FROM assinaturas a
     JOIN planos_assinatura p ON a.plano_id = p.id
     WHERE a.usuario_id = ? AND a.status IN ('ativa', 'cancelada')
     ORDER BY a.criado_em DESC LIMIT 1`,
    [userId],
  )

  if (!subscriptions || subscriptions.length === 0) return null

  const sub = subscriptions[0]
  return {
    id: sub.id,
    usuario_id: sub.usuario_id,
    plano_id: sub.plano_id,
    status: sub.status,
    inicio_periodo_atual: sub.inicio_periodo_atual,
    fim_periodo_atual: sub.fim_periodo_atual,
    cancelar_no_fim_periodo: sub.cancelar_no_fim_periodo,
    cancelada_em: sub.cancelada_em,
    plano: {
      id: sub.plano_id,
      nome: sub.nome,
      slug: sub.slug,
      descricao: sub.descricao,
      preco: sub.preco,
      periodo_cobranca: sub.periodo_cobranca,
      recursos: typeof sub.recursos === "string" ? JSON.parse(sub.recursos) : sub.recursos,
      max_favoritos: sub.max_favoritos,
      acesso_cupons_premium: sub.acesso_cupons_premium,
      suporte_prioritario: sub.suporte_prioritario,
      ativo: true,
    },
  }
}

// Criar nova assinatura
export async function createSubscription(
  userId: number,
  planSlug: string,
  paymentMethod: "cartao_credito" | "pix" | "boleto",
): Promise<{ subscriptionId: number; paymentId: number }> {
  const plan = await getPlanBySlug(planSlug)
  if (!plan) throw new Error("Plano não encontrado")

  // Cancelar assinatura anterior se existir
  await query(
    "UPDATE assinaturas SET status = 'cancelada', cancelada_em = NOW() WHERE usuario_id = ? AND status = 'ativa'",
    [userId],
  )

  // Criar nova assinatura
  const periodStart = new Date()
  const periodEnd = new Date()
  if (plan.periodo_cobranca === "mensal") {
    periodEnd.setMonth(periodEnd.getMonth() + 1)
  } else {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1)
  }

  const subResult = await query(
    `INSERT INTO assinaturas (usuario_id, plano_id, status, inicio_periodo_atual, fim_periodo_atual)
     VALUES (?, ?, ?, ?, ?)`,
    [userId, plan.id, plan.preco === 0 ? "ativa" : "pendente", periodStart, periodEnd],
  )

  const subscriptionId = subResult.insertId

  // Registrar no histórico
  await query(
    `INSERT INTO historico_assinaturas (assinatura_id, usuario_id, plano_novo_id, acao, observacoes)
     VALUES (?, ?, ?, 'criada', ?)`,
    [subscriptionId, userId, plan.id, `Assinatura criada para o plano ${plan.nome}`],
  )

  // Criar registro de pagamento
  const paymentResult = await query(
    `INSERT INTO pagamentos (assinatura_id, usuario_id, valor, metodo_pagamento, status)
     VALUES (?, ?, ?, ?, ?)`,
    [subscriptionId, userId, plan.preco, paymentMethod, plan.preco === 0 ? "completo" : "pendente"],
  )

  return { subscriptionId, paymentId: paymentResult.insertId }
}

// Atualizar status de pagamento
export async function updatePaymentStatus(
  paymentId: number,
  status: "completo" | "falhou" | "reembolsado",
  providerPaymentId?: string,
): Promise<void> {
  await query(
    `UPDATE pagamentos SET status = ?, pago_em = ?, id_pagamento_provedor = ?, atualizado_em = NOW()
     WHERE id = ?`,
    [status, status === "completo" ? new Date() : null, providerPaymentId || null, paymentId],
  )

  if (status === "completo") {
    // Ativar assinatura
    const payments = await query("SELECT assinatura_id FROM pagamentos WHERE id = ?", [paymentId])
    if (payments && payments.length > 0) {
      await query("UPDATE assinaturas SET status = 'ativa' WHERE id = ?", [payments[0].assinatura_id])
    }
  }
}

// Fazer upgrade/downgrade de plano
export async function changePlan(userId: number, newPlanSlug: string): Promise<void> {
  const currentSub = await getUserSubscription(userId)
  if (!currentSub) throw new Error("Assinatura não encontrada")

  const newPlan = await getPlanBySlug(newPlanSlug)
  if (!newPlan) throw new Error("Novo plano não encontrado")

  const action = newPlan.preco > (currentSub.plano?.preco || 0) ? "upgrade" : "downgrade"

  // Atualizar assinatura
  await query("UPDATE assinaturas SET plano_id = ?, atualizado_em = NOW() WHERE id = ?", [newPlan.id, currentSub.id])

  // Registrar no histórico
  await query(
    `INSERT INTO historico_assinaturas (assinatura_id, usuario_id, plano_anterior_id, plano_novo_id, acao, observacoes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      currentSub.id,
      userId,
      currentSub.plano_id,
      newPlan.id,
      action,
      `Plano alterado de ${currentSub.plano?.nome} para ${newPlan.nome}`,
    ],
  )
}

// Cancelar assinatura
export async function cancelSubscription(userId: number, immediate = false): Promise<void> {
  const subscription = await getUserSubscription(userId)
  if (!subscription) throw new Error("Assinatura não encontrada")

  if (immediate) {
    await query(
      "UPDATE assinaturas SET status = 'cancelada', cancelada_em = NOW(), cancelar_no_fim_periodo = FALSE WHERE id = ?",
      [subscription.id],
    )
  } else {
    await query("UPDATE assinaturas SET cancelar_no_fim_periodo = TRUE, cancelada_em = NOW() WHERE id = ?", [
      subscription.id,
    ])
  }

  // Registrar no histórico
  await query(
    `INSERT INTO historico_assinaturas (assinatura_id, usuario_id, plano_anterior_id, plano_novo_id, acao, observacoes)
     VALUES (?, ?, ?, ?, 'cancelada', ?)`,
    [
      subscription.id,
      userId,
      subscription.plano_id,
      subscription.plano_id,
      immediate ? "Cancelamento imediato" : "Cancelamento ao fim do período",
    ],
  )
}

// Verificar se usuário tem acesso a cupons premium
export async function hasAccessToPremiumCoupons(userId: number): Promise<boolean> {
  const subscription = await getUserSubscription(userId)
  return subscription?.status === "ativa" && subscription.plano?.acesso_cupons_premium === true
}

// Verificar limite de favoritos
export async function canAddFavorite(userId: number): Promise<boolean> {
  const subscription = await getUserSubscription(userId)
  if (!subscription || subscription.status !== "ativa") return false

  const maxFavorites = subscription.plano?.max_favoritos
  if (maxFavorites === null) return true // Ilimitado

  const favorites = await query("SELECT COUNT(*) as count FROM favoritos WHERE usuario_id = ?", [userId])
  return favorites[0].count < maxFavorites
}
