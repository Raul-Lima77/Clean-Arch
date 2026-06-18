import { CreateUsuario } from "../../../aplicacao/usecase/usuario/CreateUsuario"
import { UsuarioRepositorioMysql } from "../../../infra/bd/mysql/UsuarioRepositorioMysql"

describe("Integração - CreateUsuario", () => {
  test("deve criar um usuário com sucesso", async () => {
    const repositorio = new UsuarioRepositorioMysql()
    const usecase = new CreateUsuario(repositorio)

    const email = `alice${Date.now()}@email.com`

    const output = await usecase.execute({
      nome: "Maria Alice",
      email,
      senha: "senha12345",
    })

    expect(output.id).toBeDefined()

    const usuarioSalvo = await repositorio.buscarPorEmail(email)

    expect(usuarioSalvo).not.toBeNull()
    expect(usuarioSalvo?.id).toBe(output.id)
    expect(usuarioSalvo?.nome).toBe("Maria Alice")
    expect(usuarioSalvo?.email).toBe(email)
  })

  test("não deve permitir e-mail já cadastrado", async () => {
    const repositorio = new UsuarioRepositorioMysql()
    const usecase = new CreateUsuario(repositorio)

    const email = `duplicado${Date.now()}@email.com`

    await usecase.execute({
      nome: "Maria Alice",
      email,
      senha: "senha12345",
    })

    await expect(
      usecase.execute({
        nome: "Outra Pessoa",
        email,
        senha: "outrasenha123",
      })
    ).rejects.toThrow("E-mail já cadastrado")
  })
})