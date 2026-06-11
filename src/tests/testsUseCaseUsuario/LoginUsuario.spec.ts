import { LoginUsuario } from "../../aplicacao/usecase/usuario/LoginUsuario"
import type { LoginUsuarioInputDTO } from "../../aplicacao/dto/usuario/LoginUsuarioInputDTO"
import type { LoginUsuarioOutputDTO } from "../../aplicacao/dto/usuario/LoginUsuarioOutputDTO"
import { Usuario } from "../../dominio/entidades/Usuario"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"

jest.mock("../../infra/bd/mysql/UsuarioRepositorioMysql")

describe("Caso de Uso - LoginUsuario", () => {
  let repositorioMock: jest.Mocked<UsuarioRepositorioMysql>
  let sut: LoginUsuario

  beforeEach(() => {
    repositorioMock = new UsuarioRepositorioMysql() as jest.Mocked<UsuarioRepositorioMysql>
    sut = new LoginUsuario(repositorioMock) 
  })


  it("deve fazer login com sucesso quando as credenciais forem válidas", async () => {
    
    const usuarioCadastrado = Usuario.create("Maria Alice", "alice@email.com", "senhaSegura123")
    
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(usuarioCadastrado)

    const inputDto: LoginUsuarioInputDTO = {
      email: "alice@email.com",
      senha: "senhaSegura123"
    }

    
    const resultado: LoginUsuarioOutputDTO = await sut.execute(inputDto)

    expect(repositorioMock.buscarPorEmail).toHaveBeenCalledTimes(1)
    expect(repositorioMock.buscarPorEmail).toHaveBeenCalledWith("alice@email.com")

    expect(resultado).toHaveProperty("id")
    expect(resultado.nome).toBe("Maria Alice")
    expect(resultado.email).toBe("alice@email.com")
  })

  it("deve lançar um erro se o e-mail não estiver cadastrado", async () => {
    
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(null)

    const inputDto: LoginUsuarioInputDTO = {
      email: "inexistente@email.com",
      senha: "senhaQualquer"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Credenciais inválidas")
  })

  
  it("deve lançar um erro se a senha estiver incorreta", async () => {
    const usuarioCadastrado = Usuario.create("Maria Alice", "alice@email.com", "senhaSegura123")
    
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(usuarioCadastrado)

    const inputDto: LoginUsuarioInputDTO = {
      email: "alice@email.com",
      senha: "senhaErrada123" 
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Credenciais inválidas")
  })
})