import { LoginUsuario } from "../../aplicacao/usecase/usuario/LoginUsuario"
import { UsuarioRepositorioMock } from "./UsuarioRepositorioMock"
import { Usuario } from "../../dominio/entidades/Usuario"

describe("Caso de Uso - LoginUsuario", () => {
  let repositorioMock: UsuarioRepositorioMock
  let sut: LoginUsuario

  beforeEach(() => {
    repositorioMock = new UsuarioRepositorioMock()
    sut = new LoginUsuario(repositorioMock) // Injeta o mesmo mock de antes!
  })

  // CENÁRIO 1: Sucesso
  it("deve fazer login com sucesso quando as credenciais forem válidas", async () => {
    // 1. Criamos um usuário válido usando a Entidade
    const usuarioCadastrado = Usuario.create("Maria Alice", "alice@email.com", "senhaSegura123")
    
    // 2. Colocamos ele direto na nossa lista em memória (banco falso)
    await repositorioMock.salvar(usuarioCadastrado)

    // 3. Tentamos fazer o login com os mesmos dados
    const inputDto = {
      email: "alice@email.com",
      senha: "senhaSegura123"
    }

    const resultado = await sut.execute(inputDto)

    // Verificações
    expect(resultado).toHaveProperty("id")
    expect(resultado.nome).toBe("Maria Alice")
    expect(resultado.email).toBe("alice@email.com")
  })

  // CENÁRIO 2: E-mail não existe
  it("deve lançar um erro se o e-mail não estiver cadastrado", async () => {
    const inputDto = {
      email: "inexistente@email.com",
      senha: "senhaQualquer"
    }

    // O banco falso está totalmente vazio, então o e-mail não vai ser achado
    await expect(sut.execute(inputDto)).rejects.toThrow("Credenciais inválidas")
  })

  // CENÁRIO 3: Senha incorreta
  it("deve lançar um erro se a senha estiver incorreta", async () => {
    // 1. Cadastramos o usuário no banco falso
    const usuarioCadastrado = Usuario.create("Maria Alice", "alice@email.com", "senhaSegura123")
    await repositorioMock.salvar(usuarioCadastrado)

    // 2. Tentamos logar com o e-mail certo, mas a SENHA ERRADA
    const inputDto = {
      email: "alice@email.com",
      senha: "senhaErrada123"
    }

    await expect(sut.execute(inputDto)).rejects.toThrow("Credenciais inválidas")
  })
})