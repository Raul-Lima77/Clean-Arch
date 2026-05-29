import { ListCategoria } from "../../aplicacao/usecase/categoria/ListCategoria"
import { CategoriaRepositorioMock } from "./CategoriaRepositorioMock"
import { Categoria } from "../../dominio/entidades/Categoria"

describe("Caso de Uso - ListCategoria", () => {
  let repositorioMock: CategoriaRepositorioMock
  let sut: ListCategoria

  beforeEach(() => {
    repositorioMock = new CategoriaRepositorioMock()
    sut = new ListCategoria(repositorioMock)
  })

  it("deve listar todas as categorias de um usuário com sucesso", async () => {
    const categoria1 = Categoria.create("Alimentação", "usuario-123", 500)
    const categoria2 = Categoria.create("Transporte", "usuario-123", 300)
    const categoria3 = Categoria.create("Diversão", "usuario-123", 200)

    await repositorioMock.salvar(categoria1)
    await repositorioMock.salvar(categoria2)
    await repositorioMock.salvar(categoria3)

    const resultado = await sut.execute({ usuarioId: "usuario-123" })

    expect(resultado).toHaveLength(3)
    expect(resultado[0].nome).toBe("Alimentação")
    expect(resultado[1].nome).toBe("Transporte")
    expect(resultado[2].nome).toBe("Diversão")
  })

  it("deve retornar apenas as categorias do usuário específico", async () => {
    const categoria1 = Categoria.create("Alimentação", "usuario-123", 500)
    const categoria2 = Categoria.create("Transporte", "usuario-456", 300)
    const categoria3 = Categoria.create("Diversão", "usuario-123", 200)

    await repositorioMock.salvar(categoria1)
    await repositorioMock.salvar(categoria2)
    await repositorioMock.salvar(categoria3)

    const resultado = await sut.execute({ usuarioId: "usuario-123" })

    expect(resultado).toHaveLength(2)
    expect(resultado.every(c => c.id === categoria1.id || c.id === categoria3.id)).toBe(true)
  })

  it("deve retornar um array vazio se o usuário não tiver categorias", async () => {
    const resultado = await sut.execute({ usuarioId: "usuario-sem-categorias" })

    expect(resultado).toHaveLength(0)
    expect(Array.isArray(resultado)).toBe(true)
  })

  it("deve retornar todas as propriedades da categoria no DTO", async () => {
    const categoria = Categoria.create("Saúde", "usuario-123", 400)
    await repositorioMock.salvar(categoria)

    const resultado = await sut.execute({ usuarioId: "usuario-123" })

    expect(resultado[0]).toHaveProperty("id")
    expect(resultado[0]).toHaveProperty("nome")
    expect(resultado[0]).toHaveProperty("limiteGasto")
  })
})
