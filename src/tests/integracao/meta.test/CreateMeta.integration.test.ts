import { CreateMeta } from "../../../aplicacao/usecase/meta/CreateMeta";
import { MetaRepositorioMysql } from "../../../infra/bd/mysql/MetaRepositorioMysql";
import { criarUsuario } from "../../setup/seed";

describe("Integração - CreateMeta", () => {

  test("deve criar uma meta com sucesso", async () => {

    const usuarioId = await criarUsuario();

    const usecase = new CreateMeta(
      new MetaRepositorioMysql()
    );

    const output = await usecase.execute({
      descricao: "Comprar PC",
      valorAlvo: 5000,
      dataInicio: new Date(),
      dataFim: new Date("2026-12-31"),
      usuarioId
    });

    expect(output.id).toBeDefined();

  });

});