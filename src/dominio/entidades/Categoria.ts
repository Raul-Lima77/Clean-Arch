export type CategoriaProps = {
  id: string
  nome: string
  limiteGasto?: number
  usuarioId: string
}

export class Categoria {
  private constructor(private props: CategoriaProps) {}

  public static create(nome: string, usuarioId: string, limiteGasto?: number): Categoria {
    if (!nome || nome.trim().length === 0) {
      throw new Error("Nome da categoria é obrigatório")
    }

    if (limiteGasto !== undefined && limiteGasto <= 0) {
      throw new Error("Limite de gasto deve ser maior que zero")
    }

    return new Categoria({
      id: crypto.randomUUID().toString(),
      nome,
      limiteGasto,
      usuarioId,
    })
  }

  public editar(nome?: string, limiteGasto?: number): void {
    if (nome && nome.trim().length > 0) {
      this.props.nome = nome
    }
    if (limiteGasto !== undefined && limiteGasto > 0) {
      this.props.limiteGasto = limiteGasto
    }
  }

  public static fromPersistence(props: CategoriaProps): Categoria {
    return new Categoria(props)
  }

  public toPersistence(): CategoriaProps {
    return this.props
  }

  public get id() {
    return this.props.id
  }
  public get nome() {
    return this.props.nome
  }
  public get limiteGasto() {
    return this.props.limiteGasto
  }
  public get usuarioId() {
    return this.props.usuarioId
  }
}
