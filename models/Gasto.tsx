export class Gasto {
  public id: string;
  public nome: string;
  public data: string;
  public valor: string;

  constructor(obj?: Partial<Gasto>) {
    if (obj) {
      this.id = obj.id;
      this.nome = obj.nome;
      this.data = obj.data;
      this.valor = obj.valor;
    }
  }

  toString() {
    const obj = `{
            "id" : "${this.id}",
            "nome" : "${this.nome}",
            "data" : "${this.data}",
            "valor" : "${this.valor}"
        }`;

    return obj;
  }

  toFirestore() {
    const gasto = {
      id: this.id,
      nome: this.nome,
      data: this.data,
      valor: this.valor,
    };
    return gasto;
  }
}
