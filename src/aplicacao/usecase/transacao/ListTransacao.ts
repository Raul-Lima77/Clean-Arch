import type { TransacaoRepositorio } from "../../../dominio/repositorios/TransacaoRepositorio"
import type { ListTransacaoDTO } from "../../dto/transacao/ListTransacaoDTO"
import type { UseCase } from "../UseCase"

export class ListTransacao implements UseCase<{ usuarioId: string }, ListTransacaoDTO[]> {
  constructor(private readonly transacaoRepositorio: TransacaoRepositorio) {}

  public async execute(input: { usuarioId: string }): Promise<ListTransacaoDTO[]> {
    const transacoes = await this.transacaoRepositorio.listarPorUsuario(input.usuarioId)

    return transacoes.map((transacao) => ({
      id: transacao.id,
      tipo: transacao.tipo,
      descricao: transacao.descricao,
      valor: transacao.valor,
      data: transacao.data,
      categoriaId: transacao.categoriaId,
    }))
  }
}
