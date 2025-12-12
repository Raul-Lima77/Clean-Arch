import { Usuario } from "../entidades/Usuario"

export interface UsuarioRepositorio {
  buscarPorId(id: string): Promise<Usuario | null>
  buscarPorEmail(email: string): Promise<Usuario | null>
  listar(): Promise<Usuario[]>
  salvar(usuario: Usuario): Promise<void>
  atualizar(usuario: Usuario): Promise<void>
  remover(id: string): Promise<boolean>
}
