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

  it("deve alterar a senha com sucesso quando os dados forem válidos", async () => {
   
    const usuario = Usuario.create("Maria Alice", "alice@email.com", "senhaAntiga123")
    await repositorioMock.salvar(usuario)

    
    const inputDto = {
      usuarioId: usuario.id,
      senhaAtual: "senhaAntiga123",
      novaSenha: "novaSenhaSuperSegura"
    }

    await sut.execute(inputDto)

    const usuarioAtualizado = await repositorioMock.buscarPorId(usuario.id)
    expect(usuarioAtualizado?.senha).toBe("novaSenhaSuperSegura")
  })

  it("deve lançar um erro se o ID do usuário não existir", async () => {
    const inputDto = {
      usuarioId: "id-invalido",
      senhaAtual: "qualquerUma",
      novaSenha: "novaSenha123"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Usuário não encontrado")
  })

  it("deve lançar um erro se a senha atual estiver incorreta", async () => {
    
    const usuario = Usuario.create("Maria Alice", "alice@email.com", "senhaCorreta123")
    await repositorioMock.salvar(usuario)

    
    const inputDto = {
      usuarioId: usuario.id,
      senhaAtual: "senhaErrada123", 
      novaSenha: "novaSenha123"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Senha atual incorreta")
    
    
    const usuarioNaoAlterado = await repositorioMock.buscarPorId(usuario.id)
    expect(usuarioNaoAlterado?.senha).toBe("senhaCorreta123")
  })
})