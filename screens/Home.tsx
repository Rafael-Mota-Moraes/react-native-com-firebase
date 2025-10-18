import { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Button,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { auth, firestore } from "../firebase";
import { styles } from "../styles";
import { Tarefa } from "../models/Tarefa";

type DisciplinaItem = {
  id: string;
  nome: string;
};

export default function Home() {
  const navigation = useNavigation<any>();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);
  const [disciplinas, setDisciplinas] = useState<DisciplinaItem[]>([]);

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

  useEffect(() => {
    carregarTarefas();
    carregarDisciplinas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const snap = await refTarefa.get();
      const list = snap.docs.map((d) => new Tarefa(d.data() as Tarefa));
      setTarefas(list);
    } catch (e) {
      console.log(e);
      Alert.alert("Erro", "Não foi possível carregar as tarefas");
    } finally {
      setLoading(false);
    }
  };

  const carregarDisciplinas = async () => {
    try {
      const snap = await refDisciplina.get();
      const list: DisciplinaItem[] = snap.docs.map((d) => ({
        id: d.id,
        nome: d.data().nome,
      }));
      setDisciplinas(list);
    } catch (e) {
      console.log(e);
    }
  };

  const confirmarExclusao = (tarefa: Tarefa) => {
    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir a tarefa "${tarefa.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => excluir(tarefa),
        },
      ]
    );
  };

  const excluir = async (tarefa: Tarefa) => {
    try {
      await refTarefa.doc(tarefa.id).delete();
      setTarefas(tarefas.filter((t) => t.id !== tarefa.id));
      Alert.alert("Sucesso", "Tarefa excluída com sucesso!");
    } catch (e) {
      console.log(e);
      Alert.alert("Erro", "Não foi possível excluir a tarefa");
    }
  };

  const abrirEdicao = (tarefa: Tarefa) => {
    setTarefaEditando(new Tarefa(tarefa));

    // Converter strings de data para objetos Date
    if (tarefa.dataInicio) {
      const [dia, mes, ano] = tarefa.dataInicio.split("/");
      setDateInicio(new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia)));
    }
    if (tarefa.dataEntrega) {
      const [dia, mes, ano] = tarefa.dataEntrega.split("/");
      setDateEntrega(new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia)));
    }

    setModalVisible(true);
  };

  const formatarData = (date: Date): string => {
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const onChangeDataInicio = (event: any, selectedDate?: Date) => {
    setShowDateInicio(Platform.OS === "ios");
    if (selectedDate && tarefaEditando) {
      setDateInicio(selectedDate);
      tarefaEditando.dataInicio = formatarData(selectedDate);
      setTarefaEditando(new Tarefa(tarefaEditando));
    }
  };

  const onChangeDataEntrega = (event: any, selectedDate?: Date) => {
    setShowDateEntrega(Platform.OS === "ios");
    if (selectedDate && tarefaEditando) {
      setDateEntrega(selectedDate);
      tarefaEditando.dataEntrega = formatarData(selectedDate);
      setTarefaEditando(new Tarefa(tarefaEditando));
    }
  };

  const salvarEdicao = async () => {
    if (!tarefaEditando?.nome?.trim()) {
      Alert.alert("Validação", "Informe o nome da tarefa");
      return;
    }
    if (!tarefaEditando?.dataInicio?.trim()) {
      Alert.alert("Validação", "Informe a data de início");
      return;
    }
    if (!tarefaEditando?.dataEntrega?.trim()) {
      Alert.alert("Validação", "Informe a data de entrega");
      return;
    }
    if (!tarefaEditando?.disciplinaId?.trim()) {
      Alert.alert("Validação", "Selecione uma disciplina");
      return;
    }

    try {
      const dadosAtualizados = {
        id: tarefaEditando.id,
        nome: tarefaEditando.nome,
        dataInicio: tarefaEditando.dataInicio,
        dataEntrega: tarefaEditando.dataEntrega,
        disciplinaId: tarefaEditando.disciplinaId ?? null,
      };

      await refTarefa.doc(tarefaEditando.id).update(dadosAtualizados);
      setTarefas(
        tarefas.map((t) =>
          t.id === tarefaEditando.id ? new Tarefa(tarefaEditando) : t
        )
      );
      setModalVisible(false);
      Alert.alert("Sucesso", "Tarefa atualizada com sucesso!");
    } catch (e) {
      console.log(e);
      Alert.alert("Erro", "Não foi possível atualizar a tarefa");
    }
  };

  const getNomeDisciplina = (disciplinaId?: string) => {
    if (!disciplinaId) return "Sem disciplina";
    const disc = disciplinas.find((d) => d.id === disciplinaId);
    return disc?.nome || "Desconhecida";
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Tarefas</Text>

      {tarefas.length === 0 ? (
        <Text style={{ marginTop: 20, color: "#666" }}>
          Nenhuma tarefa cadastrada
        </Text>
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item.id}
          style={{ width: "100%", marginTop: 10 }}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: "#f9f9f9",
                padding: 15,
                marginBottom: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.nome}
              </Text>
              <Text style={{ color: "#666", marginTop: 4 }}>
                Início: {item.dataInicio}
              </Text>
              <Text style={{ color: "#666" }}>Entrega: {item.dataEntrega}</Text>
              <Text style={{ color: "#666" }}>
                Disciplina: {getNomeDisciplina(item.disciplinaId)}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => abrirEdicao(item)}
                  style={{
                    backgroundColor: "#007bff",
                    padding: 8,
                    borderRadius: 5,
                    flex: 1,
                    marginRight: 5,
                  }}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Editar
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => confirmarExclusao(item)}
                  style={{
                    backgroundColor: "#dc3545",
                    padding: 8,
                    borderRadius: 5,
                    flex: 1,
                    marginLeft: 5,
                  }}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Modal de Edição */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
              maxHeight: "80%",
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}
            >
              Editar Tarefa
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da tarefa"
              value={tarefaEditando?.nome || ""}
              onChangeText={(value) => {
                if (tarefaEditando) {
                  tarefaEditando.nome = value;
                  setTarefaEditando(new Tarefa(tarefaEditando));
                }
              }}
            />

            {/* Data de Início */}
            <View style={{ marginTop: 8 }}>
              <Text style={{ marginBottom: 6, color: "#333" }}>
                Data de Início
              </Text>
              <TouchableOpacity
                style={[styles.input, { justifyContent: "center" }]}
                onPress={() => setShowDateInicio(true)}
              >
                <Text>{tarefaEditando?.dataInicio || "Selecione a data"}</Text>
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
            <View style={{ marginTop: 8 }}>
              <Text style={{ marginBottom: 6, color: "#333" }}>
                Data de Entrega
              </Text>
              <TouchableOpacity
                style={[styles.input, { justifyContent: "center" }]}
                onPress={() => setShowDateEntrega(true)}
              >
                <Text>{tarefaEditando?.dataEntrega || "Selecione a data"}</Text>
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
            <View style={{ marginTop: 8 }}>
              <Text style={{ marginBottom: 6, color: "#333" }}>Disciplina</Text>
              <View style={[styles.input, { padding: 0 }]}>
                <Picker
                  selectedValue={tarefaEditando?.disciplinaId ?? ""}
                  onValueChange={(value) => {
                    if (tarefaEditando) {
                      tarefaEditando.disciplinaId = value;
                      setTarefaEditando(new Tarefa(tarefaEditando));
                    }
                  }}
                >
                  <Picker.Item label="Selecione..." value="" />
                  {disciplinas.map((d) => (
                    <Picker.Item key={d.id} label={d.nome} value={d.id} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={{ marginTop: 15 }}>
              <Button title="Salvar" onPress={salvarEdicao} />
            </View>
            <View style={{ marginTop: 10 }}>
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                color="#666"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
