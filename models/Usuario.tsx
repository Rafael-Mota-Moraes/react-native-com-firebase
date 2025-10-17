export class Usuario {
  public id: string;
  public nome: string;
  public email: string;
  public senha: string;

  constructor(obj?: Partial<Usuario>) {
    if (obj) {
      this.id = obj.id;
      this.nome = obj.nome;
      this.email = obj.email;
    }
  }

  toString() {
    const obj = `{
            "id" : "${this.id}",
            "nome" : "${this.nome}",
            "email" : "${this.email}",
        }`;

    return obj;
  }

  toFirestore() {
    const usuario = {
      id: this.id,
      nome: this.nome,
      email: this.email,
    };

    return usuario;
  }
}
