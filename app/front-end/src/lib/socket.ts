import { io, Socket } from 'socket.io-client'

export const connectToChatSocket = (chatId: string): Socket => {
  return io(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/chat/${chatId}`, {
    transports: ['websocket'],
  })
}
