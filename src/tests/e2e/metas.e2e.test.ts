import request from "supertest"
import { app } from "./app"

describe("E2E - Metas", () => {
  const usuarioEmail = `meta.usuario.${Date.now()}@teste.com`
  const usuarioSenha = "senhaMeta123"

  async function criarUsuario() {
    const cadastro = await request(app)
      .post("/usuarios/cadastro")
      .send({ nome: "Usuário Meta", email: usuarioEmail, senha: usuarioSenha })
    return cadastro.body.data
  }

  it("deve criar, listar e remover uma meta", async () => {
    const usuarioId = await criarUsuario()

    const criarRes = await request(app)
      .post("/metas")
      .send({
        descricao: "Economizar viagem",
        valorAlvo: 3000,
        dataInicio: new Date().toISOString(),
        dataFim: new Date(Date.now() + 86400000).toISOString(),
        usuarioId,
      })

    expect(criarRes.status).toBe(201)
    expect(criarRes.body.data).toBeDefined()
    const metaId = criarRes.body.data

    const listarRes = await request(app).get(`/metas/${usuarioId}`)
    expect(listarRes.status).toBe(200)
    expect(Array.isArray(listarRes.body)).toBe(true)
    expect(listarRes.body).toHaveLength(1)
    expect(listarRes.body[0].id).toBe(metaId)

    const removerRes = await request(app)
      .delete(`/metas/${metaId}`)
      .send({ usuarioId })

    expect(removerRes.status).toBe(200)
    expect(removerRes.body.data).toBe(true)

    const listarDepoisRes = await request(app).get(`/metas/${usuarioId}`)
    expect(listarDepoisRes.status).toBe(200)
    expect(Array.isArray(listarDepoisRes.body)).toBe(true)
    expect(listarDepoisRes.body).toHaveLength(0)
  })
})
