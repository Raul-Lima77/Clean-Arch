import { ListTransacao } from "../../aplicacao/usecase/transacao/ListTransacao"
import type { ListTransacaoDTO } from "../../aplicacao/dto/transacao/ListTransacaoDTO"
import { TransacaoRepositorioMock } from "./TransacaoRepositorioMock"
import { Transacao } from "../../dominio/entidades/Transacao"

describe("Caso de Uso - ListTransacao", () => {
  let repositorioMock: TransacaoRepositorioMock
  let sut: ListTransacao

  beforeEach(() => {
    repositorioMock = new TransacaoRepositorioMock()
    sut = new ListTransacao(repositorioMock)
  })

  it("deve listar todas as transações de um usuário com sucesso", async () => {
    const data = new Date()

    const transacao1 = Transacao.create("RECEITA", "Salário", 3000, data, "usuario-123", "categoria-1")
    const transacao2 = Transacao.create("DESPESA", "Aluguel", 1500, data, "usuario-123", "categoria-2")
    const transacao3 = Transacao.create("RECEITA", "Freelance", 500, data, "usuario-123", "categoria-3")

    await repositorioMock.salvar(transacao1)
    await repositorioMock.salvar(transacao2)
    await repositorioMock.salvar(transacao3)

    const resultado: ListTransacaoDTO[] = await sut.execute({ usuarioId: "usuario-123" })

    expect(resultado).toHaveLength(3)
    expect(resultado[0].tipo).toBe("RECEITA")
    expect(resultado[1].tipo).toBe("DESPESA")
    expect(resultado[2].tipo).toBe("RECEITA")
  })

  it("deve retornar apenas as transações do usuário específico", async () => {
    const data = new Date()

    const transacao1 = Transacao.create("RECEITA", "Salário", 3000, data, "usuario-123", "categoria-1")
    const transacao2 = Transacao.create("DESPESA", "Aluguel", 1500, data, "usuario-456", "categoria-2")
    const transacao3 = Transacao.create("RECEITA", "Bônus", 500, data, "usuario-123", "categoria-3")

    await repositorioMock.salvar(transacao1)
    await repositorioMock.salvar(transacao2)
    await repositorioMock.salvar(transacao3)

    const resultado: ListTransacaoDTO[] = await sut.execute({ usuarioId: "usuario-123" })

    expect(resultado).toHaveLength(2)
    expect(resultado.every(t => t.id === transacao1.id || t.id === transacao3.id)).toBe(true)
  })

  it("deve retornar um array vazio se o usuário não tiver transações", async () => {
    const resultado: ListTransacaoDTO[] = await sut.execute({ usuarioId: "usuario-sem-transacoes" })

    expect(resultado).toHaveLength(0)
    expect(Array.isArray(resultado)).toBe(true)
  })

  it("deve retornar todas as propriedades da transação no DTO", async () => {
    const data = new Date()

    const transacao = Transacao.create("RECEITA", "Salário", 3000, data, "usuario-123", "categoria-1")
    await repositorioMock.salvar(transacao)

    const resultado: ListTransacaoDTO[] = await sut.execute({ usuarioId: "usuario-123" })

    expect(resultado[0]).toHaveProperty("id")
    expect(resultado[0]).toHaveProperty("tipo")
    expect(resultado[0]).toHaveProperty("descricao")
    expect(resultado[0]).toHaveProperty("valor")
    expect(resultado[0]).toHaveProperty("data")
    expect(resultado[0]).toHaveProperty("categoriaId")
  })
})
