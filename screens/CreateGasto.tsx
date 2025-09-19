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
import { Gasto } from "../models/Gasto";

export default function CreateGasto() {
  const [formGasto, setFormGasto] = useState<Partial<Gasto>>({});

  const refGasto = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Gasto");

  const navigation = useNavigation<any>();

  const salvar = async () => {
    try {
      const docRef = refGasto.doc();
      await docRef.set({
        id: docRef.id,
        nome: formGasto.nome,
        data: formGasto.data,
        valor: formGasto.valor,
      });

      alert("Gasto cadastrado com sucesso!");
      navigation.replace("Menu");
    } catch (err) {
      console.log(err);
      alert("Não foi possível cadastrar o gasto");
    }
  };

  const voltar = () => {
    navigation.replace("Menu");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Cadastrar Gasto</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do gasto"
        onChangeText={(value) => setFormGasto({ ...formGasto, nome: value })}
      />

      <TextInput
        style={styles.input}
        placeholder="Data (DD/MM/YYYY)"
        onChangeText={(value) => setFormGasto({ ...formGasto, data: value })}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor"
        keyboardType="decimal-pad"
        onChangeText={(value) => setFormGasto({ ...formGasto, valor: value })}
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
