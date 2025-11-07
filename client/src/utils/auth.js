import { jwtDecode } from 'jwt-decode'


const TOKEN_KEY = 'token_myapp'

export function saveToken(token){
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(){
  return localStorage.getItem(TOKEN_KEY)
}

export function logout(){
  localStorage.removeItem(TOKEN_KEY)
}

export function getUserFromToken(){
  const token = getToken()
  if (!token) return null
  try {
    const payload = jwtDecode(token)
    return payload
  } catch (e){
    return null
  }
}
