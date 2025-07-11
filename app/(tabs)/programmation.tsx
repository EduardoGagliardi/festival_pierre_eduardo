import { StyleSheet, Text, View } from "react-native";
import {
	GestureHandlerRootView,
	ScrollView,
} from "react-native-gesture-handler";

const ProgrammationScreen = (): React.JSX.Element => {
	return (
		<GestureHandlerRootView>
			<ScrollView>
				<View>
					<Text>ProgrammationScreen</Text>
				</View>
			</ScrollView>
		</GestureHandlerRootView>
	);
};

export default ProgrammationScreen;

const styles = StyleSheet.create({});
