import { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native";
import { auth, firestore } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles";
import { Usuario } from "../models/Usuario";

export default function Register() {
  const [formUsuario, setFormUsuario] = useState<Partial<Usuario>>({});

  const refUsuario = firestore.collection('Usuario');

  const navigation = useNavigation<any>();

  const registrar = () => {
    auth
      .createUserWithEmailAndPassword(formUsuario.email, formUsuario.senha)
      .then((userCredentials) => {
        console.log("Logado como: ", userCredentials.user?.email);

        const idUsuario = refUsuario.doc(auth.currentUser.uid)
        idUsuario.set({
          id: auth.currentUser.uid,
          nome: formUsuario.nome,
          email: formUsuario.email,
          senha: formUsuario.senha,
          fone: formUsuario.fone,
        })

        navigation.replace("Home")
      }
      )
      .catch((err) => { console.log(err); alert("Email ou senha inválidos"); });

  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Faça seu registro</Text>
      <TextInput
        style={styles.input}
        onChangeText={(value) => setFormUsuario({ ...formUsuario, nome: value })}
        placeholder="Nome"
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => setFormUsuario({ ...formUsuario, email: value })}
        placeholder="E-mail"
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => setFormUsuario({ ...formUsuario, senha: value })}
        placeholder="Senha"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        onChangeText={(value) => setFormUsuario({ ...formUsuario, fone: value })}
        placeholder="Fone"
      />
      <View style={styles.buttonContainer}>
        <Button title="Cadastrar" onPress={registrar} />
      </View>
    </KeyboardAvoidingView>
  );
}
