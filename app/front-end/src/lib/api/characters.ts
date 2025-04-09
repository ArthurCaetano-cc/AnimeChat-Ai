import api from './axios'

export interface Character {
  id: string,
  name: string,
  description: string,
  defaultInstruction: string,
}

export const fetchCharacters = async (): Promise<Character[]> => {
  const { data } = await api.get('/agents')
  return data
}
