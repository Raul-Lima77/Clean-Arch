import { CreateUsuario } from "../../aplicacao/usecase/usuario/CreateUsuario"
import { UsuarioRepositorioMock } from "../testsUseCaseUsuario/UsuarioRepositorioMock" // import do mock acima

describe("Caso de Uso - CreateUsuario", () => {
  let repositorioMock: UsuarioRepositorioMock
  let sut: CreateUsuario // SUT significa "System Under Test" (o que estamos testando de verdade)

  // Essa função roda antes de CADA teste para garantir que o banco de mentira comece limpo
  beforeEach(() => {
    repositorioMock = new UsuarioRepositorioMock()
    sut = new CreateUsuario(repositorioMock) // Injetamos o mock no construtor!
  })

  // CENÁRIO 1: O caminho feliz
  it("deve cadastrar um usuário com sucesso quando os dados forem válidos", async () => {
    // Dados de entrada simulando o DTO que viria do Controller
    const inputDto = {
      nome: "Maria Alice",
      email: "alice@email.com",
      senha: "senhaSegura123"
    }

    // Executa a ação do Caso de Uso
    const resultado = await sut.execute(inputDto)

    // Verificações (Expectativas)
    expect(resultado).toHaveProperty("id") // Garante que retornou o ID no OutputDTO
    expect(repositorioMock.usuarios.length).toBe(1) // Garante que salvou 1 usuário no banco falso
    expect(repositorioMock.usuarios[0].email).toBe("alice@email.com") // Garante que o email gravado está certo
  })

  // CENÁRIO 2: O erro de e-mail duplicado
  it("deve lançar um erro se o e-mail já estiver cadastrado no sistema", async () => {
    // 1. Vamos preparar o banco de mentira colocando um usuário lá dentro primeiro
    const inputDto = {
      nome: "Maria Alice",
      email: "duplicado@email.com",
      senha: "senhaSegura123"
    }
    
    // Cadastra a primeira vez com sucesso
    await sut.execute(inputDto)

    // 2. Tenta cadastrar um segundo usuário com o MESMO e-mail
    const inputDtoDuplicado = {
      nome: "Outro Nome",
      email: "duplicado@email.com",
      senha: "outraSenha123"
    }

    // O teste espera que essa execução falhe e jogue exatamente a mensagem de erro do código
    await expect(sut.execute(inputDtoDuplicado)).rejects.toThrow("E-mail já cadastrado")
    
    // Garante que o segundo usuário NÃO foi salvo (a lista continua contendo apenas o primeiro)
    expect(repositorioMock.usuarios.length).toBe(1)
  })
})