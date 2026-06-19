import request from "supertest"
import { app } from "./app"

describe("E2E - Usuários", () => {
  const senhaInicial = "senha12345"
  const senhaNova = "senha56789"

  it("deve cadastrar, logar, editar perfil e alterar senha", async () => {
    const email = `usuario.${Date.now()}@teste.com`

    const cadastroRes = await request(app)
      .post("/usuarios/cadastro")
      .send({ nome: "Usuário E2E", email, senha: senhaInicial })

    expect(cadastroRes.status).toBe(201)
    expect(cadastroRes.body.data).toBeDefined()
    const usuarioId = cadastroRes.body.data

    const loginRes = await request(app)
      .post("/usuarios/login")
      .send({ email, senha: senhaInicial })

    expect(loginRes.status).toBe(200)
    expect(loginRes.body.data).toBeDefined()
    expect(loginRes.body.data.email).toBe(email)

    const novoEmail = `usuario.edited.${Date.now()}@teste.com`
    const editarRes = await request(app)
      .put(`/usuarios/${usuarioId}`)
      .send({ nome: "Usuário Atualizado", email: novoEmail })

    expect(editarRes.status).toBe(200)
    expect(editarRes.body.message).toContain("Perfil atualizado")

    const alterarSenhaRes = await request(app)
      .put(`/usuarios/${usuarioId}/senha`)
      .send({ senhaAtual: senhaInicial, novaSenha: senhaNova })

    expect(alterarSenhaRes.status).toBe(200)
    expect(alterarSenhaRes.body.message).toContain("Senha alterada")

    const loginNovoSenhaRes = await request(app)
      .post("/usuarios/login")
      .send({ email: novoEmail, senha: senhaNova })

    expect(loginNovoSenhaRes.status).toBe(200)
    expect(loginNovoSenhaRes.body.data.email).toBe(novoEmail)
  })

  it("não deve autenticar com credenciais inválidas", async () => {
    const email = `usuario.falho.${Date.now()}@teste.com`

    await request(app)
      .post("/usuarios/cadastro")
      .send({ nome: "Usuário Falho", email, senha: senhaInicial })

    const loginFalho = await request(app)
      .post("/usuarios/login")
      .send({ email, senha: "senhaErrada" })

    expect(loginFalho.status).toBe(401)
    expect(loginFalho.body.error).toBeDefined()
  })
})
