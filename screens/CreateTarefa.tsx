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
import { Tarefa } from "../models/Tarefa";

export default function CreateTarefa() {
  const [formTarefa, setFormTarefa] = useState<Partial<Tarefa>>({});

  const refTarefa = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Tarefa");

  const navigation = useNavigation<any>();

  const salvar = async () => {
    try {
      const docRef = refTarefa.doc();
      const novaTarefa = new Tarefa({
        id: docRef.id,
        nome: formTarefa.nome,
        dataInicio: formTarefa.dataInicio,
        dataEntrega: formTarefa.dataEntrega,
      });

      await docRef.set(novaTarefa.toFirestore());

      alert("Tarefa cadastrada com sucesso!");
      navigation.replace("Menu");
    } catch (err) {
      console.log(err);
      alert("Não foi possível cadastrar a tarefa");
    }
  };

  const voltar = () => {
    navigation.replace("Menu");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Cadastrar Tarefa</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da tarefa"
        onChangeText={(value) => setFormTarefa({ ...formTarefa, nome: value })}
      />

      <TextInput
        style={styles.input}
        placeholder="Data de Início (DD/MM/YYYY)"
        onChangeText={(value) =>
          setFormTarefa({ ...formTarefa, dataInicio: value })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Data de Entrega (DD/MM/YYYY)"
        onChangeText={(value) =>
          setFormTarefa({ ...formTarefa, dataEntrega: value })
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
