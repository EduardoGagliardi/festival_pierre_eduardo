import {
	type DrawerContentComponentProps,
	DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Text } from "react-native";

const DrawerComponent = (
	props: DrawerContentComponentProps,
): React.JSX.Element => {
	return (
		<DrawerContentScrollView {...props}>
			<Text>Title</Text>
		</DrawerContentScrollView>
	);
};

export default DrawerComponent;
