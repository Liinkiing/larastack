import type { AxiosInstance } from 'axios'
import Axios from 'axios'

import { compilerEnv } from '~/shared/env'

class ApiServiceApp {
  public readonly baseUrl: string

  private readonly client: AxiosInstance

  constructor() {
    const baseURL = compilerEnv.__USE_BACKEND_PROXY__ ? '/api' : process.env.NEXT_PUBLIC_API_URL

    if (!baseURL) {
      throw new Error('NEXT_PUBLIC_API_URL must be configured when the backend proxy is disabled.')
    }

    this.baseUrl = baseURL

    this.client = Axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withCredentials: true,
      withXSRFToken: true,
    })
  }

  public async csrf(): Promise<void> {
    await this.client.get('/sanctum/csrf-cookie')
  }

  public async login({ email, password }: { email: string; password: string }): Promise<{ error: string | null }> {
    try {
      await this.client.post('/login', { email, password })

      return { error: null }
    } catch (error: unknown) {
      if (Axios.isAxiosError(error) && error.response?.status === 422) {
        return { error: 'Invalid credentials' }
      }

      return { error: 'Something went wrong. Please retry.' }
    }
  }

  public async logout(): Promise<void> {
    await this.client.post('/logout')
  }
}

export const ApiService = new ApiServiceApp()
