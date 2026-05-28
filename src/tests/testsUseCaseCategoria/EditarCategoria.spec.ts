import { EditarCategoria } from "../../aplicacao/usecase/categoria/EditarCategoria"
import { CategoriaRepositorioMock } from "./CategoriaRepositorioMock"
import { Categoria } from "../../dominio/entidades/Categoria"

describe("Caso de Uso - EditarCategoria", () => {
  let repositorioMock: CategoriaRepositorioMock
  let sut: EditarCategoria

  beforeEach(() => {
    repositorioMock = new CategoriaRepositorioMock()
    sut = new EditarCategoria(repositorioMock)
  })

  it("deve editar uma categoria com sucesso quando os dados forem válidos", async () => {
    const categoria = Categoria.create("Alimentação", "usuario-123", 500)
    await repositorioMock.salvar(categoria)

    const inputDto = {
      id: categoria.id,
      usuarioId: "usuario-123",
      nome: "Comida"
    }

    await sut.execute(inputDto)

    const categoriaAtualizada = await repositorioMock.buscarPorId(categoria.id)
    expect(categoriaAtualizada?.nome).toBe("Comida")
  })

  it("deve atualizar o limite de gasto quando fornecido", async () => {
    const categoria = Categoria.create("Transportes", "usuario-123", 200)
    await repositorioMock.salvar(categoria)

    const inputDto = {
      id: categoria.id,
      usuarioId: "usuario-123",
      limiteGasto: 300
    }

    await sut.execute(inputDto)

    const categoriaAtualizada = await repositorioMock.buscarPorId(categoria.id)
    expect(categoriaAtualizada?.limiteGasto).toBe(300)
  })

  it("deve lançar um erro se a categoria não existir", async () => {
    const inputDto = {
      id: "id-inexistente",
      usuarioId: "usuario-123",
      nome: "Nova Categoria"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Categoria não encontrada")
  })

  it("deve lançar um erro se o usuário não for o dono da categoria", async () => {
    const categoria = Categoria.create("Lazer", "usuario-123", 150)
    await repositorioMock.salvar(categoria)

    const inputDto = {
      id: categoria.id,
      usuarioId: "usuario-diferente",
      nome: "Novo Nome"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Apenas o dono da categoria pode editá-la")
  })

  it("deve lançar um erro se o novo nome já existe para outro usuário", async () => {
    const categoria1 = Categoria.create("Categoria A", "usuario-123", 100)
    const categoria2 = Categoria.create("Categoria B", "usuario-123", 200)
    await repositorioMock.salvar(categoria1)
    await repositorioMock.salvar(categoria2)

    const inputDto = {
      id: categoria2.id,
      usuarioId: "usuario-123",
      nome: "Categoria A"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Categoria com este nome já existe")
  })
})
