"use client"

// componente de login (em /app/page.tsx ou pages/index.tsx)
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://sua-api.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error('Falha no login')

      const { token } = await res.json()
      localStorage.setItem('jwt', token)
      onLogin(token)
    } catch (err) {
      alert('Usuário ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <Input placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
      <Input placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <Button onClick={handleLogin} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
    </div>
  )
}
