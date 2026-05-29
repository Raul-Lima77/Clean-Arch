import { DeleteMeta } from "../../aplicacao/usecase/meta/DeleteMeta"
import { MetaRepositorioMock } from "./MetaRepositorioMock"
import { Meta } from "../../dominio/entidades/Meta"

describe("Caso de Uso - DeleteMeta", () => {
  let repositorioMock: MetaRepositorioMock
  let sut: DeleteMeta

  beforeEach(() => {
    repositorioMock = new MetaRepositorioMock()
    sut = new DeleteMeta(repositorioMock)
  })

  it("deve deletar uma meta com sucesso quando os dados forem válidos", async () => {
    const dataInicio = new Date("2024-01-01")
    const dataFim = new Date("2024-12-31")

    const meta = Meta.create("Economizar", 5000, dataInicio, dataFim, "usuario-123")
    await repositorioMock.salvar(meta)

    const inputDto = {
      id: meta.id,
      usuarioId: "usuario-123"
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toBe(true)
    expect(repositorioMock.metas.length).toBe(0)
  })

  it("deve lançar um erro se a meta não existir", async () => {
    const inputDto = {
      id: "id-inexistente",
      usuarioId: "usuario-123"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Meta não encontrada")
  })

  it("deve lançar um erro se o usuário não for o dono da meta", async () => {
    const dataInicio = new Date("2024-01-01")
    const dataFim = new Date("2024-12-31")

    const meta = Meta.create("Meta", 1000, dataInicio, dataFim, "usuario-123")
    await repositorioMock.salvar(meta)

    const inputDto = {
      id: meta.id,
      usuarioId: "usuario-diferente"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Apenas o dono da meta pode excluí-la")
  })

  it("deve deletar múltiplas metas de um usuário sem afetar outras", async () => {
    const dataInicio = new Date("2024-01-01")
    const dataFim = new Date("2024-12-31")

    const meta1 = Meta.create("Meta 1", 1000, dataInicio, dataFim, "usuario-123")
    const meta2 = Meta.create("Meta 2", 2000, dataInicio, dataFim, "usuario-123")
    const meta3 = Meta.create("Meta 3", 3000, dataInicio, dataFim, "usuario-123")

    await repositorioMock.salvar(meta1)
    await repositorioMock.salvar(meta2)
    await repositorioMock.salvar(meta3)

    await sut.execute({ id: meta1.id, usuarioId: "usuario-123" })

    expect(repositorioMock.metas.length).toBe(2)
    expect(repositorioMock.metas.some(m => m.id === meta2.id)).toBe(true)
    expect(repositorioMock.metas.some(m => m.id === meta3.id)).toBe(true)
  })
})
