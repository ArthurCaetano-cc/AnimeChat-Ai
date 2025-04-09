import { getUserIdFromToken } from '../utils/auth'
import api from './axios'

export interface Message {
  id: string,
  chatId: string,
  userId?: string,
  role: "USER" | "AGENT"
  content: string
}

export const sendMessage = async (message: string, chatId: string): Promise<[]> => {
  const userId = getUserIdFromToken()
  if (!userId) throw new Error('User not authenticated')

  const { data } = await api.post('/messages', {
    chatId,
    userId,
    content: message,
    role: "USER"
  })
  return data
}

export const fetchMessages = async (chatId: string): Promise<Message[]> => {
  const userId = getUserIdFromToken()
  if (!userId) throw new Error('User not authenticated')

  const { data } = await api.get(`/messages/${chatId}`)
  return data
}
