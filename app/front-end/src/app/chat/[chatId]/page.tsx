'use client'

import { fetchMessages, Message } from '@/lib/api/messages'
import { connectToChatSocket } from '@/lib/socket'
import { getUserIdFromToken } from '@/lib/utils/auth'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface formattedMessage {
  id: string
  sender: string
  content: string
}

interface sendMessageDTO {
  content: string
  userId: string
  chatId: string
  role: 'USER' | 'ASSISTANT'
}

export default function ChatDetailPage() {
  const { chatId } = useParams()
  const chatIdString = chatId as string
  const [messages, setMessages] = useState<formattedMessage[]>([])
  const [message, setMessage] = useState('')
  const socketRef = useRef<any | null>(null)

  useEffect(() => {
    if (!chatId) return

    fetchMessages(chatIdString).then((data) => {
      data.map((msg: Message) => {
        const formattedMessage: formattedMessage = {
          id: msg.id,
          sender: msg.role === 'USER' ? 'Você' : 'Agente',
          content: msg.content,
        }
        setMessages((prevMessages) => [...prevMessages, formattedMessage])
      })
    })

    const socket = connectToChatSocket(chatIdString);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Conectado ao chat via socket')
    })

    socket.on('message', (newMessage: Message) => {
      setMessages((prev) => [...prev, {
        id: newMessage.id,
        sender: newMessage.role === 'USER' ? 'Você' : 'Agente',
        content: newMessage.content,
      }])
    })

    socket.on('error', (newMessage: Message) => {
      console.error("Erro ao receber mensagem:", newMessage);
    })

    socket.on('disconnect', () => {
      console.log('🔌 Desconectado do chat')
    })

    // Cleanup
    return () => {
      socket.disconnect();
    }
  }, [chatId])

  const handleSend = async () => {
    if (socketRef.current && message.trim()) {
      const userId = getUserIdFromToken()
      if (!userId) throw new Error('User ID not found in token')

      const newMessage: sendMessageDTO = {
        content: message,
        userId,
        chatId: chatIdString,
        role: 'USER',
      }

      socketRef.current.send(newMessage);
      setMessages((prev) => [...prev, { id: newMessage.chatId, sender: 'Você', content: message }]);
      setMessage("");
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 mb-4 bg-white rounded shadow overflow-y-auto space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="p-2 bg-gray-100 rounded">
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l"
        />
        <button
          onClick={handleSend}
          className="p-2 text-white bg-blue-600 rounded-r"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
