import { Usuario } from '../dominio/entidades/Usuario'

describe('Usuario', () => {

  it('deve criar um usuário com dados válidos', () => {

    const usuario = Usuario.create(
      'Raul Lima',
      'raul@gmail.com',
      'senha123'
    )

    expect(usuario).toBeInstanceOf(Usuario)
    expect(usuario.nome).toBe('Raul Lima')
    expect(usuario.email).toBe('raul@gmail.com')
    expect(usuario.saldo).toBe(0)
  })

  it('deve lançar erro para nome inválido', () => {

    expect(() => {
      Usuario.create('Ra', 'raul@gmail.com', 'senha123')
    }).toThrow('Nome obrigatório, mínimo 3 caracteres')

  })

  it('deve lançar erro para email inválido', () => {

    expect(() => {
      Usuario.create('Raul Lima', 'email-invalido', 'senha123')
    }).toThrow('E-mail inválido')

  })

  it('deve lançar erro para senha curta', () => {

    expect(() => {
      Usuario.create('Raul Lima', 'raul@gmail.com', '123')
    }).toThrow('Senha mínima de 8 caracteres')

  })

  it('deve atualizar saldo corretamente', () => {

    const usuario = Usuario.create(
      'Raul Lima',
      'raul@gmail.com',
      'senha123'
    )

    usuario.atualizarSaldo(200)

    expect(usuario.saldo).toBe(200)

  })

  it('deve editar nome e email', () => {

    const usuario = Usuario.create(
      'Raul Lima',
      'raul@gmail.com',
      'senha123'
    )

    usuario.editarPerfil(
      'Raul Silva',
      'novo@gmail.com'
    )

    expect(usuario.nome).toBe('Raul Silva')
    expect(usuario.email).toBe('novo@gmail.com')

  })

  it('deve alterar senha corretamente', () => {

    const usuario = Usuario.create(
      'Raul Lima',
      'raul@gmail.com',
      'senha123'
    )

    usuario.alterarSenha('novasenha123')

    expect(usuario.senha).toBe('novasenha123')

  })

  it('deve lançar erro ao alterar para senha inválida', () => {

    const usuario = Usuario.create(
      'Raul Lima',
      'raul@gmail.com',
      'senha123'
    )

    expect(() => {
      usuario.alterarSenha('123')
    }).toThrow('Senha mínima de 8 caracteres')

  })

})