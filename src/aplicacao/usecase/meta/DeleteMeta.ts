import type { MetaRepositorio } from "../../../dominio/repositorios/MetaRepositorio"
import type { DeleteMetaDTO } from "../../dto/meta/DeleteMetaDTO"
import type { UseCase } from "../UseCase"

export class DeleteMeta implements UseCase<DeleteMetaDTO, boolean> {
  constructor(private readonly metaRepositorio: MetaRepositorio) {}

  public async execute(inputDto: DeleteMetaDTO): Promise<boolean> {
    const meta = await this.metaRepositorio.buscarPorId(inputDto.id)

    if (!meta) {
      throw new Error("Meta não encontrada")
    }

    if (meta.usuarioId !== inputDto.usuarioId) {
      throw new Error("Apenas o dono da meta pode excluí-la")
    }

    return await this.metaRepositorio.remover(inputDto.id)
  }
}
