import { getUserIdFromToken } from '../utils/auth'
import api from './axios'

export interface Chat {
  id: string,
  agentId: string
}

export const fetchChats = async (): Promise<Chat[]> => {
  const userId = getUserIdFromToken()

  const { data } = await api.get(`/chats/user/${userId}`)
  return data
}


export const createChat = async (characterId: string): Promise<Chat> => {
  const userId = getUserIdFromToken()
  if (!userId) throw new Error('User not authenticated')

  const { data } = await api.post('/chats', { userId, agentId: characterId })
  return data
}
