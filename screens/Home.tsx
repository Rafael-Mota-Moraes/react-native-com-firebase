import { Button, StyleSheet, Text, View } from "react-native";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation<any>();

  const logout = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };

  return (
    <View style={styles.container}>
      <Text>Bem vindo</Text>
      <Button title="Logout" onPress={logout} />
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
