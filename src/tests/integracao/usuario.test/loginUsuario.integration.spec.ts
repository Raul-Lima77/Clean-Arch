import { LoginUsuario } from "../../../aplicacao/usecase/usuario/LoginUsuario"
import { UsuarioRepositorioMysql } from "../../../infra/bd/mysql/UsuarioRepositorioMysql"
import { criarUsuario } from "../../setup/seed"

describe("Integração - LoginUsuario", () => {
  test("deve fazer login com sucesso quando as credenciais forem válidas", async () => {
    const email = `login${Date.now()}@email.com`
    const senha = "senha12345"

    const usuarioId = await criarUsuario("Maria Alice", email, senha)

    const usecase = new LoginUsuario(
      new UsuarioRepositorioMysql()
    )

    const resultado = await usecase.execute({
      email,
      senha,
    })

    expect(resultado.id).toBe(usuarioId)
    expect(resultado.nome).toBe("Maria Alice")
    expect(resultado.email).toBe(email)
    expect(resultado.saldo).toBe(0)
  })

  test("não deve fazer login com e-mail inexistente", async () => {
    const usecase = new LoginUsuario(
      new UsuarioRepositorioMysql()
    )

    await expect(
      usecase.execute({
        email: `inexistente${Date.now()}@email.com`,
        senha: "senha12345",
      })
    ).rejects.toThrow("Credenciais inválidas")
  })

  test("não deve fazer login com senha incorreta", async () => {
    const email = `senhaerrada${Date.now()}@email.com`

    await criarUsuario("Maria Alice", email, "senhaCorreta123")

    const usecase = new LoginUsuario(
      new UsuarioRepositorioMysql()
    )

    await expect(
      usecase.execute({
        email,
        senha: "senhaErrada123",
      })
    ).rejects.toThrow("Credenciais inválidas")
  })
})