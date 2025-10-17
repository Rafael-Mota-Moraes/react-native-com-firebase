import { useEffect, useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { auth, firestore } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles";
import { Disciplina } from "../models/Disciplina";

type ProfessorItem = {
  id: string;
  nome: string;
};

export default function CreateDisciplina() {
  const [formDisciplina, setFormDisciplina] = useState<Partial<Disciplina>>({});
  const [professores, setProfessores] = useState<ProfessorItem[]>([]);
  const [loadingProfessores, setLoadingProfessores] = useState(true);

  const refDisciplina = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Disciplina");

  const refProfessor = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Professor");

  const navigation = useNavigation<any>();

  useEffect(() => {
    const loadProfessores = async () => {
      try {
        const snap = await refProfessor.get();
        const list: ProfessorItem[] = snap.docs.map((d) => ({
          id: d.id,
          nome: d.data().nome,
        }));
        setProfessores(list);
      } catch (e) {
        console.log(e);
        Alert.alert("Erro", "Não foi possível carregar os professores");
      } finally {
        setLoadingProfessores(false);
      }
    };
    loadProfessores();
  }, []);

  const validar = () => {
    if (!formDisciplina?.nome?.trim()) return "Informe o nome da disciplina";
    if (
      formDisciplina?.cargaHoraria === undefined ||
      formDisciplina?.cargaHoraria === null
    )
      return "Informe a carga horária";
    if (!formDisciplina?.professorId?.trim()) return "Selecione um professor";
    return null;
  };

  const salvar = async () => {
    const erro = validar();
    if (erro) {
      Alert.alert("Validação", erro);
      return;
    }

    try {
      const docRef = refDisciplina.doc();

      const novaDisciplina = new Disciplina({
        id: docRef.id,
        nome: formDisciplina.nome,
        cargaHoraria: formDisciplina.cargaHoraria,
        professorId: formDisciplina.professorId,
      });

      await docRef.set(novaDisciplina.toFirestore());

      Alert.alert("Sucesso", "Disciplina cadastrada com sucesso!");
      navigation.replace("Menu");
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível cadastrar a disciplina");
    }
  };

  const voltar = () => {
    navigation.replace("Menu");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Cadastrar Disciplina</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da disciplina"
        onChangeText={(value) =>
          setFormDisciplina({ ...formDisciplina, nome: value })
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Carga horária (número de horas)"
        keyboardType="number-pad"
        onChangeText={(value) =>
          setFormDisciplina({
            ...formDisciplina,
            cargaHoraria: Number(value),
          })
        }
      />

      <View style={{ width: "100%", marginTop: 8 }}>
        <Text style={{ marginBottom: 6, color: "#333" }}>Professor</Text>
        {loadingProfessores ? (
          <ActivityIndicator />
        ) : (
          <View style={[styles.input, { padding: 0 }]}>
            <Picker
              selectedValue={formDisciplina.professorId ?? ""}
              onValueChange={(value) =>
                setFormDisciplina({ ...formDisciplina, professorId: value })
              }
            >
              <Picker.Item label="Selecione..." value="" />
              {professores.map((p) => (
                <Picker.Item key={p.id} label={p.nome} value={p.id} />
              ))}
            </Picker>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Salvar" onPress={salvar} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Voltar" onPress={voltar} />
      </View>
    </KeyboardAvoidingView>
  );
}
