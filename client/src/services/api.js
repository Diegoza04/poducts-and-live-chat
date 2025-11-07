import { getToken } from '../utils/auth'

export async function apiFetch(path, options = {}){
  const headers = options.headers || {}
  const token = getToken()
  if (token) headers['Authorization'] = 'Bearer ' + token
  if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'
  const res = await fetch('/api' + path, { ...options, headers })
  const body = await res.json().catch(()=>null)
  if (!res.ok) {
    const err = new Error(body?.message || res.statusText || 'API error')
    err.status = res.status
    err.body = body
    throw err
  }
  return body
}
