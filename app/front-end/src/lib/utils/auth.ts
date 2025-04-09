export const getUserIdFromToken = (): string | null => {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.sub
  } catch (error) {
    console.error('Erro ao decodificar token:', error)
    return null
  }
}
