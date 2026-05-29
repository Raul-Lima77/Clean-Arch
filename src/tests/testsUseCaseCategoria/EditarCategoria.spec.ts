import { EditarCategoria } from "../../aplicacao/usecase/categoria/EditarCategoria"
import type { EditarCategoriaInputDTO } from "../../aplicacao/dto/categoria/EditarCategoriaInputDTO"
import { CategoriaRepositorioMysql } from "../../infra/bd/mysql/CategoriaRepositorioMysql"
import { Categoria } from "../../dominio/entidades/Categoria"

jest.mock("../../infra/bd/mysql/CategoriaRepositorioMysql")

describe("Caso de Uso - EditarCategoria", () => {
  let repositorioMock: jest.Mocked<CategoriaRepositorioMysql>
  let sut: EditarCategoria

  beforeEach(() => {
    repositorioMock = new CategoriaRepositorioMysql() as jest.Mocked<CategoriaRepositorioMysql>
    sut = new EditarCategoria(repositorioMock)
  })

  it("deve editar uma categoria com sucesso quando os dados forem válidos", async () => {
    const categoria = Categoria.create("Alimentação", "usuario-123", 500)
    repositorioMock.buscarPorId.mockResolvedValueOnce(categoria)
    repositorioMock.buscarPorNome.mockResolvedValueOnce(null)
    repositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto: EditarCategoriaInputDTO = {
      id: categoria.id,
      usuarioId: "usuario-123",
      nome: "Comida"
    }

    await sut.execute(inputDto)

    expect(repositorioMock.atualizar).toHaveBeenCalledTimes(1)
  })

  it("deve atualizar o limite de gasto quando fornecido", async () => {
    const categoria = Categoria.create("Transportes", "usuario-123", 200)
    repositorioMock.buscarPorId.mockResolvedValueOnce(categoria)
    repositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto: EditarCategoriaInputDTO = {
      id: categoria.id,
      usuarioId: "usuario-123",
      limiteGasto: 300
    }

    await sut.execute(inputDto)

    expect(repositorioMock.atualizar).toHaveBeenCalledTimes(1)
  })

  it("deve lançar um erro se a categoria não existir", async () => {
    repositorioMock.buscarPorId.mockResolvedValueOnce(null)

    const inputDto: EditarCategoriaInputDTO = {
      id: "id-inexistente",
      usuarioId: "usuario-123",
      nome: "Nova Categoria"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Categoria não encontrada")
  })

  it("deve lançar um erro se o usuário não for o dono da categoria", async () => {
    const categoria = Categoria.create("Lazer", "usuario-123", 150)
    repositorioMock.buscarPorId.mockResolvedValueOnce(categoria)

    const inputDto: EditarCategoriaInputDTO = {
      id: categoria.id,
      usuarioId: "usuario-diferente",
      nome: "Novo Nome"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Apenas o dono da categoria pode editá-la")
  })

  it("deve lançar um erro se o novo nome já existe para outro usuário", async () => {
    const categoria1 = Categoria.create("Categoria A", "usuario-123", 100)
    const categoria2 = Categoria.create("Categoria B", "usuario-123", 200)
    
    repositorioMock.buscarPorId.mockResolvedValueOnce(categoria2)
    repositorioMock.buscarPorNome.mockResolvedValueOnce(categoria1)

    const inputDto: EditarCategoriaInputDTO = {
      id: categoria2.id,
      usuarioId: "usuario-123",
      nome: "Categoria A"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Categoria com este nome já existe")
  })
})
