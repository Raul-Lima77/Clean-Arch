import { EditarTransacao } from "../../aplicacao/usecase/transacao/EditarTransacao"
import type { EditarTransacaoInputDTO } from "../../aplicacao/dto/transacao/EditarTransacaoInputDTO"
import { TransacaoRepositorioMysql } from "../../infra/bd/mysql/TransacaoRepositorioMysql"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"
import { Transacao } from "../../dominio/entidades/Transacao"
import { Usuario } from "../../dominio/entidades/Usuario"

jest.mock("../../infra/bd/mysql/TransacaoRepositorioMysql")
jest.mock("../../infra/bd/mysql/UsuarioRepositorioMysql")

describe("Caso de Uso - EditarTransacao", () => {
  let transacaoRepositorioMock: jest.Mocked<TransacaoRepositorioMysql>
  let usuarioRepositorioMock: jest.Mocked<UsuarioRepositorioMysql>
  let sut: EditarTransacao

  beforeEach(() => {
    transacaoRepositorioMock = new TransacaoRepositorioMysql() as jest.Mocked<TransacaoRepositorioMysql>
    usuarioRepositorioMock = new UsuarioRepositorioMysql() as jest.Mocked<UsuarioRepositorioMysql>
    sut = new EditarTransacao(transacaoRepositorioMock, usuarioRepositorioMock)
  })

  it("deve editar uma transação com sucesso quando os dados forem válidos", async () => {
    const usuario = Usuario.create("João", "joao@email.com", "senha123")
    usuario.atualizarSaldo(3000)

    const transacao = Transacao.create("RECEITA", "Salário", 3000, new Date(), usuario.id, "categoria-1")

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(usuario)
    transacaoRepositorioMock.buscarPorId.mockResolvedValueOnce(transacao)
    transacaoRepositorioMock.atualizar.mockResolvedValueOnce(undefined)
    usuarioRepositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto: EditarTransacaoInputDTO = {
      id: transacao.id,
      usuarioId: usuario.id,
      descricao: "Salário Atualizado",
      valor: 3500,
      categoriaId: "categoria-2"
    }

    await sut.execute(inputDto)

    expect(transacaoRepositorioMock.atualizar).toHaveBeenCalledTimes(1)
    expect(usuarioRepositorioMock.atualizar).toHaveBeenCalledTimes(1)
  })

  it("deve atualizar o saldo do usuário após editar uma receita", async () => {
    const usuario = Usuario.create("Maria", "maria@email.com", "senha123")
    usuario.atualizarSaldo(3000)

    const transacao = Transacao.create("RECEITA", "Salário", 3000, new Date(), usuario.id, "categoria-1")

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(usuario)
    transacaoRepositorioMock.buscarPorId.mockResolvedValueOnce(transacao)
    transacaoRepositorioMock.atualizar.mockResolvedValueOnce(undefined)
    usuarioRepositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto: EditarTransacaoInputDTO = {
      id: transacao.id,
      usuarioId: usuario.id,
      valor: 3500
    }

    await sut.execute(inputDto)

    expect(transacaoRepositorioMock.atualizar).toHaveBeenCalledTimes(1)
    expect(usuarioRepositorioMock.atualizar).toHaveBeenCalledTimes(1)
  })

  it("deve atualizar corretamente o saldo ao editar uma despesa", async () => {
    const usuario = Usuario.create("Pedro", "pedro@email.com", "senha123")
    usuario.atualizarSaldo(5000)

    const transacao = Transacao.create("DESPESA", "Aluguel", 1500, new Date(), usuario.id, "categoria-1")

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(usuario)
    transacaoRepositorioMock.buscarPorId.mockResolvedValueOnce(transacao)
    transacaoRepositorioMock.atualizar.mockResolvedValueOnce(undefined)
    usuarioRepositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto: EditarTransacaoInputDTO = {
      id: transacao.id,
      usuarioId: usuario.id,
      valor: 2000
    }

    await sut.execute(inputDto)

    expect(transacaoRepositorioMock.atualizar).toHaveBeenCalledTimes(1)
  })

  it("deve lançar um erro se a transação não existir", async () => {
    const usuario = Usuario.create("Ana", "ana@email.com", "senha123")

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(usuario)
    transacaoRepositorioMock.buscarPorId.mockResolvedValueOnce(null)

    const inputDto: EditarTransacaoInputDTO = {
      id: "id-inexistente",
      usuarioId: usuario.id,
      descricao: "Nova descrição"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Transação não encontrada")
  })

  it("deve lançar um erro se o usuário não for o dono da transação", async () => {
    const usuario1 = Usuario.create("João", "joao@email.com", "senha123")
    const usuario2 = Usuario.create("Maria", "maria@email.com", "senha123")

    const transacao = Transacao.create("RECEITA", "Salário", 3000, new Date(), usuario1.id, "categoria-1")

    usuarioRepositorioMock.buscarPorId.mockResolvedValueOnce(usuario2)
    transacaoRepositorioMock.buscarPorId.mockResolvedValueOnce(transacao)

    const inputDto: EditarTransacaoInputDTO = {
      id: transacao.id,
      usuarioId: usuario2.id,
      descricao: "Tentativa de edição"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Apenas o dono da transação pode editá-la")
  })

  it("deve lançar um erro se o usuário não existir", async () => {
    const transacao = Transacao.create("RECEITA", "Salário", 3000, new Date(), "usuario-inexistente", "categoria-1")
    await transacaoRepositorioMock.salvar(transacao)

    const inputDto: EditarTransacaoInputDTO = {
      id: transacao.id,
      usuarioId: "usuario-inexistente",
      descricao: "Nova descrição"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Usuário não encontrado")
  })

  it("deve manter a transação com valores originais quando nenhuma alteração for fornecida", async () => {
    const usuario = Usuario.create("Carlos", "carlos@email.com", "senha123")
    usuario.atualizarSaldo(2000)
    await usuarioRepositorioMock.salvar(usuario)

    const transacao = Transacao.create("RECEITA", "Bônus", 2000, new Date(), usuario.id, "categoria-1")
    await transacaoRepositorioMock.salvar(transacao)

    const inputDto = {
      id: transacao.id,
      usuarioId: usuario.id
    }

    await sut.execute(inputDto)

    const transacaoAtualizada = await transacaoRepositorioMock.buscarPorId(transacao.id)
    expect(transacaoAtualizada?.descricao).toBe("Bônus")
    expect(transacaoAtualizada?.valor).toBe(2000)
  })
})
