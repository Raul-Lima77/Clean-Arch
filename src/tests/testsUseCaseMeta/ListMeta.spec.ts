import { ListMeta } from "../../../src/aplicacao/usecase/meta/ListMeta"
import type { ListMetaDTO } from "../../../src/aplicacao/dto/meta/ListMetaDTO"
import { Meta } from "../../../src/dominio/entidades/Meta"
import { MetaRepositorioMysql } from "../../../src/infra/bd/mysql/MetaRepositorioMysql"

jest.mock("../../../src/infra/bd/mysql/MetaRepositorioMysql")

describe("Caso de Uso - ListMeta", () => {
  let metaRepositorioMock: jest.Mocked<MetaRepositorioMysql>
  let listMeta: ListMeta

  beforeEach(() => {
    metaRepositorioMock =
      new MetaRepositorioMysql() as jest.Mocked<MetaRepositorioMysql>

    listMeta = new ListMeta(metaRepositorioMock)
  })

  it("deve listar as metas de um usuário", async () => {
    const metas = [
      Meta.create("Notebook", 5000, new Date("2026-01-01"), new Date("2026-12-31"), "usuario-1"),
      Meta.create("Moto", 12000, new Date("2026-01-01"), new Date("2026-12-31"), "usuario-1")
    ]

    metaRepositorioMock.listarPorUsuario.mockResolvedValueOnce(metas)

    const metasListadas: ListMetaDTO[] = metas.map((meta) => {
      const {id, descricao, valorAlvo, valorAtual, dataInicio, dataFim} = meta

      return { id, descricao, valorAlvo, valorAtual, progresso: meta.calcularProgresso(), dataInicio, dataFim}
    })

    const resultado: ListMetaDTO[] =
      await listMeta.execute({
        usuarioId: "usuario-1",
      })

    expect(metaRepositorioMock.listarPorUsuario)
      .toHaveBeenCalledTimes(1)

    expect(metaRepositorioMock.listarPorUsuario)
      .toHaveBeenCalledWith("usuario-1")

    expect(resultado).toEqual(metasListadas)
  })

  it("deve retornar uma lista vazia quando não existirem metas", async () => {
    metaRepositorioMock.listarPorUsuario.mockResolvedValueOnce([])

    const resultado: ListMetaDTO[] =
      await listMeta.execute({
        usuarioId: "usuario-1",
      })

    expect(metaRepositorioMock.listarPorUsuario)
      .toHaveBeenCalledTimes(1)

    expect(resultado).toEqual([])
  })
})