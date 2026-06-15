import crypto from "crypto";
import conexao from "../../infra/bd/mysql/MysqlConexao";

export async function criarUsuario(
  nome = "Raul",
  email = `raul${Date.now()}@gmail.com`,
  senha = "12345678"
) {
  const id = crypto.randomUUID();

  await conexao.query(
    `INSERT INTO usuarios
    (id, nome, email, senha, saldo, data_criacao)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [id, nome, email, senha, 0, new Date()]
  );

  return id;
}

export async function criarCategoria(
  usuarioId: string,
  nome = "Alimentação"
) {
  const id = crypto.randomUUID();

  await conexao.query(
    `INSERT INTO categorias
    (id, nome, limite_gasto, usuario_id)
    VALUES (?, ?, ?, ?)`,
    [id, nome, 1000, usuarioId]
  );

  return id;
}

export async function criarMeta(
  usuarioId: string
) {
  const id = crypto.randomUUID();

  await conexao.query(
    `INSERT INTO metas
    (id, descricao, valor_alvo, valor_atual,
     data_inicio, data_fim, usuario_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      "Meta Teste",
      5000,
      0,
      new Date(),
      new Date(Date.now() + 86400000),
      usuarioId
    ]
  );

  return id;
}

export async function criarTransacao(
  usuarioId: string,
  categoriaId: string
) {
  const id = crypto.randomUUID();

  await conexao.query(
    `INSERT INTO transacoes
    (id, tipo, descricao, valor,
     data, usuario_id, categoria_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      "DESPESA",
      "Mercado",
      100,
      new Date(),
      usuarioId,
      categoriaId
    ]
  );

  return id;
}


// Raul Lima