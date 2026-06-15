import conexao from "../../infra/bd/mysql/MysqlConexao";
import "reflect-metadata";

beforeAll(async () => {
  await conexao.query("DELETE FROM despesas");
  await conexao.query("DELETE FROM receitas");
  await conexao.query("DELETE FROM categorias");
  await conexao.query("DELETE FROM usuarios");
});

beforeEach(async () => {
  await conexao.query("DELETE FROM despesas");
  await conexao.query("DELETE FROM receitas");
});

afterAll(async () => {
  await conexao.end();
});