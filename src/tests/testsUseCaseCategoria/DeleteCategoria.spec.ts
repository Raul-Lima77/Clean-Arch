import { DeleteCategoria } from "../../aplicacao/usecase/categoria/DeleteCategoria"
import { CategoriaRepositorioMock } from "./CategoriaRepositorioMock"
import { TransacaoRepositorioMock } from "../testsUseCaseTransacao/TransacaoRepositorioMock"
import { Categoria } from "../../dominio/entidades/Categoria"

describe("Caso de Uso - DeleteCategoria", () => {
  let categoriaRepositorioMock: CategoriaRepositorioMock
  let transacaoRepositorioMock: TransacaoRepositorioMock
  let sut: DeleteCategoria

  beforeEach(() => {
    categoriaRepositorioMock = new CategoriaRepositorioMock()
    transacaoRepositorioMock = new TransacaoRepositorioMock()
    sut = new DeleteCategoria(categoriaRepositorioMock, transacaoRepositorioMock)
  })

  it("deve deletar uma categoria com sucesso quando ela não estiver em uso", async () => {
    const categoria = Categoria.create("Alimentação", "usuario-123", 500)
    await categoriaRepositorioMock.salvar(categoria)

    const inputDto = {
      id: categoria.id,
      usuarioId: "usuario-123"
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toBe(true)
    expect(categoriaRepositorioMock.categorias.length).toBe(0)
  })

  it("deve lançar um erro se a categoria não existir", async () => {
    const inputDto = {
      id: "id-inexistente",
      usuarioId: "usuario-123"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Categoria não encontrada")
  })

  it("deve lançar um erro se o usuário não for o dono da categoria", async () => {
    const categoria = Categoria.create("Transporte", "usuario-123", 300)
    await categoriaRepositorioMock.salvar(categoria)

    const inputDto = {
      id: categoria.id,
      usuarioId: "usuario-diferente"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Apenas o dono da categoria pode excluí-la")
  })

  it("deve lançar um erro se a categoria estiver em uso por alguma transação", async () => {
    const categoria = Categoria.create("Lazer", "usuario-123", 200)
    await categoriaRepositorioMock.salvar(categoria)

    // Simular que existe uma transação usando esta categoria
    transacaoRepositorioMock.setFiltrarPorCategoriaResponse([{ id: "transacao-1" }] as any)

    const inputDto = {
      id: categoria.id,
      usuarioId: "usuario-123"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Não é possível excluir categoria em uso. Altere as transações primeiro.")
  })
})
