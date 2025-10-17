export class Tarefa {
  public id: string;
  public nome: string;
  public dataInicio: string;
  public dataEntrega: string;
  public disciplinaId?: string;

  constructor(obj?: Partial<Tarefa>) {
    if (obj) {
      this.id = obj.id!;
      this.nome = obj.nome!;
      this.dataInicio = obj.dataInicio!;
      this.dataEntrega = obj.dataEntrega!;
      this.disciplinaId = obj.disciplinaId;
    }
  }

  toString() {
    const obj = `{
      "id":"${this.id}",
      "nome":"${this.nome}",
      "dataInicio":"${this.dataInicio}",
      "dataEntrega":"${this.dataEntrega}",
      "disciplinaId":"${this.disciplinaId ?? ""}"
    }`;
    return obj;
  }

  toFirestore() {
    return {
      id: this.id,
      nome: this.nome,
      dataInicio: this.dataInicio,
      dataEntrega: this.dataEntrega,
      disciplinaId: this.disciplinaId ?? null,
    };
  }
}
