import { CreateUsuario } from "../../aplicacao/usecase/usuario/CreateUsuario"
import type { CreateUsuarioInputDTO } from "../../aplicacao/dto/usuario/CreateUsuarioInputDTO"
import type { CreateUsuarioOutputDTO } from "../../aplicacao/dto/usuario/CreateUsuarioOutputDTO"
import { Usuario } from "../../dominio/entidades/Usuario"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"

// 1. MÁGICA DO JEST: Substitui a classe real por um espião nativo do Jest
jest.mock("../../infra/bd/mysql/UsuarioRepositorioMysql")

describe("Caso de Uso - CreateUsuario", () => {
  let repositorioMock: jest.Mocked<UsuarioRepositorioMysql>
  let sut: CreateUsuario 
  
  beforeEach(() => {
    // 2. Transforma o repositório em um Mock Mockado pelo Jest
    repositorioMock = 
      new UsuarioRepositorioMysql() as jest.Mocked<UsuarioRepositorioMysql>
    
    sut = new CreateUsuario(repositorioMock) 
  })

  // CENÁRIO 1: O caminho feliz
  it("deve cadastrar um usuário com sucesso quando os dados forem válidos", async () => {
    // Ensinando o Mock: Como não tem e-mail repetido, buscarPorEmail deve retornar null
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(null)
    // Ensinando o Mock: A função salvar vai dar certo e não retorna nada (undefined)
    repositorioMock.salvar.mockResolvedValueOnce(undefined)

    const inputDto: CreateUsuarioInputDTO = {
      nome: "Maria Alice",
      email: "alice@email.com",
      senha: "senhaSegura123"
    }
    
    const resultado: CreateUsuarioOutputDTO = await sut.execute(inputDto)

    // VERIFICAÇÕES COMPORTAMENTAIS (O que o professor quer ver):
    // Garante que o caso de uso chamou a função de salvar 1 vez
    expect(repositorioMock.salvar).toHaveBeenCalledTimes(1) 
    
    // Garante que salvou passando um objeto da Entidade Usuario
    expect(repositorioMock.salvar).toHaveBeenCalledWith(
      expect.any(Usuario)
    ) 

    // Garante que o Caso de Uso devolveu o ID do usuário criado no final
    expect(typeof resultado.id).toBe("string") 
  })

  // CENÁRIO 2: O caminho do erro
  it("deve lançar um erro se o e-mail já estiver cadastrado no sistema", async () => {
    // Criamos um usuário fictício que a Entidade vai fingir que já achou no banco
    const usuarioExistente = Usuario.create("Outro Nome", "duplicado@email.com", "outraSenha123")
    
    // Ensinando o Mock: Quando o caso de uso buscar por esse email, o Mock VAI RETORNAR o usuário existente!
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(usuarioExistente)

    const inputDtoDuplicado: CreateUsuarioInputDTO = {
      nome: "Maria Alice",
      email: "duplicado@email.com",
      senha: "senhaSegura123"
    }

    // O Jest fica escutando o porão dos erros esperando a trava do e-mail duplicado
    await expect(sut.execute(inputDtoDuplicado)).rejects.toThrow("E-mail já cadastrado")
    
    // Prova real: Como deu erro de e-mail duplicado, o método salvar NUNCA deve ter sido chamado!
    expect(repositorioMock.salvar).not.toHaveBeenCalled()
  })
})