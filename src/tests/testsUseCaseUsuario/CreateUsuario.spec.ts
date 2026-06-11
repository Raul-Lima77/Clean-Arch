import { CreateUsuario } from "../../aplicacao/usecase/usuario/CreateUsuario"
import type { CreateUsuarioInputDTO } from "../../aplicacao/dto/usuario/CreateUsuarioInputDTO"
import type { CreateUsuarioOutputDTO } from "../../aplicacao/dto/usuario/CreateUsuarioOutputDTO"
import { Usuario } from "../../dominio/entidades/Usuario"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"

jest.mock("../../infra/bd/mysql/UsuarioRepositorioMysql")

describe("Caso de Uso - CreateUsuario", () => {
  let repositorioMock: jest.Mocked<UsuarioRepositorioMysql>
  let sut: CreateUsuario 
  
  beforeEach(() => {

    repositorioMock = new UsuarioRepositorioMysql() as jest.Mocked<UsuarioRepositorioMysql>
    sut = new CreateUsuario(repositorioMock) 
  })

 
  it("deve cadastrar um usuário com sucesso quando os dados forem válidos", async () => {

    repositorioMock.buscarPorEmail.mockResolvedValueOnce(null)
    repositorioMock.salvar.mockResolvedValueOnce(undefined)

    const inputDto: CreateUsuarioInputDTO = {
      nome: "Maria Alice",
      email: "alice@email.com",
      senha: "senhaSegura123"
    }
    
    const resultado: CreateUsuarioOutputDTO = await sut.execute(inputDto)

    expect(repositorioMock.salvar).toHaveBeenCalledTimes(1) 
    
    expect(repositorioMock.salvar).toHaveBeenCalledWith(
      expect.any(Usuario)
    ) 

    expect(typeof resultado.id).toBe("string") 
  })

  


  it("deve lançar um erro se o e-mail já estiver cadastrado no sistema", async () => {

    const usuarioExistente = Usuario.create("Outro Nome", "duplicado@email.com", "outraSenha123")
    
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(usuarioExistente)

    const inputDtoDuplicado: CreateUsuarioInputDTO = {
      nome: "Maria Alice",
      email: "duplicado@email.com",
      senha: "senhaSegura123"
    }

    
    await expect(sut.execute(inputDtoDuplicado)).rejects.toThrow("E-mail já cadastrado")
  
    expect(repositorioMock.salvar).not.toHaveBeenCalled()
  })
})