import type { TransacaoRepositorio } from "../../../dominio/repositorios/TransacaoRepositorio"
import type { UsuarioRepositorio } from "../../../dominio/repositorios/UsuarioRepositorio"
import type { DeleteTransacaoDTO } from "../../dto/transacao/DeleteTransacaoDTO"
import type { UseCase } from "../UseCase"

export class DeleteTransacao implements UseCase<DeleteTransacaoDTO, boolean> {
  constructor(
    private readonly transacaoRepositorio: TransacaoRepositorio,
    private readonly usuarioRepositorio: UsuarioRepositorio,
  ) {}

  public async execute(inputDto: DeleteTransacaoDTO): Promise<boolean> {
    const transacao = await this.transacaoRepositorio.buscarPorId(inputDto.id)

    if (!transacao) {
      throw new Error("Transação não encontrada")
    }

    if (transacao.usuarioId !== inputDto.usuarioId) {
      throw new Error("Apenas o dono da transação pode excluí-la")
    }

    const usuario = await this.usuarioRepositorio.buscarPorId(inputDto.usuarioId)
    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    // Reverter valor do saldo
    const valorAjuste = transacao.tipo === "RECEITA" ? -transacao.valor : transacao.valor
    usuario.atualizarSaldo(valorAjuste)
    await this.usuarioRepositorio.atualizar(usuario)

    return await this.transacaoRepositorio.remover(inputDto.id)
  }
}
