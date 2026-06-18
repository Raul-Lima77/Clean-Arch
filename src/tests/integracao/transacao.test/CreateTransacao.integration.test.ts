import { CreateTransacao } from "../../../aplicacao/usecase/transacao/CreateTransacao";
import { TransacaoRepositorioMysql } from "../../../infra/bd/mysql/TransacaoRepositorioMysql";
import { UsuarioRepositorioMysql } from "../../../infra/bd/mysql/UsuarioRepositorioMysql";
import { criarUsuario, criarCategoria , limparBanco, criarTransacao } from "../../setup/seed";

describe("Integração - Criar Transação", () => {


    let usuarioRepositorio: UsuarioRepositorioMysql
    let transacaoRepositorio: TransacaoRepositorioMysql
    let usecase: CreateTransacao

    beforeEach(async () => {
        await limparBanco()

        usuarioRepositorio = new UsuarioRepositorioMysql()
        transacaoRepositorio = new TransacaoRepositorioMysql()

        usecase = new CreateTransacao(
        transacaoRepositorio,
        usuarioRepositorio
        )
    })

    test("deve criar uma transação de receita e atualizar o saldo do usuário", async () => {
        
        const usuarioId = await criarUsuario()
        const categoriaId = await criarCategoria(usuarioId)

        const input = await criarTransacao(usuarioId,categoriaId)

        const output = await usecase.execute(input)

        expect(output.id).toBeDefined()
        expect(output.novoSaldo).toBe(100)

        const transacao = await transacaoRepositorio.buscarPorId(output.id)

        expect(transacao).not.toBeNull()
        expect(transacao?.descricao).toBe("Mercado")
        expect(transacao?.valor).toBe(100)
        expect(transacao?.tipo).toBe("DESPESA")
        expect(transacao?.usuarioId).toBe(usuarioId)
        expect(transacao?.categoriaId).toBe(categoriaId)

        const usuarioAtualizado = await usuarioRepositorio.buscarPorId(usuarioId);

        expect(usuarioAtualizado).not.toBeNull();
        expect(usuarioAtualizado?.saldo).toBe(5000);


        test("deve lançar erro quando o usuário não existir", async () => {

            const input = await criarTransacao('usuario-inexistente','categoria-inexistente')


            await expect(usecase.execute(input)).rejects.toThrow(
            "Usuário não encontrado"
            );
        });
  });







    
})