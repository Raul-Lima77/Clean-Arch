import { Usuario } from '../dominio/entidades/Usuario'

describe('Usuario', () => {

  it('deve criar um usuário com dados válidos', () => {

    const usuario = Usuario.create('Raul Lima', 'raul@gmail.com', 'senha123')
    expect(usuario).toBeInstanceOf(Usuario)
    expect(usuario.nome).toBe('Raul Lima')
    expect(usuario.email).toBe('raul@gmail.com')
    expect(usuario.saldo).toBe(0)
  })


})