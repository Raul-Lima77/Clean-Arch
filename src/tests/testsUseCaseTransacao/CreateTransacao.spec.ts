import { CreateTransacao } from "../../aplicacao/usecase/transacao/CreateTransacao"
import { TransacaoRepositorioMock } from "./TransacaoRepositorioMock"
import { UsuarioRepositorioMock } from "../testsUseCaseUsuario/UsuarioRepositorioMock"
import { Usuario } from "../../dominio/entidades/Usuario"

describe("Caso de Uso - CreateTransacao", () => {
  let transacaoRepositorioMock: TransacaoRepositorioMock
  let usuarioRepositorioMock: UsuarioRepositorioMock
  let sut: CreateTransacao

  beforeEach(() => {
    transacaoRepositorioMock = new TransacaoRepositorioMock()
    usuarioRepositorioMock = new UsuarioRepositorioMock()
    sut = new CreateTransacao(transacaoRepositorioMock, usuarioRepositorioMock)
  })

  it("deve criar uma transação de receita com sucesso", async () => {
    const usuario = Usuario.create("João", "joao@email.com", "senha123")
    await usuarioRepositorioMock.salvar(usuario)

    const inputDto = {
      tipo: "RECEITA" as const,
      descricao: "Salário",
      valor: 3000,
      data: new Date(),
      usuarioId: usuario.id,
      categoriaId: "categoria-123"
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toHaveProperty("id")
    expect(resultado).toHaveProperty("novoSaldo")
    expect(resultado.novoSaldo).toBe(3000)
    expect(transacaoRepositorioMock.transacoes.length).toBe(1)
  })

  it("deve criar uma transação de despesa com sucesso", async () => {
    const usuario = Usuario.create("Maria", "maria@email.com", "senha123")
    usuario.atualizarSaldo(5000)
    await usuarioRepositorioMock.salvar(usuario)

    const inputDto = {
      tipo: "DESPESA" as const,
      descricao: "Supermercado",
      valor: 200,
      data: new Date(),
      usuarioId: usuario.id,
      categoriaId: "categoria-456"
    }

    const resultado = await sut.execute(inputDto)

    expect(resultado).toHaveProperty("id")
    expect(resultado.novoSaldo).toBe(4800)
    expect(transacaoRepositorioMock.transacoes.length).toBe(1)
  })

  it("deve lançar um erro se o usuário não existir", async () => {
    const inputDto = {
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
    await usuarioRepositorioMock.salvar(usuario)

    const inputDto = {
      tipo: "RECEITA" as const,
      descricao: "Bônus",
      valor: 1500,
      data: new Date(),
      usuarioId: usuario.id,
      categoriaId: "categoria-789"
    }

    await sut.execute(inputDto)

    const usuarioAtualizado = await usuarioRepositorioMock.buscarPorId(usuario.id)
    expect(usuarioAtualizado?.saldo).toBe(1500)
  })
})
