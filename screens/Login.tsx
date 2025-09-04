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
      <Text>Login</Text>
      <TextInput
        onChangeText={(value) => setEmail(value)}
        placeholder="E-mail"
      />
      <TextInput
        onChangeText={(value) => setSenha(value)}
        placeholder="Senha"
      />
      <Button title="Entrar" onPress={logar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
