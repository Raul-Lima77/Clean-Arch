import { EditarPerfil } from "../../aplicacao/usecase/usuario/EditarPerfil"
import type { EditarPerfilInputDTO } from "../../aplicacao/dto/usuario/EditarPerfilInputDTO"
import { Usuario } from "../../dominio/entidades/Usuario"
import { UsuarioRepositorioMysql } from "../../infra/bd/mysql/UsuarioRepositorioMysql"

// 1. MÁGICA DO JEST: Desliga o SQL real da classe abaixo
jest.mock("../../infra/bd/mysql/UsuarioRepositorioMysql")

describe("Caso de Uso - EditarPerfil", () => {
  let repositorioMock: jest.Mocked<UsuarioRepositorioMysql>
  let sut: EditarPerfil

  beforeEach(() => {
    // 2. Instancia a classe como um espião do Jest
    repositorioMock = new UsuarioRepositorioMysql() as jest.Mocked<UsuarioRepositorioMysql>
    sut = new EditarPerfil(repositorioMock)
  })

  // CENÁRIO 1: O caminho feliz
  it("deve editar o perfil com sucesso quando os dados forem válidos", async () => {
    // Fabricamos o usuário que simula já estar cadastrado
    const usuarioExistente = Usuario.create("Maria Alice", "alice@email.com", "senhaSegura123")

    // ENSINANDO O MOCK: 
    // Quando buscar pelo ID, o Mock vai fingir que achou o usuarioExistente
    repositorioMock.buscarPorId.mockResolvedValueOnce(usuarioExistente)
    // Quando verificar se o e-mail novo está ocupado, o Mock retorna undefined (está livre!)
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(null)
    // A função de atualizar vai rodar e dar sucesso (retorna void/undefined)
    repositorioMock.atualizar.mockResolvedValueOnce(undefined)

    const inputDto: EditarPerfilInputDTO = {
      usuarioId: usuarioExistente.id,
      nome: "Alice Freitas", 
      email: "alice.freitas@email.com" 
    }

    // Executa a ação do Caso de Uso
    await sut.execute(inputDto)

    // VERIFICAÇÕES COMPORTAMENTAIS (O que o professor quer):
    // Garante que o caso de uso chamou a função atualizar exatamente 1 vez
    expect(repositorioMock.atualizar).toHaveBeenCalledTimes(1)
    
    // Garante que o método de atualizar recebeu o usuário com as novas alterações
    expect(repositorioMock.atualizar).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: "Alice Freitas",
        email: "alice.freitas@email.com"
      })
    )
  })

  // CENÁRIO 2: Usuário não encontrado
  it("deve lançar um erro se o ID do usuário não existir", async () => {
    // ENSINANDO O MOCK: Quando buscar pelo ID, o Mock retorna null (não achou ninguém!)
    repositorioMock.buscarPorId.mockResolvedValueOnce(null)

    const inputDto = {
      usuarioId: "id-qualquer-que-nao-existe",
      nome: "Nome Qualquer",
      email: "email@qualquer.com"
    }

    // O Jest escuta o erro no porão
    await expect(sut.execute(inputDto)).rejects.toThrow("Usuário não encontrado")
    
    // Prova real: Se o usuário não existe, o método atualizar NUNCA deve ser chamado
    expect(repositorioMock.atualizar).not.toHaveBeenCalled()
  })

  // CENÁRIO 3: E-mail já ocupado por outra pessoa
  it("deve lançar um erro se o novo e-mail já estiver cadastrado para outro usuário", async () => {
    // Dono atual do perfil que vai ser editado
    const usuarioA = Usuario.create("Usuario A", "usuario.a@email.com", "senhaSegura123")
    // Outro usuário que já é dono do e-mail que o A quer roubar
    const usuarioB = Usuario.create("Usuario B", "email.ocupado@email.com", "senhaSegura123")

    // ENSINANDO O MOCK:
    // Primeiro o Caso de Uso busca o usuário A pelo ID e encontra
    repositorioMock.buscarPorId.mockResolvedValueOnce(usuarioA)
    // Depois ele busca o e-mail novo e descobre que ele pertence ao usuário B
    repositorioMock.buscarPorEmail.mockResolvedValueOnce(usuarioB)

    const inputDto = {
      usuarioId: usuarioA.id,
      nome: "Usuario A Modificado",
      email: "email.ocupado@email.com" 
    }

    // O Jest valida se o sistema barrou a operação
    await expect(sut.execute(inputDto)).rejects.toThrow("E-mail já cadastrado")
    
    // Prova real: Se deu erro de e-mail ocupado, o método atualizar NUNCA deve ser chamado
    expect(repositorioMock.atualizar).not.toHaveBeenCalled()
  })
})