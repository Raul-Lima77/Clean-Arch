import type { TransacaoRepositorio } from "../../../dominio/repositorios/TransacaoRepositorio"
import type { UsuarioRepositorio } from "../../../dominio/repositorios/UsuarioRepositorio"
import type { EditarTransacaoInputDTO } from "../../dto/transacao/EditarTransacaoInputDTO"
import type { UseCase } from "../UseCase"

export class EditarTransacao implements UseCase<EditarTransacaoInputDTO, void> {
  constructor(
    private readonly transacaoRepositorio: TransacaoRepositorio,
    private readonly usuarioRepositorio: UsuarioRepositorio,
  ) {}

  public async execute(inputDto: EditarTransacaoInputDTO): Promise<void> {
    const transacao = await this.transacaoRepositorio.buscarPorId(inputDto.id)

    if (!transacao) {
      throw new Error("Transação não encontrada")
    }

    if (transacao.usuarioId !== inputDto.usuarioId) {
      throw new Error("Apenas o dono da transação pode editá-la")
    }

    const usuario = await this.usuarioRepositorio.buscarPorId(inputDto.usuarioId)
    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    // Reverter valor antigo do saldo
    const valorAntigoAjuste = transacao.tipo === "RECEITA" ? -transacao.valor : transacao.valor
    usuario.atualizarSaldo(valorAntigoAjuste)

    // Editar transação
    transacao.editar(inputDto.descricao, inputDto.valor, inputDto.data, inputDto.categoriaId)
    await this.transacaoRepositorio.atualizar(transacao)

    // Aplicar novo valor ao saldo
    const novoValorAjuste = transacao.tipo === "RECEITA" ? transacao.valor : -transacao.valor
    usuario.atualizarSaldo(novoValorAjuste)
    await this.usuarioRepositorio.atualizar(usuario)
  }
}
