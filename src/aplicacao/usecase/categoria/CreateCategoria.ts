import { Categoria } from "../../../dominio/entidades/Categoria"
import type { CategoriaRepositorio } from "../../../dominio/repositorios/CategoriaRepositorio"
import type { CreateCategoriaInputDTO } from "../../dto/categoria/CreateCategoriaInputDTO"
import type { CreateCategoriaOutputDTO } from "../../dto/categoria/CreateCategoriaOutputDTO"
import type { UseCase } from "../UseCase"

export class CreateCategoria implements UseCase<CreateCategoriaInputDTO, CreateCategoriaOutputDTO> {
  constructor(private readonly categoriaRepositorio: CategoriaRepositorio) {}

  public async execute(inputDto: CreateCategoriaInputDTO): Promise<CreateCategoriaOutputDTO> {
    
    // Verificar se categoria já existe
    const categoriaExistente = await this.categoriaRepositorio.buscarPorNome(inputDto.nome, inputDto.usuarioId)
    if (categoriaExistente) {
      throw new Error("Categoria com este nome já existe")
    }

    const categoria = Categoria.create(inputDto.nome, inputDto.usuarioId, inputDto.limiteGasto)
    await this.categoriaRepositorio.salvar(categoria)

    const outputDTO: CreateCategoriaOutputDTO = { id: categoria.id }
    return outputDTO
  }
}
