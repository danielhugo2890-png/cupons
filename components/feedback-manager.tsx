"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone, Calendar, MessageSquare, Trash2, CheckCircle, Eye, ArrowLeft, Search, Clock } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ChatWindow } from "@/components/chat-window"

interface Feedback {
  id: string
  nome: string
  email: string
  telefone?: string
  assunto: string
  mensagem: string
  timestamp: string
  status: "novo" | "lido" | "respondido" | "resolvido"
}

export function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("todos")
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<{ id: string; isOpen: boolean }>({
    id: "",
    isOpen: false,
  })
  const [chatAberto, setChatAberto] = useState<{ conversaId: number; titulo: string; feedbackId: string } | null>(null)

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/feedback")
      const data = await res.json()
      setFeedbacks(data.feedback || [])
    } catch (error) {
      console.error("Erro ao buscar feedbacks:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const updateStatus = async (id: string, status: "novo" | "lido" | "respondido" | "resolvido") => {
    try {
      await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      fetchFeedbacks()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const deleteFeedback = async (id: string) => {
    try {
      await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      })
      fetchFeedbacks()
      setShowDeleteConfirmation({ id: "", isOpen: false })
    } catch (error) {
      console.error("Erro ao deletar feedback:", error)
    }
  }

  const iniciarChat = async (feedbackId: string, nome: string) => {
    try {
      const response = await fetch("/api/chat/conversas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackId }),
      })

      if (response.ok) {
        const data = await response.json()
        setChatAberto({ conversaId: data.id, titulo: `Chat com ${nome}`, feedbackId })
        // Marcar como lido ao abrir o chat
        updateStatus(feedbackId, "lido")
      }
    } catch (error) {
      console.error("Erro ao iniciar chat:", error)
    }
  }

  const finalizarConversa = (feedbackId: string) => {
    updateStatus(feedbackId, "resolvido")
    setChatAberto(null)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      novo: { variant: "default" as const, label: "Novo", color: "bg-blue-500" },
      lido: { variant: "secondary" as const, label: "Lido", color: "bg-yellow-500" },
      respondido: { variant: "outline" as const, label: "Respondido", color: "bg-green-500" },
      resolvido: { variant: "outline" as const, label: "Resolvido", color: "bg-gray-500" },
    }
    const config = variants[status as keyof typeof variants] || variants.novo
    return (
      <Badge variant={config.variant} className="gap-1">
        <div className={`h-2 w-2 rounded-full ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  const getAssuntoLabel = (assunto: string) => {
    const labels: Record<string, string> = {
      support: "Suporte Técnico",
      billing: "Dúvidas sobre Planos",
      partnership: "Parcerias",
      suggestion: "Sugestões",
      other: "Outros",
    }
    return labels[assunto] || assunto
  }

  const getTempoDecorrido = (timestamp: string) => {
    const agora = new Date()
    const criacao = new Date(timestamp)
    const diff = agora.getTime() - criacao.getTime()
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (dias > 0) return `há ${dias} dia${dias > 1 ? "s" : ""}`
    if (horas > 0) return `há ${horas} hora${horas > 1 ? "s" : ""}`
    return "há poucos minutos"
  }

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const search = searchTerm.toLowerCase()
    const matchesSearch =
      feedback.nome.toLowerCase().includes(search) ||
      feedback.email.toLowerCase().includes(search) ||
      feedback.assunto.toLowerCase().includes(search) ||
      feedback.mensagem.toLowerCase().includes(search)

    if (activeTab === "todos") return matchesSearch
    if (activeTab === "novos") return matchesSearch && feedback.status === "novo"
    if (activeTab === "andamento")
      return matchesSearch && (feedback.status === "lido" || feedback.status === "respondido")
    if (activeTab === "resolvidos") return matchesSearch && feedback.status === "resolvido"
    return matchesSearch
  })

  const contadores = {
    novos: feedbacks.filter((f) => f.status === "novo").length,
    andamento: feedbacks.filter((f) => f.status === "lido" || f.status === "respondido").length,
    resolvidos: feedbacks.filter((f) => f.status === "resolvido").length,
  }

  const renderFeedbackCard = (feedback: Feedback) => (
    <Card key={feedback.id} className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="text-2xl">{feedback.nome}</CardTitle>
              {getStatusBadge(feedback.status)}
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {getTempoDecorrido(feedback.timestamp)}
              </span>
            </div>
            <CardDescription className="flex flex-wrap gap-4 text-base">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {feedback.email}
              </span>
              {feedback.telefone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {feedback.telefone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(feedback.timestamp).toLocaleString("pt-BR")}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-1">Assunto</p>
          <p className="text-base">{getAssuntoLabel(feedback.assunto)}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-1">Mensagem</p>
          <p className="text-base leading-relaxed whitespace-pre-wrap">{feedback.mensagem}</p>
        </div>
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {feedback.status !== "resolvido" && (
            <Button
              onClick={() => iniciarChat(feedback.id, feedback.nome)}
              variant="default"
              size="sm"
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Responder via Chat
            </Button>
          )}
          {feedback.status === "novo" && (
            <Button onClick={() => updateStatus(feedback.id, "lido")} variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              Marcar como Lido
            </Button>
          )}
          {feedback.status !== "respondido" && feedback.status !== "resolvido" && (
            <Button
              onClick={() => updateStatus(feedback.id, "respondido")}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Marcar como Respondido
            </Button>
          )}
          {feedback.status !== "resolvido" && (
            <Button
              onClick={() => updateStatus(feedback.id, "resolvido")}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Finalizar
            </Button>
          )}
          <Button
            onClick={() => setShowDeleteConfirmation({ id: feedback.id, isOpen: true })}
            variant="destructive"
            size="sm"
            className="gap-2 ml-auto"
          >
            <Trash2 className="h-4 w-4" />
            Deletar
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Mensagens de Contato
            </h1>
            <p className="text-lg text-muted-foreground">Gerencie as mensagens recebidas pelo formulário de contato</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Painel
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, email, assunto ou mensagem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="todos">Todos ({feedbacks.length})</TabsTrigger>
            <TabsTrigger value="novos">Novos ({contadores.novos})</TabsTrigger>
            <TabsTrigger value="andamento">Em Andamento ({contadores.andamento})</TabsTrigger>
            <TabsTrigger value="resolvidos">Resolvidos ({contadores.resolvidos})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-32 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredFeedbacks.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm ? "Nenhuma mensagem encontrada" : "Nenhuma mensagem nesta categoria"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Tente ajustar os termos de pesquisa."
                    : "As mensagens aparecerão aqui quando receberem este status."}
                </p>
              </Card>
            ) : (
              <div className="grid gap-6">{filteredFeedbacks.map(renderFeedbackCard)}</div>
            )}
          </TabsContent>
        </Tabs>

        {showDeleteConfirmation.isOpen && (
          <AlertDialog open={showDeleteConfirmation.isOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja deletar esta mensagem? Esta ação não pode ser desfeita e todo o histórico de
                  chat será perdido.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowDeleteConfirmation({ id: "", isOpen: false })}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteFeedback(showDeleteConfirmation.id)}>Deletar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {chatAberto && (
          <ChatWindow
            conversaId={chatAberto.conversaId}
            titulo={chatAberto.titulo}
            onClose={() => setChatAberto(null)}
            onFinalizar={() => finalizarConversa(chatAberto.feedbackId)}
          />
        )}

        <Card className="mt-8 bg-muted/30 border-dashed">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              <strong>Dica:</strong> Use as abas para filtrar mensagens por status. Mensagens "Resolvidas" ficam
              arquivadas mas não são deletadas, mantendo o histórico completo.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
