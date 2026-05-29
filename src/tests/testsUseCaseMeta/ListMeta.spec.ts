import { ListMeta } from "../../aplicacao/usecase/meta/ListMeta"
import { MetaRepositorioMock } from "./MetaRepositorioMock"
import { Meta } from "../../dominio/entidades/Meta"

describe("Caso de Uso - ListMeta", () => {
  let repositorioMock: MetaRepositorioMock
  let sut: ListMeta

  beforeEach(() => {
    repositorioMock = new MetaRepositorioMock()
    sut = new ListMeta(repositorioMock)
  })

  it("deve listar todas as metas de um usuário com sucesso", async () => {
    const dataInicio = new Date("2024-01-01")
    const dataFim = new Date("2024-12-31")

    const meta1 = Meta.create("Meta 1", 1000, dataInicio, dataFim, "usuario-123")
    const meta2 = Meta.create("Meta 2", 2000, dataInicio, dataFim, "usuario-123")
    const meta3 = Meta.create("Meta 3", 3000, dataInicio, dataFim, "usuario-123")

    await repositorioMock.salvar(meta1)
    await repositorioMock.salvar(meta2)
    await repositorioMock.salvar(meta3)

    const resultado = await sut.execute({ usuarioId: "usuario-123" })

    expect(resultado).toHaveLength(3)
    expect(resultado[0].descricao).toBe("Meta 1")
    expect(resultado[1].descricao).toBe("Meta 2")
    expect(resultado[2].descricao).toBe("Meta 3")
  })

  it("deve retornar apenas as metas do usuário específico", async () => {
    const dataInicio = new Date("2024-01-01")
    const dataFim = new Date("2024-12-31")

    const meta1 = Meta.create("Meta 1", 1000, dataInicio, dataFim, "usuario-123")
    const meta2 = Meta.create("Meta 2", 2000, dataInicio, dataFim, "usuario-456")
    const meta3 = Meta.create("Meta 3", 3000, dataInicio, dataFim, "usuario-123")

    await repositorioMock.salvar(meta1)
    await repositorioMock.salvar(meta2)
    await repositorioMock.salvar(meta3)

    const resultado = await sut.execute({ usuarioId: "usuario-123" })

    expect(resultado).toHaveLength(2)
    expect(resultado.every(m => m.id === meta1.id || m.id === meta3.id)).toBe(true)
  })

  it("deve retornar um array vazio se o usuário não tiver metas", async () => {
    const resultado = await sut.execute({ usuarioId: "usuario-sem-metas" })

    expect(resultado).toHaveLength(0)
    expect(Array.isArray(resultado)).toBe(true)
  })

  it("deve retornar todas as propriedades da meta no DTO", async () => {
    const dataInicio = new Date("2024-01-01")
    const dataFim = new Date("2024-12-31")

    const meta = Meta.create("Economizar", 5000, dataInicio, dataFim, "usuario-123")
    await repositorioMock.salvar(meta)

    const resultado = await sut.execute({ usuarioId: "usuario-123" })

    expect(resultado[0]).toHaveProperty("id")
    expect(resultado[0]).toHaveProperty("descricao")
    expect(resultado[0]).toHaveProperty("valorAlvo")
    expect(resultado[0]).toHaveProperty("valorAtual")
    expect(resultado[0]).toHaveProperty("progresso")
    expect(resultado[0]).toHaveProperty("dataInicio")
    expect(resultado[0]).toHaveProperty("dataFim")
  })
})
