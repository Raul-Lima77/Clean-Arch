import { AlterarSenha } from "../../aplicacao/usecase/usuario/AlterarSenha"
import { UsuarioRepositorioMock } from "./UsuarioRepositorioMock"
import { Usuario } from "../../dominio/entidades/Usuario"

describe("Caso de Uso - AlterarSenha", () => {
  let repositorioMock: UsuarioRepositorioMock
  let sut: AlterarSenha

  beforeEach(() => {
    repositorioMock = new UsuarioRepositorioMock()
    sut = new AlterarSenha(repositorioMock)
  })

  // CENÁRIO 1: Sucesso
  it("deve alterar a senha com sucesso quando os dados forem válidos", async () => {
    // 1. Cadastramos um usuário com uma senha inicial
    const usuario = Usuario.create("Maria Alice", "alice@email.com", "senhaAntiga123")
    await repositorioMock.salvar(usuario)

    // 2. Preparamos os dados para trocar a senha
    const inputDto = {
      usuarioId: usuario.id,
      senhaAtual: "senhaAntiga123",
      novaSenha: "novaSenhaSuperSegura"
    }

    // 3. Executamos
    await sut.execute(inputDto)

    // Verificação: Buscamos no banco falso para ver se a senha mudou de verdade
    const usuarioAtualizado = await repositorioMock.buscarPorId(usuario.id)
    expect(usuarioAtualizado?.senha).toBe("novaSenhaSuperSegura")
  })

  // CENÁRIO 2: Usuário não encontrado
  it("deve lançar um erro se o ID do usuário não existir", async () => {
    const inputDto = {
      usuarioId: "id-invalido",
      senhaAtual: "qualquerUma",
      novaSenha: "novaSenha123"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Usuário não encontrado")
  })

  // CENÁRIO 3: Senha atual incorreta
  it("deve lançar um erro se a senha atual estiver incorreta", async () => {
    // 1. Cadastramos o usuário
    const usuario = Usuario.create("Maria Alice", "alice@email.com", "senhaCorreta123")
    await repositorioMock.salvar(usuario)

    // 2. Tentamos alterar errando a senha atual
    const inputDto = {
      usuarioId: usuario.id,
      senhaAtual: "senhaErrada123", // Não bate com a do cadastro
      novaSenha: "novaSenha123"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Senha atual incorreta")
    
    // Garante que a senha NÃO mudou no banco falso
    const usuarioNaoAlterado = await repositorioMock.buscarPorId(usuario.id)
    expect(usuarioNaoAlterado?.senha).toBe("senhaCorreta123")
  })
})