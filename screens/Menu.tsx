import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "./Home";
import CreateGasto from "./CreateGasto";

const Drawer = createDrawerNavigator();

export default function Menu() {
  return (
    <Drawer.Navigator initialRouteName="Página Inicial">
      <Drawer.Screen name="Página Inicial" component={Home} />
      <Drawer.Screen name="Cadastrar Novo Gasto" component={CreateGasto} />
    </Drawer.Navigator>
  );
}
