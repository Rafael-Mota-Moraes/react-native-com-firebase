import { useEffect, useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, firestore } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles";
import { Tarefa } from "../models/Tarefa";

type DisciplinaItem = {
  id: string;
  nome: string;
};

export default function CreateTarefa() {
  const [formTarefa, setFormTarefa] = useState<Partial<Tarefa>>({});
  const [disciplinas, setDisciplinas] = useState<DisciplinaItem[]>([]);
  const [loadingDisciplinas, setLoadingDisciplinas] = useState(true);

  // Estados para os date pickers
  const [showDateInicio, setShowDateInicio] = useState(false);
  const [showDateEntrega, setShowDateEntrega] = useState(false);
  const [dateInicio, setDateInicio] = useState(new Date());
  const [dateEntrega, setDateEntrega] = useState(new Date());

  const refTarefa = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Tarefa");

  const refDisciplina = firestore
    .collection("Usuario")
    .doc(auth.currentUser.uid)
    .collection("Disciplina");

  const navigation = useNavigation<any>();

  useEffect(() => {
    const loadDisciplinas = async () => {
      try {
        const snap = await refDisciplina.get();
        const list: DisciplinaItem[] = snap.docs.map((d) => ({
          id: d.id,
          nome: d.data().nome,
        }));
        setDisciplinas(list);
      } catch (e) {
        console.log(e);
        Alert.alert("Erro", "Não foi possível carregar as disciplinas");
      } finally {
        setLoadingDisciplinas(false);
      }
    };
    loadDisciplinas();
  }, []);

  const formatarData = (date: Date): string => {
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const onChangeDataInicio = (event: any, selectedDate?: Date) => {
    setShowDateInicio(Platform.OS === "ios");
    if (selectedDate) {
      setDateInicio(selectedDate);
      setFormTarefa({ ...formTarefa, dataInicio: formatarData(selectedDate) });
    }
  };

  const onChangeDataEntrega = (event: any, selectedDate?: Date) => {
    setShowDateEntrega(Platform.OS === "ios");
    if (selectedDate) {
      setDateEntrega(selectedDate);
      setFormTarefa({ ...formTarefa, dataEntrega: formatarData(selectedDate) });
    }
  };

  const validar = () => {
    if (!formTarefa?.nome?.trim()) return "Informe o nome da tarefa";
    if (!formTarefa?.dataInicio?.trim()) return "Informe a data de início";
    if (!formTarefa?.dataEntrega?.trim()) return "Informe a data de entrega";
    if (!formTarefa?.disciplinaId?.trim()) return "Selecione uma disciplina";
    return null;
  };

  const salvar = async () => {
    const erro = validar();
    if (erro) {
      Alert.alert("Validação", erro);
      return;
    }

    try {
      const docRef = refTarefa.doc();
      const novaTarefa = new Tarefa({
        id: docRef.id,
        nome: formTarefa.nome,
        dataInicio: formTarefa.dataInicio,
        dataEntrega: formTarefa.dataEntrega,
        disciplinaId: formTarefa.disciplinaId,
      });

      await docRef.set(novaTarefa.toFirestore());

      Alert.alert("Sucesso", "Tarefa cadastrada com sucesso!");
      navigation.replace("Menu");
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível cadastrar a tarefa");
    }
  };

  const voltar = () => {
    navigation.replace("Menu");
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text style={styles.title}>Cadastrar Tarefa</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da tarefa"
        onChangeText={(value) => setFormTarefa({ ...formTarefa, nome: value })}
      />

      {/* Data de Início */}
      <View style={{ width: "100%", marginTop: 8 }}>
        <Text style={{ marginBottom: 6, color: "#333" }}>Data de Início</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: "center" }]}
          onPress={() => setShowDateInicio(true)}
        >
          <Text style={{ color: formTarefa.dataInicio ? "#000" : "#999" }}>
            {formTarefa.dataInicio || "Selecione a data de início"}
          </Text>
        </TouchableOpacity>
        {showDateInicio && (
          <DateTimePicker
            value={dateInicio}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeDataInicio}
          />
        )}
      </View>

      {/* Data de Entrega */}
      <View style={{ width: "100%", marginTop: 8 }}>
        <Text style={{ marginBottom: 6, color: "#333" }}>Data de Entrega</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: "center" }]}
          onPress={() => setShowDateEntrega(true)}
        >
          <Text style={{ color: formTarefa.dataEntrega ? "#000" : "#999" }}>
            {formTarefa.dataEntrega || "Selecione a data de entrega"}
          </Text>
        </TouchableOpacity>
        {showDateEntrega && (
          <DateTimePicker
            value={dateEntrega}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeDataEntrega}
          />
        )}
      </View>

      {/* Disciplina */}
      <View style={{ width: "100%", marginTop: 8 }}>
        <Text style={{ marginBottom: 6, color: "#333" }}>Disciplina</Text>
        {loadingDisciplinas ? (
          <ActivityIndicator />
        ) : (
          <View style={[styles.input, { padding: 0 }]}>
            <Picker
              selectedValue={formTarefa.disciplinaId ?? ""}
              onValueChange={(value) =>
                setFormTarefa({ ...formTarefa, disciplinaId: value })
              }
            >
              <Picker.Item label="Selecione..." value="" />
              {disciplinas.map((d) => (
                <Picker.Item key={d.id} label={d.nome} value={d.id} />
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
