import { LoginUsuario } from "../../aplicacao/usecase/usuario/LoginUsuario"
import type { LoginUsuarioInputDTO } from "../../aplicacao/dto/usuario/LoginUsuarioInputDTO"
import type { LoginUsuarioOutputDTO } from "../../aplicacao/dto/usuario/LoginUsuarioOutputDTO"
import { Usuario } from "../../dominio/entidades/Usuario"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"

// 1. MÁGICA DO JEST: Desliga a conexão real do MySQL
jest.mock("../../infra/bd/mysql/UsuarioRepositorioMysql")

describe("Caso de Uso - LoginUsuario", () => {
  let repositorioMock: jest.Mocked<UsuarioRepositorioMysql>
  let sut: LoginUsuario

  beforeEach(() => {
    // 2. Instancia a classe como um espião nativo do Jest
    repositorioMock = 
      new UsuarioRepositorioMysql() as jest.Mocked<UsuarioRepositorioMysql>
    sut = new LoginUsuario(repositorioMock) 
  })

  // CENÁRIO 1: Login com sucesso
  it("deve fazer login com sucesso quando as credenciais forem válidas", async () => {
    // Fabricamos o usuário que simula já estar cadastrado no banco real
    const usuarioCadastrado = Usuario.create("Maria Alice", "alice@email.com", "senhaSegura123")
    
    // ENSINANDO O MOCK: Quando o login buscar por esse e-mail, devolva o nosso usuário cadastrado
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(usuarioCadastrado)

    const inputDto: LoginUsuarioInputDTO = {
      email: "alice@email.com",
      senha: "senhaSegura123"
    }

    // Executa a ação do Caso de Uso
    const resultado: LoginUsuarioOutputDTO = await sut.execute(inputDto)

    // VERIFICAÇÕES COMPORTAMENTAIS E DE RETORNO:
    // Garante que o Caso de Uso de fato consultou o banco de dados 1 vez usando o e-mail enviado
    expect(repositorioMock.buscarPorEmail).toHaveBeenCalledTimes(1)
    expect(repositorioMock.buscarPorEmail).toHaveBeenCalledWith("alice@email.com")

    // Garante que o Caso de Uso retornou as propriedades corretas para a tela de login
    expect(resultado).toHaveProperty("id")
    expect(resultado.nome).toBe("Maria Alice")
    expect(resultado.email).toBe("alice@email.com")
  })

  // CENÁRIO 2: E-mail não encontrado
  it("deve lançar um erro se o e-mail não estiver cadastrado", async () => {
    // ENSINANDO O MOCK: Retorna null simulando que o e-mail não existe na tabela do banco
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(null)

    const inputDto: LoginUsuarioInputDTO = {
      email: "inexistente@email.com",
      senha: "senhaQualquer"
    }

    // O Jest escuta o erro no porão. Nota de segurança: o sistema joga "Credenciais inválidas" por privacidade
    await expect(sut.execute(inputDto)).rejects.toThrow("Credenciais inválidas")
  })

  // CENÁRIO 3: Senha incorreta
  it("deve lançar um erro se a senha estiver incorreta", async () => {
    // Fabricamos o usuário com a senha correta "senhaSegura123"
    const usuarioCadastrado = Usuario.create("Maria Alice", "alice@email.com", "senhaSegura123")
    
    // ENSINANDO O MOCK: O banco encontra o usuário normalmente pelo e-mail
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(usuarioCadastrado)

    const inputDto: LoginUsuarioInputDTO = {
      email: "alice@email.com",
      senha: "senhaErrada123" // Errando a senha de propósito
    }

    // O Jest valida se o sistema barrou a senha errada com a mensagem genérica de segurança
    await expect(sut.execute(inputDto)).rejects.toThrow("Credenciais inválidas")
  })
})