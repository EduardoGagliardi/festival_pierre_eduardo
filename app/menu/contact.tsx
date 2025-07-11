import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { colors, fonts } from "../../constants/design_constants";

export default function Contact() {
	return (
		<View style={{ flex: 1, backgroundColor: "#ededed" }}>
			<TouchableOpacity
				style={styles.closeIconBtn}
				onPress={() => router.back()}
			>
				<Feather name="x" style={styles.closeIcon} />
			</TouchableOpacity>
			<ScrollView contentContainerStyle={{ paddingTop: 80, paddingBottom: 32 }}>
				<View style={styles.rd}>
					<Text style={styles.title}>Contact</Text>
					<Text style={styles.text}>
						Contactez l'équipe du festival via ce formulaire ou par email.
					</Text>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	closeIconBtn: {
		width: 40,
		height: 40,
		backgroundColor: colors.quaternary,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 35,
		right: 15,
		zIndex: 1,
	},
	closeIcon: {
		fontSize: 20,
		color: "rgba(0 0 0 / 1)",
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 12,
		marginHorizontal: 16,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 4,
		elevation: 2,
	},
	title: {
		fontFamily: fonts.subtitle,
		fontSize: 28,
		color: colors.secondary,
		fontWeight: "bold",
		marginBottom: 16,
	},
	text: {
		fontFamily: fonts.body,
		fontSize: 16,
		color: colors.secondary,
		lineHeight: 22,
	},
});
