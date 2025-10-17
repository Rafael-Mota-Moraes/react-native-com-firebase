Regras firestore database para funcionar direito:

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
// Documento do usuário e todas as subcoleções dele
match /Usuario/{userId} {
// O próprio documento do usuário
allow read, write: if request.auth != null && request.auth.uid == userId;

      // Subcoleção Professor
      match /Professor/{professorId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }

      // Subcoleção Disciplina
      match /Disciplina/{disciplinaId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /Tarefa/{tarefaId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

}
}
