import type { TransacaoRepositorio } from "../../dominio/repositorios/TransacaoRepositorio"
import type { Transacao } from "../../dominio/entidades/Transacao"

export class TransacaoRepositorioMock implements TransacaoRepositorio {
  public transacoes: Transacao[] = []
  private filtrarPorCategoriaResponse: Transacao[] = []

  async buscarPorId(id: string): Promise<Transacao | null> {
    const transacao = this.transacoes.find(t => t.id === id)
    return transacao || null
  }

  async listarPorUsuario(usuarioId: string): Promise<Transacao[]> {
    return this.transacoes.filter(t => t.usuarioId === usuarioId)
  }

  async filtrarPorCategoria(usuarioId: string, categoriaId: string): Promise<Transacao[]> {
    if (this.filtrarPorCategoriaResponse.length > 0) {
      return this.filtrarPorCategoriaResponse
    }
    return this.transacoes.filter(
      t => t.usuarioId === usuarioId && t.categoriaId === categoriaId
    )
  }

  async filtrarPorPeriodo(usuarioId: string, dataInicio: Date, dataFim: Date): Promise<Transacao[]> {
    return this.transacoes.filter(
      t => t.usuarioId === usuarioId && t.data >= dataInicio && t.data <= dataFim
    )
  }

  async salvar(transacao: Transacao): Promise<void> {
    this.transacoes.push(transacao)
  }

  async atualizar(transacao: Transacao): Promise<void> {
    const index = this.transacoes.findIndex(t => t.id === transacao.id)
    if (index !== -1) {
      this.transacoes[index] = transacao
    }
  }

  async remover(id: string): Promise<boolean> {
    const index = this.transacoes.findIndex(t => t.id === id)
    if (index !== -1) {
      this.transacoes.splice(index, 1)
      return true
    }
    return false
  }

  // Método para simular resposta em testes
  setFiltrarPorCategoriaResponse(transacoes: Transacao[]): void {
    this.filtrarPorCategoriaResponse = transacoes
  }
}
