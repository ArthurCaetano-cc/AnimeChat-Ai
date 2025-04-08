'use client'

import { fetchMessages, Message, sendMessage } from '@/lib/api/messages'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface formattedMessage {
  id: string
  sender: string
  content: string
}

export default function ChatDetailPage() {
  const { chatId } = useParams()
  const chatIdString = chatId as string
  const [messages, setMessages] = useState<formattedMessage[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Simula uma API de mensagens do chat específico
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
  }, [chatId])

  const handleSend = async () => {
    await sendMessage(message, chatIdString)
    setMessage('')
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
