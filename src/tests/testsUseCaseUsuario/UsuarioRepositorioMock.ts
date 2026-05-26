import type { UsuarioRepositorio } from "../../dominio/repositorios/UsuarioRepositorio"
import type { Usuario } from "../../dominio/entidades/Usuario"

export class UsuarioRepositorioMock implements UsuarioRepositorio {
  
  public usuarios: Usuario[] = []

  async buscarPorId(id: string): Promise<Usuario | null> {
    const usuario = this.usuarios.find(u => u.id === id)
    return usuario || null
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const usuario = this.usuarios.find(u => u.email === email)
    return usuario || null
  }

  async listar(): Promise<Usuario[]> {
    return this.usuarios
  }

  async salvar(usuario: Usuario): Promise<void> {
    this.usuarios.push(usuario)
  }

  async atualizar(usuario: Usuario): Promise<void> {
    const index = this.usuarios.findIndex(u => u.id === usuario.id)
    if (index !== -1) {
      this.usuarios[index] = usuario
    }
  }

  async remover(id: string): Promise<boolean> {
    const index = this.usuarios.findIndex(u => u.id === id)
    if (index !== -1) {
      this.usuarios.splice(index, 1)
      return true
    }
    return false
  }
}