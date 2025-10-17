import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
} from "react-native";
import { auth, firestore } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles";
import { Disciplina } from "../models/Disciplina";

export default function CreateDisciplina() {
  const [formDisciplina, setFormDisciplina] = useState<Partial<Disciplina>>({});

  const refDisciplina = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Disciplina");

  const navigation = useNavigation<any>();

  const salvar = async () => {
    try {
      const docRef = refDisciplina.doc();

      const novaDisciplina = new Disciplina({
        id: docRef.id,
        nome: formDisciplina.nome,
        professor: formDisciplina.professor,
        cargaHoraria: formDisciplina.cargaHoraria,
      });

      await docRef.set(novaDisciplina.toFirestore());

      alert("Disciplina cadastrada com sucesso!");
      navigation.replace("Menu");
    } catch (err) {
      console.log(err);
      alert("Não foi possível cadastrar a disciplina");
    }
  };

  const voltar = () => {
    navigation.replace("Menu");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Cadastrar Disciplina</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da disciplina"
        onChangeText={(value) =>
          setFormDisciplina({ ...formDisciplina, nome: value })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Professor"
        onChangeText={(value) =>
          setFormDisciplina({ ...formDisciplina, professor: value })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Carga horária (número de horas)"
        keyboardType="number-pad"
        onChangeText={(value) =>
          setFormDisciplina({
            ...formDisciplina,
            cargaHoraria: Number(value),
          })
        }
      />

      <View style={styles.buttonContainer}>
        <Button title="Salvar" onPress={salvar} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Voltar" onPress={voltar} />
      </View>
    </KeyboardAvoidingView>
  );
}
