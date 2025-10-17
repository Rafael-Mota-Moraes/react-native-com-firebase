import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
  Alert,
} from "react-native";
import { auth, firestore } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles";
import { Professor } from "../models/Professor";

export default function CreateProfessor() {
  // PARA CRIAR TIVE QUE ATUALIZAR AS REGRAS NO FIREBASE CONSOLE

  const [formProfessor, setFormProfessor] = useState<Partial<Professor>>({});

  const refProfessor = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Professor");

  const navigation = useNavigation<any>();

  const validar = () => {
    if (!formProfessor?.nome?.trim()) return "Informe o nome";
    if (!formProfessor?.email?.trim()) return "Informe o email";
    if (!formProfessor?.departamento?.trim()) return "Informe o departamento";
    return null;
  };

  const salvar = async () => {
    const erro = validar();
    if (erro) {
      Alert.alert("Validação", erro);
      return;
    }

    try {
      const docRef = refProfessor.doc();
      const novoProfessor = new Professor({
        id: docRef.id,
        nome: formProfessor.nome,
        email: formProfessor.email,
        departamento: formProfessor.departamento,
      });

      await docRef.set(novoProfessor.toFirestore());

      Alert.alert("Sucesso", "Professor cadastrado com sucesso!");
      navigation.replace("Menu");
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível cadastrar o professor");
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
