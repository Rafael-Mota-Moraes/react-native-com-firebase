import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigation = useNavigation<any>();

  const logar = () => {
    if (!email || !senha) {
      alert("E-mail e senha são obrigatórios");
      return;
    }
    auth
      .signInWithEmailAndPassword(email, senha)
      .then((userCredentials) => {
        console.log("Logado como: ", userCredentials.user?.email);
        navigation.replace("Menu");
      })
      .catch((err) => alert("Email ou senha inválidos"));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, ...styles.container }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Login</Text>
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
      <View style={styles.buttonContainer}>
        <Button title="Entrar" onPress={logar} />
        <Button
          title="Registrar-se"
          onPress={() => navigation.replace("Register")}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
