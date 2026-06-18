import conexao from "../../infra/bd/mysql/MysqlConexao";
import "reflect-metadata";

beforeAll(async () => {
  await conexao.query("DELETE FROM transacoes");
  await conexao.query("DELETE FROM metas");
  await conexao.query("DELETE FROM categorias");
  await conexao.query("DELETE FROM usuarios");
});

beforeEach(async () => {
  await conexao.query("DELETE FROM transacoes");
  await conexao.query("DELETE FROM metas");
  await conexao.query("DELETE FROM categorias");
  await conexao.query("DELETE FROM usuarios");
});

afterAll(async () => {
  await conexao.end();
});