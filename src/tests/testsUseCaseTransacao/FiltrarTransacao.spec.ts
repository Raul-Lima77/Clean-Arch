import { FiltrarTransacao } from "../../aplicacao/usecase/transacao/FiltrarTransacao"
import { TransacaoRepositorioMock } from "./TransacaoRepositorioMock"
import { Transacao } from "../../dominio/entidades/Transacao"

describe("Caso de Uso - FiltrarTransacao", () => {
  let repositorioMock: TransacaoRepositorioMock
  let sut: FiltrarTransacao

  beforeEach(() => {
    repositorioMock = new TransacaoRepositorioMock()
    sut = new FiltrarTransacao(repositorioMock)
  })

  it("deve filtrar transações por período com sucesso", async () => {
    const dataInicio = new Date("2024-01-01")
    const dataFim = new Date("2024-01-31")

    const transacao1 = Transacao.create("RECEITA", "Salário", 3000, new Date("2024-01-15"), "usuario-123", "categoria-1")
    const transacao2 = Transacao.create("DESPESA", "Aluguel", 1500, new Date("2024-02-15"), "usuario-123", "categoria-2")

    await repositorioMock.salvar(transacao1)
    await repositorioMock.salvar(transacao2)

    const inputDto = {
      usuarioId: "usuario-123",
      dataInicio,
      dataFim
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toHaveLength(1)
    expect(resultado[0].id).toBe(transacao1.id)
  })

  it("deve filtrar transações por categoria com sucesso", async () => {
    const data = new Date()

    const transacao1 = Transacao.create("RECEITA", "Salário", 3000, data, "usuario-123", "categoria-1")
    const transacao2 = Transacao.create("DESPESA", "Aluguel", 1500, data, "usuario-123", "categoria-2")
    const transacao3 = Transacao.create("DESPESA", "Comida", 200, data, "usuario-123", "categoria-1")

    await repositorioMock.salvar(transacao1)
    await repositorioMock.salvar(transacao2)
    await repositorioMock.salvar(transacao3)

    const inputDto = {
      usuarioId: "usuario-123",
      categoriaId: "categoria-1"
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toHaveLength(2)
    expect(resultado.every(t => t.categoriaId === "categoria-1")).toBe(true)
  })

  it("deve retornar todas as transações quando nenhum filtro específico for fornecido", async () => {
    const data = new Date()

    const transacao1 = Transacao.create("RECEITA", "Salário", 3000, data, "usuario-123", "categoria-1")
    const transacao2 = Transacao.create("DESPESA", "Aluguel", 1500, data, "usuario-123", "categoria-2")

    await repositorioMock.salvar(transacao1)
    await repositorioMock.salvar(transacao2)

    const inputDto = {
      usuarioId: "usuario-123"
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toHaveLength(2)
  })

  it("deve lançar um erro se a data inicial for posterior à data final", async () => {
    const dataInicio = new Date("2024-12-31")
    const dataFim = new Date("2024-01-01")

    const inputDto = {
      usuarioId: "usuario-123",
      dataInicio,
      dataFim
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Data inicial deve ser anterior à data final")
  })

  it("deve retornar um array vazio se não houver transações no período", async () => {
    const dataInicio = new Date("2024-01-01")
    const dataFim = new Date("2024-01-31")

    const transacao = Transacao.create("RECEITA", "Salário", 3000, new Date("2024-12-15"), "usuario-123", "categoria-1")
    await repositorioMock.salvar(transacao)

    const inputDto = {
      usuarioId: "usuario-123",
      dataInicio,
      dataFim
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toHaveLength(0)
  })
})
