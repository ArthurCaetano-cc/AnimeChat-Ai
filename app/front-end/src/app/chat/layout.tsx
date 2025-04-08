'use client'

import { useEffect, useState } from 'react'
import { fetchChats, Chat, createChat } from '@/lib/api/chat'
import { fetchCharacters, Character } from '@/lib/api/characters'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [chats, setChats] = useState<Chat[]>([])
  const [showForm, setShowForm] = useState(false)
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await fetchChats()
        setChats(data)
      } catch (error) {
        console.error('Erro ao carregar chats:', error)
      }
    }

    loadChats()
  }, [])

  const handleNewChat = async () => {
    try {
      const chars = await fetchCharacters()
      setCharacters(chars)
      setShowForm(true)
    } catch (err) {
      console.error('Erro ao carregar personagens:', err)
    }
  }

  const handleCreateChat = async () => {
    if (selectedCharacter !== null) {
      const newChat = await createChat(selectedCharacter);
      router.push(`/chat/${newChat.id}`);
      setShowForm(false);
    }
  }

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 p-4 bg-gray-200 relative">
        <h2 className="mb-4 text-lg font-bold">Chats Recentes</h2>
        <button
          onClick={handleNewChat}
          className="w-full p-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Novo Chat
        </button>

        <ul className="space-y-2">
          {chats.map((chat) => (
            <li key={chat.id}>
              <Link href={`/chat/${chat.id}`}>
                <div className="p-3 bg-white rounded shadow hover:bg-gray-100 cursor-pointer">
                  Titulo da conversa
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Modal / Formulário */}
        {showForm && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-10">
            <div className="p-6 bg-white rounded shadow w-80">
              <h3 className="mb-4 text-lg font-bold text-center">Escolha um personagem</h3>
              <select
                className="w-full p-2 mb-4 border border-gray-300 rounded"
                value={selectedCharacter ?? ''}
                onChange={(e) => {
                  setSelectedCharacter(e.target.value)
                }}
              >
                <option value="">Selecione...</option>
                {characters.map((char) => (
                  <option key={char.id} value={char.id}>
                    {char.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-between">
                <button
                  onClick={handleCreateChat}
                  className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Iniciar
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
      <main className="flex-1 p-4 bg-gray-50">{children}</main>
    </div>
  )
}
