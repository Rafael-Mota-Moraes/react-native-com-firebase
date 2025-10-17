import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Home";
import CreateTarefa from "./CreateTarefa";
import CreateDisciplina from "./CreateDisciplina";
import CreateProfessor from "./CreateProfessor";
import { auth } from "../firebase";
import { StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";

export const drawerStyles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 20,
  },
  drawerHeader: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 10,
    alignItems: "center",
  },
  drawerHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 8,
  },
  drawerItemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  drawerItemActive: {
    backgroundColor: "#e0e0e0",
  },
  icon: {
    fontSize: 20,
    color: "#555",
  },
});

const Drawer: any = createDrawerNavigator();

export default function Menu() {
  return (
    <Drawer.Navigator
      initialRouteName="Página Inicial"
      screenOptions={{ headerShown: true }}
      drawerContent={(props: any) => (
        <DrawerContentScrollView
          {...props}
          style={drawerStyles.drawerContainer}
        >
          <DrawerItem
            label="Página Inicial"
            onPress={() => props.navigation.navigate("Página Inicial")}
            icon={({ color, size }) => (
              <MaterialIcons name="home" size={size} color={color} />
            )}
            labelStyle={drawerStyles.drawerItemText}
            activeTintColor="#333"
            inactiveTintColor="#555"
          />

          <DrawerItem
            label="Cadastrar Nova Tarefa"
            onPress={() => props.navigation.navigate("Cadastrar Nova Tarefa")}
            icon={({ color, size }) => (
              <MaterialIcons name="task-alt" size={size} color={color} />
            )}
            labelStyle={drawerStyles.drawerItemText}
            activeTintColor="#333"
            inactiveTintColor="#555"
          />

          <DrawerItem
            label="Cadastrar Disciplina"
            onPress={() => props.navigation.navigate("Cadastrar Disciplina")}
            icon={({ color, size }) => (
              <MaterialIcons name="menu-book" size={size} color={color} />
            )}
            labelStyle={drawerStyles.drawerItemText}
            activeTintColor="#333"
            inactiveTintColor="#555"
          />

          <DrawerItem
            label="Cadastrar Professor"
            onPress={() => props.navigation.navigate("Cadastrar Professor")}
            icon={({ color, size }) => (
              <MaterialIcons name="school" size={size} color={color} />
            )}
            labelStyle={drawerStyles.drawerItemText}
            activeTintColor="#333"
            inactiveTintColor="#555"
          />

          <DrawerItem
            label="Sair"
            onPress={() =>
              auth.signOut().then(() => props.navigation.replace("Login"))
            }
            icon={({ color, size }) => (
              <MaterialIcons name="logout" size={size} color="red" />
            )}
            labelStyle={[drawerStyles.drawerItemText, { color: "red" }]}
            activeTintColor="red"
            inactiveTintColor="red"
          />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen name="Página Inicial" component={Home} />
      <Drawer.Screen name="Cadastrar Nova Tarefa" component={CreateTarefa} />
      <Drawer.Screen name="Cadastrar Disciplina" component={CreateDisciplina} />
      <Drawer.Screen name="Cadastrar Professor" component={CreateProfessor} />
    </Drawer.Navigator>
  );
}
