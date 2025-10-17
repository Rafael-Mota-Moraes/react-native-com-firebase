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
import { Professor } from "../models/Professor";

export default function CreateProfessor() {
  const [formProfessor, setFormProfessor] = useState<Partial<Professor>>({});

  const refProfessor = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Professor");

  const navigation = useNavigation<any>();

  const salvar = async () => {
    try {
      const docRef = refProfessor.doc();

      const novoProfessor = new Professor({
        id: docRef.id,
        nome: formProfessor.nome,
        email: formProfessor.email,
        departamento: formProfessor.departamento,
      });

      await docRef.set(novoProfessor.toFirestore());

      alert("Professor cadastrado com sucesso!");
      navigation.replace("Menu");
    } catch (err) {
      console.log(err);
      alert("Não foi possível cadastrar o professor");
    }
  };

  const voltar = () => {
    navigation.replace("Menu");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Cadastrar Professor</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        onChangeText={(value) =>
          setFormProfessor({ ...formProfessor, nome: value })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(value) =>
          setFormProfessor({ ...formProfessor, email: value })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Departamento"
        onChangeText={(value) =>
          setFormProfessor({ ...formProfessor, departamento: value })
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
