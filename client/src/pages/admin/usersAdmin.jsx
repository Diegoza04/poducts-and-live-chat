import React, { useEffect, useState } from 'react'
import Card from '../../components/UI/Card'
import Button from '../../components/UI/Button'
import { graphqlFetch } from '../../services/api'

export default function UsersAdmin() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const query = `
      query Users {
        users {
          id
          username
          role
        }
      }
    `
    try {
      const data = await graphqlFetch(query)
      setUsers(data.users || [])
    } catch (err) {
      console.error('Error al cargar usuarios:', err)
    }
  }

  async function changeUserRole(userId, newRole) {
    const mutation = `
      mutation UpdateUserRole($id: ID!, $role: String!) {
        updateUserRole(id: $id, role: $role) {
          id
          role
        }
      }
    `
    try {
      const data = await graphqlFetch(mutation, { id: userId, role: newRole })
      alert(`Rol actualizado: ${data.updateUserRole.role}`)
      loadUsers()
    } catch (err) {
      console.error('Error al actualizar rol del usuario:', err)
    }
  }

  async function deleteUser(userId) {
    const mutation = `
      mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
      }
    `
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) return
    try {
      await graphqlFetch(mutation, { id: userId })
      alert('Usuario eliminado correctamente.')
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (err) {
      console.error('Error al eliminar usuario:', err)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold">Usuarios</h2>
        <p className="text-[var(--muted)]">Gestión de usuarios registrados</p>
      </Card>

      <Card className="divide-y divide-white/10">
        {users.length === 0 ? (
          <div className="p-6 text-white/60">No se encontraron usuarios registrados.</div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <strong className="text-white font-bold">{user.username}</strong>
                <span className="text-sm text-white/60">Rol: {user.role}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() =>
                    changeUserRole(user.id, user.role === 'user' ? 'admin' : 'user')
                  }
                >
                  {user.role === 'user' ? 'Hacer Admin' : 'Hacer Usuario'}
                </Button>
                <Button variant="danger" onClick={() => deleteUser(user.id)}>
                  Eliminar
                </Button>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}