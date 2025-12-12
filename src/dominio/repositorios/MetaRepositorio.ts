import { Meta } from "../entidades/Meta"

export interface MetaRepositorio {
  buscarPorId(id: string): Promise<Meta | null>
  listarPorUsuario(usuarioId: string): Promise<Meta[]>
  salvar(meta: Meta): Promise<void>
  atualizar(meta: Meta): Promise<void>
  remover(id: string): Promise<boolean>
}
