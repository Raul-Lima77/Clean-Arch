import { DeleteTransacao } from "../../aplicacao/usecase/transacao/DeleteTransacao"
import type { DeleteTransacaoDTO } from "../../aplicacao/dto/transacao/DeleteTransacaoDTO"
import { TransacaoRepositorioMysql } from "../../infra/bd/mysql/TransacaoRepositorioMysql"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"
import { Transacao } from "../../dominio/entidades/Transacao"
import { Usuario } from "../../dominio/entidades/Usuario"

jest.mock("../../infra/bd/mysql/TransacaoRepositorioMysql")
jest.mock("../../infra/bd/mysql/UsuarioRepositorioMysql")

describe("Caso de Uso - DeleteTransacao", () => {
  let transacaoRepositorioMock: jest.Mocked<TransacaoRepositorioMysql>
  let usuarioRepositorioMock: jest.Mocked<UsuarioRepositorioMysql>
  let sut: DeleteTransacao

  beforeEach(() => {
    transacaoRepositorioMock = new TransacaoRepositorioMysql() as jest.Mocked<TransacaoRepositorioMysql>
    usuarioRepositorioMock = new UsuarioRepositorioMysql() as jest.Mocked<UsuarioRepositorioMysql>
    sut = new DeleteTransacao(transacaoRepositorioMock, usuarioRepositorioMock)
  })

  it("deve deletar uma transação de receita com sucesso", async () => {
    const usuario = Usuario.create("João", "joao@email.com", "senha123")
    usuario.atualizarSaldo(3000)

    const transacao = Transacao.create("RECEITA", "Salário", 3000, new Date(), usuario.id, "categoria-1")

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(usuario)
    transacaoRepositorioMock.buscarPorId.mockResolvedValueOnce(transacao)
    transacaoRepositorioMock.remover.mockResolvedValueOnce(true)
    usuarioRepositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto: DeleteTransacaoDTO = {
      id: transacao.id,
      usuarioId: usuario.id
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toBe(true)
    expect(transacaoRepositorioMock.remover).toHaveBeenCalledWith(transacao.id)
  })

  it("deve deletar uma transação de despesa e reverter o saldo", async () => {
    const usuario = Usuario.create("Maria", "maria@email.com", "senha123")
    usuario.atualizarSaldo(5000)

    const transacao = Transacao.create("DESPESA", "Supermercado", 200, new Date(), usuario.id, "categoria-2")

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(usuario)
    transacaoRepositorioMock.buscarPorId.mockResolvedValueOnce(transacao)
    transacaoRepositorioMock.remover.mockResolvedValueOnce(true)
    usuarioRepositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto: DeleteTransacaoDTO = {
      id: transacao.id,
      usuarioId: usuario.id
    }

    await sut.execute(inputDto)

    expect(transacaoRepositorioMock.remover).toHaveBeenCalledTimes(1)
    expect(usuarioRepositorioMock.atualizar).toHaveBeenCalledTimes(1)
  })

  it("deve lançar um erro se a transação não existir", async () => {
    const usuario = Usuario.create("Pedro", "pedro@email.com", "senha123")

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(usuario)
    transacaoRepositorioMock.buscarPorId.mockResolvedValueOnce(null)

    const inputDto: DeleteTransacaoDTO = {
      id: "id-inexistente",
      usuarioId: usuario.id
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Transação não encontrada")
  })

  it("deve lançar um erro se o usuário não for o dono da transação", async () => {
    const usuario1 = Usuario.create("João", "joao@email.com", "senha123")
    const usuario2 = Usuario.create("Maria", "maria@email.com", "senha123")

    const transacao = Transacao.create("RECEITA", "Salário", 3000, new Date(), usuario1.id, "categoria-1")

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(usuario2)
    transacaoRepositorioMock.buscarPorId.mockResolvedValueOnce(transacao)

    const inputDto: DeleteTransacaoDTO = {
      id: transacao.id,
      usuarioId: usuario2.id
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Apenas o dono da transação pode excluí-la")
  })

  it("deve lançar um erro se o usuário não existir", async () => {
    const transacao = Transacao.create("RECEITA", "Salário", 3000, new Date(), "usuario-inexistente", "categoria-1")

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(null)

    const inputDto: DeleteTransacaoDTO = {
      id: transacao.id,
      usuarioId: "usuario-inexistente"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Usuário não encontrado")
  })
})
