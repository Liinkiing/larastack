import type { AxiosError, AxiosInstance } from 'axios'

import Axios from 'axios'

import { compilerEnv } from '~/shared/env'

class ApiServiceApp {
  private readonly client: AxiosInstance

  constructor() {
    const baseURL = compilerEnv.__USE_BACKEND_PROXY__ ? '/api' : process.env.NEXT_PUBLIC_API_URL

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

  public csrf(): Promise<any> {
    return this.client.get('/sanctum/csrf-cookie')
  }

  public async login({ email, password }: { email: string; password: string }): Promise<{ error: string | null }> {
    try {
      await this.client.post('/login', { email, password })

      return { error: null }
    } catch (error: unknown | AxiosError) {
      if (Axios.isAxiosError(error)) {
        return { error: 'Something went wrong. Please retry.' }
      }

      return { error: 'Invalid credentials' }
    }
  }

  public logout(): Promise<any> {
    return this.client.post('/logout')
  }
}

export const ApiService = new ApiServiceApp()
