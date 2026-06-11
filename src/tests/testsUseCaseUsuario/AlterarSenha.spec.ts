import { AlterarSenha } from "../../aplicacao/usecase/usuario/AlterarSenha"
import { Usuario } from "../../dominio/entidades/Usuario"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"

jest.mock("../../infra/bd/mysql/UsuarioRepositorioMysql")

describe("Caso de Uso - AlterarSenha", () => {
  let repositorioMock: jest.Mocked<UsuarioRepositorioMysql>
  let sut: AlterarSenha

  beforeEach(() => {
  
    repositorioMock = new UsuarioRepositorioMysql() as jest.Mocked<UsuarioRepositorioMysql>
    sut = new AlterarSenha(repositorioMock)
  })

  
  it("deve alterar a senha com sucesso quando os dados forem válidos", async () => {

    const usuarioExistente = Usuario.create("Maria Alice", "alice@email.com", "senhaAntiga123")

    repositorioMock.buscarPorId.mockResolvedValueOnce(usuarioExistente)
    repositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto = {
      usuarioId: usuarioExistente.id,
      senhaAtual: "senhaAntiga123",
      novaSenha: "novaSenhaSuperSegura"
    }

    await sut.execute(inputDto)

    expect(repositorioMock.atualizar).toHaveBeenCalledTimes(1)
    
    expect(repositorioMock.atualizar).toHaveBeenCalledWith(
      expect.objectContaining({
        senha: "novaSenhaSuperSegura"
      })
    )
  })

  


  it("deve lançar um erro se o ID do usuário não existir", async () => {
   
    repositorioMock.buscarPorId.mockResolvedValueOnce(null)

    const inputDto = {
      usuarioId: "id-invalido",
      senhaAtual: "qualquerUma",
      novaSenha: "novaSenha123"
    }

    
    await expect(sut.execute(inputDto)).rejects.toThrow("Usuário não encontrado")
    expect(repositorioMock.atualizar).not.toHaveBeenCalled()
  })

  

  it("deve lançar um erro se a senha atual estiver incorreta", async () => {
    
    const usuarioExistente = Usuario.create("Maria Alice", "alice@email.com", "senhaCorreta123")
    
    repositorioMock.buscarPorId.mockResolvedValueOnce(usuarioExistente)

    const inputDto = {
      usuarioId: usuarioExistente.id,
      senhaAtual: "senhaErrada123", 
      novaSenha: "novaSenha123"
    }

    
    await expect(sut.execute(inputDto)).rejects.toThrow("Senha atual incorreta")
    
    expect(repositorioMock.atualizar).not.toHaveBeenCalled()
    
  })
})