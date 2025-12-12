import { Transacao } from "../../../dominio/entidades/Transacao"
import type { TransacaoRepositorio } from "../../../dominio/repositorios/TransacaoRepositorio"
import type { UsuarioRepositorio } from "../../../dominio/repositorios/UsuarioRepositorio"
import type { CreateTransacaoInputDTO } from "../../dto/transacao/CreateTransacaoInputDTO"
import type { CreateTransacaoOutputDTO } from "../../dto/transacao/CreateTransacaoOutputDTO"
import type { UseCase } from "../UseCase"

export class CreateTransacao implements UseCase<CreateTransacaoInputDTO, CreateTransacaoOutputDTO> {
  constructor(
    private readonly transacaoRepositorio: TransacaoRepositorio,
    private readonly usuarioRepositorio: UsuarioRepositorio,
  ) {}

  public async execute(inputDto: CreateTransacaoInputDTO): Promise<CreateTransacaoOutputDTO> {
    const usuario = await this.usuarioRepositorio.buscarPorId(inputDto.usuarioId)

    if (!usuario) {
      throw new Error("Usuário não encontrado")
    }

    const transacao = Transacao.create(
      inputDto.tipo,
      inputDto.descricao,
      inputDto.valor,
      inputDto.data,
      inputDto.usuarioId,
      inputDto.categoriaId,
    )

    await this.transacaoRepositorio.salvar(transacao)

    // Atualizar saldo do usuário
    const valorAjuste = transacao.tipo === "RECEITA" ? transacao.valor : -transacao.valor
    usuario.atualizarSaldo(valorAjuste)
    await this.usuarioRepositorio.atualizar(usuario)

    const outputDTO: CreateTransacaoOutputDTO = {
      id: transacao.id,
      novoSaldo: usuario.saldo,
    }

    return outputDTO
  }
}
