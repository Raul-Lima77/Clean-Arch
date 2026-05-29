import { CreateUsuario } from "../../aplicacao/usecase/usuario/CreateUsuario"
import type { CreateUsuarioInputDTO } from "../../aplicacao/dto/usuario/CreateUsuarioInputDTO"
import type { CreateUsuarioOutputDTO } from "../../aplicacao/dto/usuario/CreateUsuarioOutputDTO"
import { UsuarioRepositorioMock } from "../testsUseCaseUsuario/UsuarioRepositorioMock" 

describe("Caso de Uso - CreateUsuario", () => {
  let repositorioMock: UsuarioRepositorioMock
  let sut: CreateUsuario 
  
  beforeEach(() => {
    repositorioMock = new UsuarioRepositorioMock()
    sut = new CreateUsuario(repositorioMock) 
  })

  
  it("deve cadastrar um usuário com sucesso quando os dados forem válidos", async () => {
    
    const inputDto: CreateUsuarioInputDTO = {
      nome: "Maria Alice",
      email: "alice@email.com",
      senha: "senhaSegura123"
    }

    
    const resultado: CreateUsuarioOutputDTO = await sut.execute(inputDto)

   
    expect(resultado).toHaveProperty("id") 
    expect(repositorioMock.usuarios.length).toBe(1) 
    expect(repositorioMock.usuarios[0].email).toBe("alice@email.com") 
  })

  
  it("deve lançar um erro se o e-mail já estiver cadastrado no sistema", async () => {

    const inputDto: CreateUsuarioInputDTO = {
      nome: "Maria Alice",
      email: "duplicado@email.com",
      senha: "senhaSegura123"
    }
    
    
    await sut.execute(inputDto)

    
    const inputDtoDuplicado: CreateUsuarioInputDTO = {
      nome: "Outro Nome",
      email: "duplicado@email.com",
      senha: "outraSenha123"
    }

    
    await expect(sut.execute(inputDtoDuplicado)).rejects.toThrow("E-mail já cadastrado")
    

    expect(repositorioMock.usuarios.length).toBe(1)
  })
})