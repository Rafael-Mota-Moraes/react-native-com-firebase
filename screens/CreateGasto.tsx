import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { firestore } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles";
import { Gasto } from "../models/Gasto";

export default function CreateGasto() {
  const [formGasto, setFormGasto] = useState<Partial<Gasto>>({});

  const refGasto = firestore.collection("Gasto");

  const navigation = useNavigation<any>();

  const cadastrar = async () => {
    try {
      const docRef = refGasto.doc();
      await docRef.set({
        id: docRef.id,
        nome: formGasto.nome,
        data: formGasto.data,
        valor: formGasto.valor,
      });

      alert("Gasto cadastrado com sucesso!");
      navigation.replace("Home");
    } catch (err) {
      console.log(err);
      alert("Não foi possível cadastrar o gasto");
    }
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
        placeholder="Data (YYYY-MM-DD)"
        onChangeText={(value) => setFormGasto({ ...formGasto, data: value })}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor"
        keyboardType="decimal-pad"
        onChangeText={(value) => setFormGasto({ ...formGasto, valor: value })}
      />

      <View style={styles.buttonContainer}>
        <Button title="Cadastrar" onPress={cadastrar} />
      </View>
    </KeyboardAvoidingView>
  );
}
