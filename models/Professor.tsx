export class Professor {
  public id: string;
  public nome: string;
  public email: string;
  public departamento: string;

  constructor(obj?: Partial<Professor>) {
    if (obj) {
      this.id = obj.id!;
      this.nome = obj.nome!;
      this.email = obj.email!;
      this.departamento = obj.departamento!;
    }
  }

  toString() {
    const obj = `{
            "id" : "${this.id}",
            "nome" : "${this.nome}",
            "email" : "${this.email}",
            "departamento" : "${this.departamento}"
        }`;
    return obj;
  }

  toFirestore() {
    const professor = {
      id: this.id,
      nome: this.nome,
      email: this.email,
      departamento: this.departamento,
    };
    return professor;
  }
}
