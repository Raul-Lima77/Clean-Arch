import type { CategoriaRepositorio } from "../../../dominio/repositorios/CategoriaRepositorio"
import type { EditarCategoriaInputDTO } from "../../dto/categoria/EditarCategoriaInputDTO"
import type { UseCase } from "../UseCase"

export class EditarCategoria implements UseCase<EditarCategoriaInputDTO, void> {
  constructor(private readonly categoriaRepositorio: CategoriaRepositorio) {}

  public async execute(inputDto: EditarCategoriaInputDTO): Promise<void> {
    const categoria = await this.categoriaRepositorio.buscarPorId(inputDto.id)

    if (!categoria) {
      throw new Error("Categoria não encontrada")
    }

    if (categoria.usuarioId !== inputDto.usuarioId) {
      throw new Error("Apenas o dono da categoria pode editá-la")
    }

    // Verificar se novo nome já existe
    if (inputDto.nome) {
      const categoriaExistente = await this.categoriaRepositorio.buscarPorNome(inputDto.nome, inputDto.usuarioId)
      if (categoriaExistente && categoriaExistente.id !== categoria.id) {
        throw new Error("Categoria com este nome já existe")
      }
    }

    categoria.editar(inputDto.nome, inputDto.limiteGasto)
    await this.categoriaRepositorio.atualizar(categoria)
  }
}
