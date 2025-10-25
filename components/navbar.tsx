"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Home,
  Tag,
  Sparkles,
  Mail,
  Info,
  LogIn,
  UserPlus,
  Menu,
  X,
  User,
  LogOut,
  Heart,
  Shield,
  CreditCard,
} from "lucide-react"
import { useState } from "react"
import { useUser } from "@/lib/user-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout, loading } = useUser()

  const navLinks = [
    { href: "/", label: "Início", icon: Home },
    { href: "/cupons", label: "Cupons", icon: Tag },
    { href: "/planos", label: "Planos", icon: Sparkles },
    { href: "/contato", label: "Contato", icon: Mail },
    { href: "/sobre", label: "Sobre", icon: Info },
  ]

  const getInitials = (email: string) => {
    const username = email.split("@")[0]
    return username.slice(0, 2).toUpperCase()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black rounded-xl blur-md opacity-60 group-hover:opacity-90 transition-all duration-300" />
              <div className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white px-5 py-2.5 rounded-xl font-display font-black text-2xl tracking-tight shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-300">
                Linux
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" className="gap-2 group hover:bg-secondary/80 transition-all duration-300">
                    <Icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                    <span className="font-medium">{link.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          <div className="hidden md:flex items-center gap-2 min-w-[180px] justify-end">
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="gap-2 hover:bg-secondary/80 transition-all duration-300 h-10 w-10 rounded-full p-0"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.email} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                            {getInitials(user.email)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/painel" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Painel</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/favoritos" className="cursor-pointer">
                          <Heart className="mr-2 h-4 w-4" />
                          <span>Favoritos</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/assinatura" className="cursor-pointer">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Assinatura</span>
                        </Link>
                      </DropdownMenuItem>
                      {user.role === "admin" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer text-primary">
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Painel Admin</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Link href="/entrar">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 hover:bg-secondary/80 transition-all duration-300"
                      >
                        <LogIn className="h-4 w-4" />
                        <span className="font-medium">Entrar</span>
                      </Button>
                    </Link>
                    <Link href="/cadastro">
                      <Button
                        size="sm"
                        className="gap-2 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span className="font-semibold">Cadastro</span>
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-secondary/80 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-slide-in">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-secondary/80">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                  </Button>
                </Link>
              )
            })}
            <div className="pt-2 space-y-2 border-t border-border/40">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <div className="px-3 py-2 text-sm font-medium text-muted-foreground">
                        Olá, {user.name.split(" ")[0]}!
                      </div>
                      <Link href="/painel" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-secondary/80">
                          <User className="h-5 w-5" />
                          <span className="font-medium">Painel</span>
                        </Button>
                      </Link>
                      <Link href="/favoritos" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-secondary/80">
                          <Heart className="h-5 w-5" />
                          <span className="font-medium">Favoritos</span>
                        </Button>
                      </Link>
                      <Link href="/assinatura" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-secondary/80">
                          <CreditCard className="h-5 w-5" />
                          <span className="font-medium">Assinatura</span>
                        </Button>
                      </Link>
                      {user.role === "admin" && (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 hover:bg-secondary/80 text-primary"
                          >
                            <Shield className="h-5 w-5" />
                            <span className="font-medium">Painel Admin</span>
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 hover:bg-secondary/80 text-destructive"
                        onClick={() => {
                          logout()
                          setMobileMenuOpen(false)
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sair</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/entrar" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-secondary/80">
                          <LogIn className="h-5 w-5" />
                          <span className="font-medium">Entrar</span>
                        </Button>
                      </Link>
                      <Link href="/cadastro" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full justify-start gap-3 bg-primary hover:bg-primary/90">
                          <UserPlus className="h-5 w-5" />
                          <span className="font-semibold">Cadastro</span>
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
