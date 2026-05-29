import { CreateCategoria } from "../../aplicacao/usecase/categoria/CreateCategoria"
import { CategoriaRepositorioMock } from "./CategoriaRepositorioMock"

describe("Caso de Uso - CreateCategoria", () => {
  let repositorioMock: CategoriaRepositorioMock
  let sut: CreateCategoria

  beforeEach(() => {
    repositorioMock = new CategoriaRepositorioMock()
    sut = new CreateCategoria(repositorioMock)
  })

  it("deve criar uma categoria com sucesso quando os dados forem válidos", async () => {
    const inputDto = {
      nome: "Alimentação",
      usuarioId: "usuario-123",
      limiteGasto: 500
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toHaveProperty("id")
    expect(repositorioMock.categorias.length).toBe(1)
    expect(repositorioMock.categorias[0].nome).toBe("Alimentação")
    expect(repositorioMock.categorias[0].usuarioId).toBe("usuario-123")
  })

  it("deve criar uma categoria sem limite de gasto quando limiteGasto não for fornecido", async () => {
    const inputDto = {
      nome: "Transporte",
      usuarioId: "usuario-123"
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toHaveProperty("id")
    expect(repositorioMock.categorias.length).toBe(1)
    expect(repositorioMock.categorias[0].limiteGasto).toBeUndefined()
  })

  it("deve lançar um erro se uma categoria com o mesmo nome já existir para o usuário", async () => {
    const inputDto = {
      nome: "Diversão",
      usuarioId: "usuario-123",
      limiteGasto: 200
    }

    await sut.execute(inputDto)

    const inputDtoDuplicado = {
      nome: "Diversão",
      usuarioId: "usuario-123",
      limiteGasto: 300
    }

    await expect(sut.execute(inputDtoDuplicado)).rejects.toThrow("Categoria com este nome já existe")
    expect(repositorioMock.categorias.length).toBe(1)
  })

  it("deve permitir criar categorias com o mesmo nome para usuários diferentes", async () => {
    const inputDto1 = {
      nome: "Saúde",
      usuarioId: "usuario-1",
      limiteGasto: 300
    }

    const inputDto2 = {
      nome: "Saúde",
      usuarioId: "usuario-2",
      limiteGasto: 400
    }

    await sut.execute(inputDto1)
    const resultado = await sut.execute(inputDto2)

    expect(resultado).toHaveProperty("id")
    expect(repositorioMock.categorias.length).toBe(2)
  })
})
