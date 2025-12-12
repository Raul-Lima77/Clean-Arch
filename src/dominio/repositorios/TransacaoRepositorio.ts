import { Transacao } from "../entidades/Transacao"

export interface TransacaoRepositorio {
  buscarPorId(id: string): Promise<Transacao | null>
  listarPorUsuario(usuarioId: string): Promise<Transacao[]>
  filtrarPorPeriodo(usuarioId: string, dataInicio: Date, dataFim: Date): Promise<Transacao[]>
  filtrarPorCategoria(usuarioId: string, categoriaId: string): Promise<Transacao[]>
  salvar(transacao: Transacao): Promise<void>
  atualizar(transacao: Transacao): Promise<void>
  remover(id: string): Promise<boolean>
}
