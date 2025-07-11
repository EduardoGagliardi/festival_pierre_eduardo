import { StyleSheet, Text, View } from "react-native";
import {
	GestureHandlerRootView,
	ScrollView,
} from "react-native-gesture-handler";

const BilletScreen = (): React.JSX.Element => {
	return (
		<GestureHandlerRootView>
			<ScrollView>
				<View>
					<Text>BilletScreen</Text>
				</View>
			</ScrollView>
		</GestureHandlerRootView>
	);
};

export default BilletScreen;

const styles = StyleSheet.create({});
