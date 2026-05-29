import { DeleteCategoria } from "../../aplicacao/usecase/categoria/DeleteCategoria"
import type { DeleteCategoriaDTO } from "../../aplicacao/dto/categoria/DeleteCategoriaDTO"
import { CategoriaRepositorioMysql } from "../../infra/bd/mysql/CategoriaRepositorioMysql"
import { TransacaoRepositorioMysql } from "../../infra/bd/mysql/TransacaoRepositorioMysql"
import { Categoria } from "../../dominio/entidades/Categoria"

jest.mock("../../infra/bd/mysql/CategoriaRepositorioMysql")
jest.mock("../../infra/bd/mysql/TransacaoRepositorioMysql")

describe("Caso de Uso - DeleteCategoria", () => {
  let categoriaRepositorioMock: jest.Mocked<CategoriaRepositorioMysql>
  let transacaoRepositorioMock: jest.Mocked<TransacaoRepositorioMysql>
  let sut: DeleteCategoria

  beforeEach(() => {
    categoriaRepositorioMock = new CategoriaRepositorioMysql() as jest.Mocked<CategoriaRepositorioMysql>
    transacaoRepositorioMock = new TransacaoRepositorioMysql() as jest.Mocked<TransacaoRepositorioMysql>
    sut = new DeleteCategoria(categoriaRepositorioMock, transacaoRepositorioMock)
  })

  it("deve deletar uma categoria com sucesso quando ela não estiver em uso", async () => {
    const categoria = Categoria.create("Alimentação", "usuario-123", 500)
    
    categoriaRepositorioMock.buscarPorId.mockResolvedValueOnce(categoria)
    transacaoRepositorioMock.filtrarPorCategoria.mockResolvedValueOnce([])
    categoriaRepositorioMock.remover.mockResolvedValueOnce(true)

    const inputDto: DeleteCategoriaDTO = {
      id: categoria.id,
      usuarioId: "usuario-123"
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toBe(true)
    expect(categoriaRepositorioMock.remover).toHaveBeenCalledWith(categoria.id)
  })

  it("deve lançar um erro se a categoria não existir", async () => {
    categoriaRepositorioMock.buscarPorId.mockResolvedValueOnce(null)

    const inputDto: DeleteCategoriaDTO = {
      id: "id-inexistente",
      usuarioId: "usuario-123"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Categoria não encontrada")
  })

  it("deve lançar um erro se o usuário não for o dono da categoria", async () => {
    const categoria = Categoria.create("Transporte", "usuario-123", 300)
    categoriaRepositorioMock.buscarPorId.mockResolvedValueOnce(categoria)

    const inputDto: DeleteCategoriaDTO = {
      id: categoria.id,
      usuarioId: "usuario-diferente"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Apenas o dono da categoria pode excluí-la")
  })

  it("deve lançar um erro se a categoria estiver em uso por alguma transação", async () => {
    const categoria = Categoria.create("Lazer", "usuario-123", 200)
    
    categoriaRepositorioMock.buscarPorId.mockResolvedValueOnce(categoria)
    transacaoRepositorioMock.filtrarPorCategoria.mockResolvedValueOnce([{ id: "transacao-1" }] as any)

    const inputDto: DeleteCategoriaDTO = {
      id: categoria.id,
      usuarioId: "usuario-123"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Não é possível excluir categoria em uso. Altere as transações primeiro.")
  })
})
