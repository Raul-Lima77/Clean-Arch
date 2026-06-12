import { Categoria } from "../../../dominio/entidades/Categoria"

export class CategoriaRepositorioMock {
  public categorias: Categoria[] = []

  async buscarPorId(id: string) {
    return this.categorias.find(c => c.id === id) ?? null
  }

  async listarPorUsuario(usuarioId: string) {
    return this.categorias.filter(c => c.usuarioId === usuarioId)
  }

  async buscarPorNome(nome: string, usuarioId: string) {
    return this.categorias.find(c => c.nome === nome && c.usuarioId === usuarioId) ?? null
  }

  async salvar(categoria: Categoria) {
    this.categorias.push(categoria)
  }

  async atualizar(categoria: Categoria) {
    const idx = this.categorias.findIndex(c => c.id === categoria.id)
    if (idx >= 0) this.categorias[idx] = categoria
  }

  async remover(id: string) {
    const idx = this.categorias.findIndex(c => c.id === id)
    if (idx >= 0) {
      this.categorias.splice(idx, 1)
      return true
    }
    return false
  }
}
