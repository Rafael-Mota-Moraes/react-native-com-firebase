import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Home";
import CreateGasto from "./CreateTarefa";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";
import { StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
export const drawerStyles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5", // mesmo fundo da tela
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
    backgroundColor: "#e0e0e0", // destaque suave quando selecionado
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
            label="Cadastrar Novo Gasto"
            onPress={() => props.navigation.navigate("Cadastrar Novo Gasto")}
            icon={({ color, size }) => (
              <MaterialIcons name="attach-money" size={size} color={color} />
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
      <Drawer.Screen name="Cadastrar Novo Gasto" component={CreateGasto} />
    </Drawer.Navigator>
  );
}
