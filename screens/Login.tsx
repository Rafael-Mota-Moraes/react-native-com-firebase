import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigation = useNavigation();

  const logar = () => {
    if (!email || !senha) alert("E-mail e senha são obrigatórios");
    auth
      .signInWithEmailAndPassword(email, senha)
      .then((userCredentials) =>
        console.log("Logado como: ", userCredentials.user?.email),
      )
      .catch((err) => alert("Email ou senha inválidos"));

    navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
});
