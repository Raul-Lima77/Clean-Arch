import { DeleteTransacao } from "../../aplicacao/usecase/transacao/DeleteTransacao"
import { TransacaoRepositorioMock } from "./TransacaoRepositorioMock"
import { UsuarioRepositorioMock } from "../testsUseCaseUsuario/UsuarioRepositorioMock"
import { Transacao } from "../../dominio/entidades/Transacao"
import { Usuario } from "../../dominio/entidades/Usuario"

describe("Caso de Uso - DeleteTransacao", () => {
  let transacaoRepositorioMock: TransacaoRepositorioMock
  let usuarioRepositorioMock: UsuarioRepositorioMock
  let sut: DeleteTransacao

  beforeEach(() => {
    transacaoRepositorioMock = new TransacaoRepositorioMock()
    usuarioRepositorioMock = new UsuarioRepositorioMock()
    sut = new DeleteTransacao(transacaoRepositorioMock, usuarioRepositorioMock)
  })

  it("deve deletar uma transação de receita com sucesso", async () => {
    const usuario = Usuario.create("João", "joao@email.com", "senha123")
    usuario.atualizarSaldo(3000)
    await usuarioRepositorioMock.salvar(usuario)

    const transacao = Transacao.create("RECEITA", "Salário", 3000, new Date(), usuario.id, "categoria-1")
    await transacaoRepositorioMock.salvar(transacao)

    const inputDto = {
      id: transacao.id,
      usuarioId: usuario.id
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toBe(true)
    expect(transacaoRepositorioMock.transacoes.length).toBe(0)
  })

  it("deve deletar uma transação de despesa e reverter o saldo", async () => {
    const usuario = Usuario.create("Maria", "maria@email.com", "senha123")
    usuario.atualizarSaldo(5000)
    await usuarioRepositorioMock.salvar(usuario)

    const transacao = Transacao.create("DESPESA", "Supermercado", 200, new Date(), usuario.id, "categoria-2")
    await transacaoRepositorioMock.salvar(transacao)

    const inputDto = {
      id: transacao.id,
      usuarioId: usuario.id
    }

    await sut.execute(inputDto)

    const usuarioAtualizado = await usuarioRepositorioMock.buscarPorId(usuario.id)
    expect(usuarioAtualizado?.saldo).toBe(5200)
  })

  it("deve lançar um erro se a transação não existir", async () => {
    const usuario = Usuario.create("Pedro", "pedro@email.com", "senha123")
    await usuarioRepositorioMock.salvar(usuario)

    const inputDto = {
      id: "id-inexistente",
      usuarioId: usuario.id
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Transação não encontrada")
  })

  it("deve lançar um erro se o usuário não for o dono da transação", async () => {
    const usuario1 = Usuario.create("João", "joao@email.com", "senha123")
    const usuario2 = Usuario.create("Maria", "maria@email.com", "senha123")
    await usuarioRepositorioMock.salvar(usuario1)
    await usuarioRepositorioMock.salvar(usuario2)

    const transacao = Transacao.create("RECEITA", "Salário", 3000, new Date(), usuario1.id, "categoria-1")
    await transacaoRepositorioMock.salvar(transacao)

    const inputDto = {
      id: transacao.id,
      usuarioId: usuario2.id
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Apenas o dono da transação pode excluí-la")
  })

  it("deve lançar um erro se o usuário não existir", async () => {
    const transacao = Transacao.create("RECEITA", "Salário", 3000, new Date(), "usuario-inexistente", "categoria-1")
    await transacaoRepositorioMock.salvar(transacao)

    const inputDto = {
      id: transacao.id,
      usuarioId: "usuario-inexistente"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Usuário não encontrado")
  })
})
