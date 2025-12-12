import { Meta } from "../../../dominio/entidades/Meta"
import type { MetaRepositorio } from "../../../dominio/repositorios/MetaRepositorio"
import type { CreateMetaInputDTO } from "../../dto/meta/CreateMetaInputDTO"
import type { CreateMetaOutputDTO } from "../../dto/meta/CreateMetaOutputDTO"
import type { UseCase } from "../UseCase"

export class CreateMeta implements UseCase<CreateMetaInputDTO, CreateMetaOutputDTO> {
  constructor(private readonly metaRepositorio: MetaRepositorio) {}

  public async execute(inputDto: CreateMetaInputDTO): Promise<CreateMetaOutputDTO> {
    const meta = Meta.create(
      inputDto.descricao,
      inputDto.valorAlvo,
      inputDto.dataInicio,
      inputDto.dataFim,
      inputDto.usuarioId,
    )

    await this.metaRepositorio.salvar(meta)

    const outputDTO: CreateMetaOutputDTO = { id: meta.id }

    return outputDTO
  }
}
