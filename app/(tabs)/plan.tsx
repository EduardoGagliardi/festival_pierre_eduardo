import type React from "react";
import { StyleSheet, View } from "react-native";
import MapComponent from "../../components/plan/MapComponent";

const PlanPage = (): React.JSX.Element => (
	<View style={styles.container}>
		<MapComponent />
	</View>
);

export default PlanPage;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
