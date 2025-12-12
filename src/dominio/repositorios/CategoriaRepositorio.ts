import { Categoria } from "../entidades/Categoria"

export interface CategoriaRepositorio {
  buscarPorId(id: string): Promise<Categoria | null>
  listarPorUsuario(usuarioId: string): Promise<Categoria[]>
  buscarPorNome(nome: string, usuarioId: string): Promise<Categoria | null>
  salvar(categoria: Categoria): Promise<void>
  atualizar(categoria: Categoria): Promise<void>
  remover(id: string): Promise<boolean>
}
