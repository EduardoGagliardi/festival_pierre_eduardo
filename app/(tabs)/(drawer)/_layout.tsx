import { Drawer } from "expo-router/drawer";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerComponent from "../../../components/shared/drawer_component";

const DrawerLayout = (): React.JSX.Element => {
	return (
		<GestureHandlerRootView>
			<Drawer drawerContent={(props) => <DrawerComponent {...props} />}>
				<Drawer.Screen name="billets" />
			</Drawer>
		</GestureHandlerRootView>
	);
};

export default DrawerLayout;

const styles = StyleSheet.create({});
