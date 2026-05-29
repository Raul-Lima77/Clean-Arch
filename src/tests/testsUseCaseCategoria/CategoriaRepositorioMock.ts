import type { CategoriaRepositorio } from "../../dominio/repositorios/CategoriaRepositorio"
import type { Categoria } from "../../dominio/entidades/Categoria"

export class CategoriaRepositorioMock implements CategoriaRepositorio {
  public categorias: Categoria[] = []

  async buscarPorId(id: string): Promise<Categoria | null> {
    const categoria = this.categorias.find(c => c.id === id)
    return categoria || null
  }

  async buscarPorNome(nome: string, usuarioId: string): Promise<Categoria | null> {
    const categoria = this.categorias.find(c => c.nome === nome && c.usuarioId === usuarioId)
    return categoria || null
  }

  async listarPorUsuario(usuarioId: string): Promise<Categoria[]> {
    return this.categorias.filter(c => c.usuarioId === usuarioId)
  }

  async salvar(categoria: Categoria): Promise<void> {
    this.categorias.push(categoria)
  }

  async atualizar(categoria: Categoria): Promise<void> {
    const index = this.categorias.findIndex(c => c.id === categoria.id)
    if (index !== -1) {
      this.categorias[index] = categoria
    }
  }

  async remover(id: string): Promise<boolean> {
    const index = this.categorias.findIndex(c => c.id === id)
    if (index !== -1) {
      this.categorias.splice(index, 1)
      return true
    }
    return false
  }
}
