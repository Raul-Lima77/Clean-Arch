import { CreateMeta } from "../../aplicacao/usecase/meta/CreateMeta"
import { MetaRepositorioMock } from "./MetaRepositorioMock"

describe("Caso de Uso - CreateMeta", () => {
  let repositorioMock: MetaRepositorioMock
  let sut: CreateMeta

  beforeEach(() => {
    repositorioMock = new MetaRepositorioMock()
    sut = new CreateMeta(repositorioMock)
  })

  it("deve criar uma meta com sucesso quando os dados forem válidos", async () => {
    const dataInicio = new Date("2024-01-01")
    const dataFim = new Date("2024-12-31")

    const inputDto = {
      descricao: "Economizar para viagem",
      valorAlvo: 5000,
      dataInicio,
      dataFim,
      usuarioId: "usuario-123"
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toHaveProperty("id")
    expect(repositorioMock.metas.length).toBe(1)
    expect(repositorioMock.metas[0].descricao).toBe("Economizar para viagem")
    expect(repositorioMock.metas[0].valorAlvo).toBe(5000)
  })

  it("deve criar múltiplas metas para o mesmo usuário", async () => {
    const dataInicio = new Date("2024-01-01")
    const dataFim = new Date("2024-12-31")

    const inputDto1 = {
      descricao: "Meta 1",
      valorAlvo: 1000,
      dataInicio,
      dataFim,
      usuarioId: "usuario-123"
    }

    const inputDto2 = {
      descricao: "Meta 2",
      valorAlvo: 2000,
      dataInicio,
      dataFim,
      usuarioId: "usuario-123"
    }

    await sut.execute(inputDto1)
    const resultado = await sut.execute(inputDto2)

    expect(resultado).toHaveProperty("id")
    expect(repositorioMock.metas.length).toBe(2)
  })

  it("deve criar metas com a mesma descrição para usuários diferentes", async () => {
    const dataInicio = new Date("2024-01-01")
    const dataFim = new Date("2024-12-31")

    const inputDto1 = {
      descricao: "Economizar",
      valorAlvo: 1000,
      dataInicio,
      dataFim,
      usuarioId: "usuario-1"
    }

    const inputDto2 = {
      descricao: "Economizar",
      valorAlvo: 2000,
      dataInicio,
      dataFim,
      usuarioId: "usuario-2"
    }

    const resultado1 = await sut.execute(inputDto1)
    const resultado2 = await sut.execute(inputDto2)

    expect(resultado1).toHaveProperty("id")
    expect(resultado2).toHaveProperty("id")
    expect(repositorioMock.metas.length).toBe(2)
  })
})
