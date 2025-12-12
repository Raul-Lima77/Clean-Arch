import type { MetaRepositorio } from "../../../dominio/repositorios/MetaRepositorio"
import type { ListMetaDTO } from "../../dto/meta/ListMetaDTO"
import type { UseCase } from "../UseCase"

export class ListMeta implements UseCase<{ usuarioId: string }, ListMetaDTO[]> {
  constructor(private readonly metaRepositorio: MetaRepositorio) {}

  public async execute(input: { usuarioId: string }): Promise<ListMetaDTO[]> {
    const metas = await this.metaRepositorio.listarPorUsuario(input.usuarioId)

    return metas.map((meta) => ({
      id: meta.id,
      descricao: meta.descricao,
      valorAlvo: meta.valorAlvo,
      valorAtual: meta.valorAtual,
      progresso: meta.calcularProgresso(),
      dataInicio: meta.dataInicio,
      dataFim: meta.dataFim,
    }))
  }
}
