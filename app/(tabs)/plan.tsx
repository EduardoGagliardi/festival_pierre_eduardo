import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../../constants/design_constants";

const PlanPage = (): React.JSX.Element => {
	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>Plan du Festival</Text>
				<Text style={styles.subtitle}>Carte interactive du site</Text>

				<View style={styles.mapContainer}>
					<Text style={styles.mapPlaceholder}>🗺️ Carte du festival</Text>
					<Text style={styles.description}>
						Retrouvez ici tous les espaces du festival :{"\n"}• Scènes
						principales{"\n"}• Zones de restauration{"\n"}• Sanitaires{"\n"}•
						Points d'information{"\n"}• Accès et parkings
					</Text>
				</View>

				<View style={styles.infoSection}>
					<Text style={styles.infoTitle}>Informations pratiques</Text>
					<Text style={styles.infoText}>
						La carte interactive sera bientôt disponible avec tous les détails
						du site du festival.
					</Text>
				</View>
			</View>
		</ScrollView>
	);
};

export default PlanPage;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.primary,
	},
	content: {
		padding: 20,
	},
	title: {
		fontFamily: fonts.heading,
		fontSize: 28,
		color: colors.secondary,
		textAlign: "center",
		marginBottom: 10,
	},
	subtitle: {
		fontFamily: fonts.body,
		fontSize: 16,
		color: colors.ternary,
		textAlign: "center",
		marginBottom: 30,
	},
	mapContainer: {
		backgroundColor: colors.secondary,
		borderRadius: 15,
		padding: 30,
		marginBottom: 20,
		alignItems: "center",
		minHeight: 300,
		justifyContent: "center",
	},
	mapPlaceholder: {
		fontFamily: fonts.heading,
		fontSize: 24,
		color: colors.primary,
		marginBottom: 20,
	},
	description: {
		fontFamily: fonts.body,
		fontSize: 14,
		color: colors.primary,
		textAlign: "center",
		lineHeight: 20,
	},
	infoSection: {
		backgroundColor: colors.ternary,
		borderRadius: 15,
		padding: 20,
	},
	infoTitle: {
		fontFamily: fonts.heading,
		fontSize: 18,
		color: colors.secondary,
		marginBottom: 10,
	},
	infoText: {
		fontFamily: fonts.body,
		fontSize: 14,
		color: colors.secondary,
		lineHeight: 20,
	},
});
