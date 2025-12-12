import type { CategoriaRepositorio } from "../../../dominio/repositorios/CategoriaRepositorio"
import type { TransacaoRepositorio } from "../../../dominio/repositorios/TransacaoRepositorio"
import type { DeleteCategoriaDTO } from "../../dto/categoria/DeleteCategoriaDTO"
import type { UseCase } from "../UseCase"

export class DeleteCategoria implements UseCase<DeleteCategoriaDTO, boolean> {
  constructor(
    private readonly categoriaRepositorio: CategoriaRepositorio,
    private readonly transacaoRepositorio: TransacaoRepositorio,
  ) {}

  public async execute(inputDto: DeleteCategoriaDTO): Promise<boolean> {
    const categoria = await this.categoriaRepositorio.buscarPorId(inputDto.id)

    if (!categoria) {
      throw new Error("Categoria não encontrada")
    }

    if (categoria.usuarioId !== inputDto.usuarioId) {
      throw new Error("Apenas o dono da categoria pode excluí-la")
    }

    // Verificar se categoria está em uso
    const transacoes = await this.transacaoRepositorio.filtrarPorCategoria(inputDto.usuarioId, inputDto.id)
    if (transacoes.length > 0) {
      throw new Error("Não é possível excluir categoria em uso. Altere as transações primeiro.")
    }

    return await this.categoriaRepositorio.remover(inputDto.id)
  }
}
