import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [fone, setFone] = useState("");
  const navigation = useNavigation<any>();

  const registrar = () => {
    auth
      .createUserWithEmailAndPassword(email, senha)
      .then((userCredentials) =>
        console.log("Logado como: ", userCredentials.user?.email),
      )
      .catch((err) => alert("Email ou senha inválidos"));

    navigation.replace("Home");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Faça seu registro</Text>
      <TextInput
        style={styles.input}
        onChangeText={(value) => setNome(value)}
        placeholder="Nome"
        value={nome}
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => setEmail(value)}
        placeholder="E-mail"
        value={email}
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => setSenha(value)}
        placeholder="Senha"
        value={senha}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => setFone(value)}
        placeholder="Fone"
        value={fone}
      />
      <View style={styles.buttonContainer}>
        <Button title="Cadastrar" onPress={registrar} />
      </View>
    </KeyboardAvoidingView>
  );
}
