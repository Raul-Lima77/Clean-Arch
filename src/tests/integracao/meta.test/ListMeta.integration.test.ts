import { ListMeta } from "../../../aplicacao/usecase/meta/ListMeta";
import { MetaRepositorioMysql } from "../../../infra/bd/mysql/MetaRepositorioMysql";
import { criarMeta, criarUsuario } from "../../setup/seed";

describe("Integração - ListMeta", () => {

  test("deve listar as metas do usuário", async () => {

    const usuarioId = await criarUsuario();

    await criarMeta(usuarioId);
    await criarMeta(usuarioId);

    const usecase = new ListMeta(
      new MetaRepositorioMysql()
    );

    const resultado = await usecase.execute({
      usuarioId
    });

    expect(resultado.length).toBe(2);

  });

});