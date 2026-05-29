import { ListCategoria } from "../../aplicacao/usecase/categoria/ListCategoria"
import type { ListCategoriaDTO } from "../../aplicacao/dto/categoria/ListCategoriaDTO"
import { CategoriaRepositorioMysql } from "../../infra/bd/mysql/CategoriaRepositorioMysql"
import { Categoria } from "../../dominio/entidades/Categoria"

jest.mock("../../infra/bd/mysql/CategoriaRepositorioMysql")

describe("Caso de Uso - ListCategoria", () => {
  let repositorioMock: jest.Mocked<CategoriaRepositorioMysql>
  let sut: ListCategoria

  beforeEach(() => {
    repositorioMock = new CategoriaRepositorioMysql() as jest.Mocked<CategoriaRepositorioMysql>
    sut = new ListCategoria(repositorioMock)
  })

  it("deve listar todas as categorias de um usuário com sucesso", async () => {
    const categoria1 = Categoria.create("Alimentação", "usuario-123", 500)
    const categoria2 = Categoria.create("Transporte", "usuario-123", 300)
    const categoria3 = Categoria.create("Diversão", "usuario-123", 200)

    repositorioMock.listarPorUsuario.mockResolvedValueOnce([categoria1, categoria2, categoria3])

    const resultado: ListCategoriaDTO[] = await sut.execute({ usuarioId: "usuario-123" })

    expect(repositorioMock.listarPorUsuario).toHaveBeenCalledWith("usuario-123")
    expect(resultado).toHaveLength(3)
  })

  it("deve retornar apenas as categorias do usuário específico", async () => {
    const categoria1 = Categoria.create("Alimentação", "usuario-123", 500)
    const categoria3 = Categoria.create("Diversão", "usuario-123", 200)

    repositorioMock.listarPorUsuario.mockResolvedValueOnce([categoria1, categoria3])

    const resultado: ListCategoriaDTO[] = await sut.execute({ usuarioId: "usuario-123" })

    expect(repositorioMock.listarPorUsuario).toHaveBeenCalledWith("usuario-123")
    expect(resultado).toHaveLength(2)
  })

  it("deve retornar um array vazio se o usuário não tiver categorias", async () => {
    repositorioMock.listarPorUsuario.mockResolvedValueOnce([])

    const resultado: ListCategoriaDTO[] = await sut.execute({ usuarioId: "usuario-sem-categorias" })

    expect(repositorioMock.listarPorUsuario).toHaveBeenCalledWith("usuario-sem-categorias")
    expect(resultado).toHaveLength(0)
  })

  it("deve retornar todas as propriedades da categoria no DTO", async () => {
    const categoria = Categoria.create("Saúde", "usuario-123", 400)
    repositorioMock.listarPorUsuario.mockResolvedValueOnce([categoria])

    const resultado: ListCategoriaDTO[] = await sut.execute({ usuarioId: "usuario-123" })

    expect(resultado[0]).toHaveProperty("id")
    expect(resultado[0]).toHaveProperty("nome")
    expect(resultado[0]).toHaveProperty("limiteGasto")
  })
})
