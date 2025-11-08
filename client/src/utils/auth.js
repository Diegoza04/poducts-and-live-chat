import { jwtDecode } from 'jwt-decode'


const TOKEN_KEYS = ['token', 'practica1_token']

export function saveToken(token) {

  localStorage.setItem(TOKEN_KEYS[0], token)
}

export function getToken() {
  for (const k of TOKEN_KEYS) {
    const t = localStorage.getItem(k)
    if (t) return t
  }
  return null
}

export function logout() {
  for (const k of TOKEN_KEYS) localStorage.removeItem(k)
}

export function getUserFromToken() {
  const token = getToken()
  if (!token) return null
  try {
    const payload = jwtDecode(token)
    // aseguramos que exista role
    if (!payload.role && payload.rol) payload.role = payload.rol
    return payload
  } catch {
    return null
  }
}

export function isAdmin() {
  const u = getUserFromToken()
  return !!u && u.role === 'admin'
}
