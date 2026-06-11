import { CreateTransacao } from "../../aplicacao/usecase/transacao/CreateTransacao"
import type { CreateTransacaoInputDTO } from "../../aplicacao/dto/transacao/CreateTransacaoInputDTO"
import type { CreateTransacaoOutputDTO } from "../../aplicacao/dto/transacao/CreateTransacaoOutputDTO"
import { Usuario } from "../../dominio/entidades/Usuario"
import { TransacaoRepositorioMysql } from "../../infra/bd/mysql/TransacaoRepositorioMysql"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"

jest.mock("../../infra/bd/mysql/TransacaoRepositorioMysql")
jest.mock("../../infra/bd/mysql/UsuarioRepositorioMysql")

describe("Caso de Uso - CreateTransacao", () => {
  let transacaoRepositorioMock: jest.Mocked<TransacaoRepositorioMysql>
  let usuarioRepositorioMock: jest.Mocked<UsuarioRepositorioMysql>
  let sut: CreateTransacao

  beforeEach(() => {
    transacaoRepositorioMock = new TransacaoRepositorioMysql() as jest.Mocked<TransacaoRepositorioMysql>
    usuarioRepositorioMock = new UsuarioRepositorioMysql() as jest.Mocked<UsuarioRepositorioMysql>
    sut = new CreateTransacao(transacaoRepositorioMock, usuarioRepositorioMock)
  })

  it("deve criar uma transação de receita com sucesso", async () => {
    const usuario = Usuario.create("João", "joao@email.com", "senha123")

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(usuario)
    transacaoRepositorioMock.salvar.mockResolvedValueOnce(undefined)
    usuarioRepositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto: CreateTransacaoInputDTO = {
      tipo: "RECEITA" as const,
      descricao: "Salário",
      valor: 3000,
      data: new Date(),
      usuarioId: usuario.id,
      categoriaId: "categoria-123"
    }

    const resultado: CreateTransacaoOutputDTO = await sut.execute(inputDto)

    expect(resultado).toHaveProperty("id")
    expect(resultado).toHaveProperty("novoSaldo")
    expect(resultado.novoSaldo).toBe(3000)
    expect(transacaoRepositorioMock.salvar).toHaveBeenCalledTimes(1)
  })

  it("deve criar uma transação de despesa com sucesso", async () => {
    const usuario = Usuario.create("Maria", "maria@email.com", "senha123")
    usuario.atualizarSaldo(5000)

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(usuario)
    transacaoRepositorioMock.salvar.mockResolvedValueOnce(undefined)
    usuarioRepositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto: CreateTransacaoInputDTO = {
      tipo: "DESPESA" as const,
      descricao: "Supermercado",
      valor: 200,
      data: new Date(),
      usuarioId: usuario.id,
      categoriaId: "categoria-456"
    }

    const resultado: CreateTransacaoOutputDTO = await sut.execute(inputDto)

    expect(resultado).toHaveProperty("id")
    expect(resultado.novoSaldo).toBe(4800)
    expect(transacaoRepositorioMock.salvar).toHaveBeenCalledTimes(1)
  })

  it("deve lançar um erro se o usuário não existir", async () => {
    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(null)

    const inputDto: CreateTransacaoInputDTO = {
      tipo: "RECEITA" as const,
      descricao: "Transação",
      valor: 100,
      data: new Date(),
      usuarioId: "usuario-inexistente",
      categoriaId: "categoria-123"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Usuário não encontrado")
  })

  it("deve atualizar o saldo do usuário após criar a transação", async () => {
    const usuario = Usuario.create("Pedro", "pedro@email.com", "senha123")

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(usuario)
    transacaoRepositorioMock.salvar.mockResolvedValueOnce(undefined)
    usuarioRepositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto: CreateTransacaoInputDTO = {
      tipo: "RECEITA" as const,
      descricao: "Bônus",
      valor: 1500,
      data: new Date(),
      usuarioId: usuario.id,
      categoriaId: "categoria-789"
    }

    await sut.execute(inputDto)

    expect(usuarioRepositorioMock.atualizar).toHaveBeenCalledWith(expect.objectContaining({ saldo: 1500 }))
  })
})
