export class Disciplina {
  public id: string;
  public nome: string;
  public professorId?: string; // FK para Professor
  public cargaHoraria: number;

  constructor(obj?: Partial<Disciplina>) {
    if (obj) {
      this.id = obj.id!;
      this.nome = obj.nome!;
      this.professorId = obj.professorId;
      this.cargaHoraria = obj.cargaHoraria!;
    }
  }

  toString() {
    const obj = `{
      "id":"${this.id}",
      "nome":"${this.nome}",
      "professorId":"${this.professorId ?? ""}",
      "cargaHoraria":${this.cargaHoraria}
    }`;
    return obj;
  }

  toFirestore() {
    return {
      id: this.id,
      nome: this.nome,
      professorId: this.professorId ?? null,
      cargaHoraria: this.cargaHoraria,
    };
  }
}
