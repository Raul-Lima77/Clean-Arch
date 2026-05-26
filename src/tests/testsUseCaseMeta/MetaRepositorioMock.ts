import type { MetaRepositorio } from "../../dominio/repositorios/MetaRepositorio"
import type { Meta } from "../../dominio/entidades/Meta"

export class MetaRepositorioMock implements MetaRepositorio {
  public metas: Meta[] = []

  async buscarPorId(id: string): Promise<Meta | null> {
    const meta = this.metas.find((item) => item.id === id)
    return meta || null
  }

  async listarPorUsuario(usuarioId: string): Promise<Meta[]> {
    return this.metas.filter((meta) => meta.usuarioId === usuarioId)
  }

  async salvar(meta: Meta): Promise<void> {
    this.metas.push(meta)
  }

  async atualizar(meta: Meta): Promise<void> {
    const index = this.metas.findIndex((item) => item.id === meta.id)
    if (index !== -1) {
      this.metas[index] = meta
    }
  }

  async remover(id: string): Promise<boolean> {
    const index = this.metas.findIndex((item) => item.id === id)
    if (index !== -1) {
      this.metas.splice(index, 1)
      return true
    }
    return false
  }
}
