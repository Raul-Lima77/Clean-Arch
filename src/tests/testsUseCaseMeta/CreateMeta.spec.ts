import { CreateMeta } from "../../../src/aplicacao/usecase/meta/CreateMeta"
import type { CreateMetaInputDTO } from "../../../src/aplicacao/dto/meta/CreateMetaInputDTO"
import type { CreateMetaOutputDTO } from "../../../src/aplicacao/dto/meta/CreateMetaOutputDTO"
import { Meta } from "../../../src/dominio/entidades/Meta"
import { MetaRepositorioMysql } from "../../../src/infra/bd/mysql/MetaRepositorioMysql"

jest.mock("../../../src/infra/bd/mysql/MetaRepositorioMysql")

describe("Caso de Uso - CreateMeta", () => {
  let metaRepositorioMock: jest.Mocked<MetaRepositorioMysql>
  let createMeta: CreateMeta

  beforeEach(() => {
    metaRepositorioMock =
      new MetaRepositorioMysql() as jest.Mocked<MetaRepositorioMysql>

    createMeta = new CreateMeta(metaRepositorioMock)
  })

  it("deve criar uma meta corretamente", async () => {
    metaRepositorioMock.salvar.mockResolvedValueOnce(undefined)

    const input: CreateMetaInputDTO = {
      descricao: "Comprar notebook",
      valorAlvo: 5000,
      dataInicio: new Date("2026-01-01"),
      dataFim: new Date("2026-12-31"),
      usuarioId: "usuario-1",
    }

    const resultado: CreateMetaOutputDTO =
      await createMeta.execute(input)

    expect(metaRepositorioMock.salvar).toHaveBeenCalledTimes(1)

    expect(metaRepositorioMock.salvar).toHaveBeenCalledWith(
      expect.any(Meta)
    )

    expect(typeof resultado.id).toBe("string")
  })
})