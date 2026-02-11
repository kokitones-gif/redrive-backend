const API_BASE = '/api'

export interface ApiError {
  message: string
  status?: number
  code?: string
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP ${response.status}`,
        status: response.status,
      }

      try {
        const data = await response.json()
        error.message = data.message || error.message
        error.code = data.code
      } catch {
        // Response wasn't JSON, use status text
        error.message = response.statusText || error.message
      }

      throw error
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return {} as T
    }

    return await response.json()
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
      throw error as ApiError
    }

    throw {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: undefined,
      code: undefined,
    } as ApiError
  }
}

// ============= Auth Endpoints =============
export const authApi = {
  register: (data: {
    email: string
    password: string
    name: string
    role: string
    phone?: string
  }) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string; role: string }) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiFetch('/auth/logout', {
      method: 'POST',
    }),

  getSession: () => apiFetch('/auth/session'),
}

// ============= Instructor Endpoints =============
export const instructorApi = {
  list: (params?: Record<string, string>) =>
    apiFetch<any>(
      `/instructors?${new URLSearchParams(params || {}).toString()}`
    ),

  getById: (id: string) => apiFetch<any>(`/instructors/${id}`),

  getAvailability: (id: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    return apiFetch<any>(
      `/instructors/${id}/availability?${params.toString()}`
    )
  },

  getReviews: (id: string) => apiFetch<any>(`/instructors/${id}/reviews`),
}

// ============= Booking Endpoints =============
export const bookingApi = {
  list: (params?: Record<string, string>) =>
    apiFetch<any>(
      `/bookings?${new URLSearchParams(params || {}).toString()}`
    ),

  getById: (id: string) => apiFetch<any>(`/bookings/${id}`),

  create: (data: any) =>
    apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  confirm: (id: string) =>
    apiFetch(`/bookings/${id}/confirm`, {
      method: 'POST',
    }),

  cancel: (id: string, reason?: string) =>
    apiFetch(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
}

// ============= Message Endpoints =============
export const messageApi = {
  getConversations: () => apiFetch<any>('/messages'),

  getMessages: (conversationId: string) =>
    apiFetch<any>(`/messages/${conversationId}`),

  sendMessage: (conversationId: string, content: string) =>
    apiFetch(`/messages/${conversationId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
}

// ============= Review Endpoints =============
export const reviewApi = {
  create: (data: any) =>
    apiFetch('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  reply: (id: string, reply: string) =>
    apiFetch(`/reviews/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply }),
    }),
}

// ============= Search Endpoint =============
export const searchApi = {
  search: (params: Record<string, string>) =>
    apiFetch<any>(`/search?${new URLSearchParams(params).toString()}`),
}

// ============= Dashboard Endpoints =============
export const dashboardApi = {
  studentDashboard: () => apiFetch<any>('/mypage'),

  instructorDashboard: () => apiFetch<any>('/instructor-dashboard'),

  instructorEarnings: () => apiFetch<any>('/instructor-dashboard/earnings'),

  instructorSchedule: (params?: Record<string, string>) =>
    apiFetch<any>(
      `/instructor-dashboard/schedule?${new URLSearchParams(params || {}).toString()}`
    ),
}
