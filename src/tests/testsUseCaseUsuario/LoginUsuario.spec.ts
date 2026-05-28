import { LoginUsuario } from "../../aplicacao/usecase/usuario/LoginUsuario"
import { UsuarioRepositorioMock } from "./UsuarioRepositorioMock"
import { Usuario } from "../../dominio/entidades/Usuario"

describe("Caso de Uso - LoginUsuario", () => {
  let repositorioMock: UsuarioRepositorioMock
  let sut: LoginUsuario

  beforeEach(() => {
    repositorioMock = new UsuarioRepositorioMock()
    sut = new LoginUsuario(repositorioMock) 
  })

  
  it("deve fazer login com sucesso quando as credenciais forem válidas", async () => {
    
    const usuarioCadastrado = Usuario.create("Maria Alice", "alice@email.com", "senhaSegura123")
    
    await repositorioMock.salvar(usuarioCadastrado)

    
    const inputDto = {
      email: "alice@email.com",
      senha: "senhaSegura123"
    }

    const resultado = await sut.execute(inputDto)

    
    expect(resultado).toHaveProperty("id")
    expect(resultado.nome).toBe("Maria Alice")
    expect(resultado.email).toBe("alice@email.com")
  })

  it("deve lançar um erro se o e-mail não estiver cadastrado", async () => {
    const inputDto = {
      email: "inexistente@email.com",
      senha: "senhaQualquer"
    }

   
    await expect(sut.execute(inputDto)).rejects.toThrow("Credenciais inválidas")
  })

  
  it("deve lançar um erro se a senha estiver incorreta", async () => {
    
    const usuarioCadastrado = Usuario.create("Maria Alice", "alice@email.com", "senhaSegura123")
    await repositorioMock.salvar(usuarioCadastrado)

    
    const inputDto = {
      email: "alice@email.com",
      senha: "senhaErrada123"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Credenciais inválidas")
  })
})