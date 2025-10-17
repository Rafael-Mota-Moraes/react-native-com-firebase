import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles";

export default function Home() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text>Bem vindo</Text>
    </View>
  );
}
