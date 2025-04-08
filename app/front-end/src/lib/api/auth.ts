import api from './axios'

interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  message: string,
  token: string
}

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post('/auth/sign-in', payload)
  return data
}
