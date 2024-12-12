export type Task = {
    id: number
    title: string
    genreId?: number | null
    order?: number | null
    created_at: string
    updated_at: string
  }
  export type CsrfToken = {
    csrf_token: string
  }
  export type Credential = {
    email: string
    password: string
  }