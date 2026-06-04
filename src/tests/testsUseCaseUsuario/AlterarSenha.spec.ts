import { AlterarSenha } from "../../aplicacao/usecase/usuario/AlterarSenha"
import { Usuario } from "../../dominio/entidades/Usuario"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"

// 1. MÁGICA DO JEST: Desliga o SQL real da classe do banco
jest.mock("../../infra/bd/mysql/UsuarioRepositorioMysql")

describe("Caso de Uso - AlterarSenha", () => {
  let repositorioMock: jest.Mocked<UsuarioRepositorioMysql>
  let sut: AlterarSenha

  beforeEach(() => {
    // 2. Cria o espião nativo do Jest
    repositorioMock = 
      new UsuarioRepositorioMysql() as jest.Mocked<UsuarioRepositorioMysql>
    sut = new AlterarSenha(repositorioMock)
  })

  // CENÁRIO 1: Sucesso
  it("deve alterar a senha com sucesso quando os dados forem válidos", async () => {
    // Fabricamos o usuário com a senha antiga
    const usuarioExistente = Usuario.create("Maria Alice", "alice@email.com", "senhaAntiga123")

    // ENSINANDO O MOCK:
    // Quando buscar pelo ID, o Mock finge que achou o nosso usuário
    repositorioMock.buscarPorId.mockResolvedValueOnce(usuarioExistente)
    // A função de atualizar vai rodar e dar sucesso (retorna void/undefined)
    repositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto = {
      usuarioId: usuarioExistente.id,
      senhaAtual: "senhaAntiga123",
      novaSenha: "novaSenhaSuperSegura"
    }

    // Executa a alteração
    await sut.execute(inputDto)

    // VERIFICAÇÕES COMPORTAMENTAIS:
    // Garante que o caso de uso chamou a função atualizar exatamente 1 vez
    expect(repositorioMock.atualizar).toHaveBeenCalledTimes(1)
    
    // Garante que a função atualizar recebeu o usuário contendo a NOVA senha criptografada/alterada
    expect(repositorioMock.atualizar).toHaveBeenCalledWith(
      expect.objectContaining({
        senha: "novaSenhaSuperSegura"
      })
    )
  })

  // CENÁRIO 2: ID não existe
  it("deve lançar um erro se o ID do usuário não existir", async () => {
    // ENSINANDO O MOCK: Retorna null porque não achou ninguém com esse ID
    repositorioMock.buscarPorId.mockResolvedValueOnce(null)

    const inputDto = {
      usuarioId: "id-invalido",
      senhaAtual: "qualquerUma",
      novaSenha: "novaSenha123"
    }

    // O Jest valida se o sistema barrou o ID falso
    await expect(sut.execute(inputDto)).rejects.toThrow("Usuário não encontrado")
    
    // Prova real: Se o ID não existe, o método atualizar NUNCA foi chamado
    expect(repositorioMock.atualizar).not.toHaveBeenCalled()
  })

  // CENÁRIO 3: Senha atual errada
  it("deve lançar um erro se a senha atual estiver incorreta", async () => {
    // Fabricamos o usuário cuja senha real cadastrada é "senhaCorreta123"
    const usuarioExistente = Usuario.create("Maria Alice", "alice@email.com", "senhaCorreta123")
    
    // ENSINANDO O MOCK: O sistema busca e acha o usuário normal
    repositorioMock.buscarPorId.mockResolvedValueOnce(usuarioExistente)

    const inputDto = {
      usuarioId: usuarioExistente.id,
      senhaAtual: "senhaErrada123", // Tentando errar a senha atual de propósito
      novaSenha: "novaSenha123"
    }

    // O Jest valida se o sistema barrou a senha incorreta
    await expect(sut.execute(inputDto)).rejects.toThrow("Senha atual incorreta")
    
    // Prova real do professor: Como a senha atual estava errada, o método atualizar NUNCA foi invocado!
    expect(repositorioMock.atualizar).not.toHaveBeenCalled()
  })
})