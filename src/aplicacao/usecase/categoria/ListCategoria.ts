import type { CategoriaRepositorio } from "../../../dominio/repositorios/CategoriaRepositorio"
import type { ListCategoriaDTO } from "../../dto/categoria/ListCategoriaDTO"
import type { UseCase } from "../UseCase"

export class ListCategoria implements UseCase<{ usuarioId: string }, ListCategoriaDTO[]> {
  constructor(private readonly categoriaRepositorio: CategoriaRepositorio) {}

  public async execute(input: { usuarioId: string }): Promise<ListCategoriaDTO[]> {
    const categorias = await this.categoriaRepositorio.listarPorUsuario(input.usuarioId)

    return categorias.map((categoria) => ({
      id: categoria.id,
      nome: categoria.nome,
      limiteGasto: categoria.limiteGasto,
    }))
  }
}
