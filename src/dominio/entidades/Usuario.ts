export type UsuarioProps = {
  id: string
  nome: string
  email: string
  senha: string
  saldo: number
  dataCriacao: Date
}

export class Usuario {
  private constructor(private props: UsuarioProps) {}

  public static create(nome: string, email: string, senha: string): Usuario {
    if (!nome || nome.trim().length < 3) {
      throw new Error("Nome obrigatório, mínimo 3 caracteres")
    }

    if (!email || !this.validarEmail(email)) {
      throw new Error("E-mail inválido")
    }

    if (!senha || senha.length < 8) {
      throw new Error("Senha mínima de 8 caracteres")
    }

    return new Usuario({
      id: crypto.randomUUID().toString(),
      nome,
      email,
      senha,
      saldo: 0,
      dataCriacao: new Date(),
    })
  }

  private static validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  public atualizarSaldo(valor: number): void {
    this.props.saldo += valor
  }

  public editarPerfil(nome?: string, email?: string): void {
    if (nome && nome.trim().length >= 3) {
      this.props.nome = nome
    }
    if (email && Usuario.validarEmail(email)) {
      this.props.email = email
    }
  }

  public alterarSenha(novaSenha: string): void {
    if (!novaSenha || novaSenha.length < 8) {
      throw new Error("Senha mínima de 8 caracteres")
    }
    this.props.senha = novaSenha
  }

  public static fromPersistence(props: UsuarioProps): Usuario {
    return new Usuario(props)
  }

  public toPersistence(): UsuarioProps {
    return this.props
  }

  public get id() {
    return this.props.id
  }
  public get nome() {
    return this.props.nome
  }
  public get email() {
    return this.props.email
  }
  public get senha() {
    return this.props.senha
  }
  public get saldo() {
    return this.props.saldo
  }
  public get dataCriacao() {
    return this.props.dataCriacao
  }
}
