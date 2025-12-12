import type { TransacaoRepositorio } from "../../../dominio/repositorios/TransacaoRepositorio"
import type { FiltrarTransacaoInputDTO } from "../../dto/transacao/FiltrarTransacaoInputDTO"
import type { ListTransacaoDTO } from "../../dto/transacao/ListTransacaoDTO"
import type { UseCase } from "../UseCase"

export class FiltrarTransacao implements UseCase<FiltrarTransacaoInputDTO, ListTransacaoDTO[]> {
  constructor(private readonly transacaoRepositorio: TransacaoRepositorio) {}

  public async execute(inputDto: FiltrarTransacaoInputDTO): Promise<ListTransacaoDTO[]> {
    let transacoes

    if (inputDto.dataInicio && inputDto.dataFim) {
      if (inputDto.dataInicio > inputDto.dataFim) {
        throw new Error("Data inicial deve ser anterior à data final")
      }
      transacoes = await this.transacaoRepositorio.filtrarPorPeriodo(
        inputDto.usuarioId,
        inputDto.dataInicio,
        inputDto.dataFim,
      )
    } else if (inputDto.categoriaId) {
      transacoes = await this.transacaoRepositorio.filtrarPorCategoria(inputDto.usuarioId, inputDto.categoriaId)
    } else {
      transacoes = await this.transacaoRepositorio.listarPorUsuario(inputDto.usuarioId)
    }

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
