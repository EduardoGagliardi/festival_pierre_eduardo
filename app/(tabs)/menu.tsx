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

const infosPratiques = [
	{ title: "Comment venir ?", route: "/menu/how-to-come" },
	{ title: "Plan du festival", route: "/menu/festival-map" },
	{ title: "Victime ou témoin ?", route: "/menu/victim-or-witness" },
	{ title: "Prévention", route: "/menu/prevention" },
	{ title: "Objets autorisés et interdits", route: "/menu/allowed-items" },
	{ title: "Infos billetterie", route: "/menu/ticket-info" },
	{ title: "Cashless", route: "/menu/cashless" },
	{ title: "Contact", route: "/menu/contact" },
];

const aPropos = [
	{ title: "L'histoire", route: null },
	{ title: "L'équipe", route: null },
	{ title: "Mentions légales", route: null },
	{ title: "CGU", route: null },
];

const MenuPage = (): React.JSX.Element => {
	return (
		<ScrollView style={styles.container}>
			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Infos pratiques</Text>
				<View style={styles.listContainer}>
					{infosPratiques.map((item) => (
						<TouchableOpacity
							key={item.title}
							style={styles.listItem}
							activeOpacity={0.7}
							onPress={() => router.push(item.route)}
						>
							<Text style={styles.listItemText}>{item.title}</Text>
							<Feather name="chevron-right" style={styles.chevron} />
						</TouchableOpacity>
					))}
				</View>
			</View>

			{/* Partner Banner */}
			<View style={styles.bannerContainer}>
				{/* Replace with <Image source={require('...')} /> if you have the banner */}
				<Text style={styles.bannerText}>
					<Text style={{ fontWeight: "bold" }}>ALBI PARTENAIRE OFFICIEL</Text>
					{"\n"}NOTRE VILLE VIBRE POUR SON FESTIVAL
				</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>À propos</Text>
				<View style={styles.listContainer}>
					{aPropos.map((item) => (
						<TouchableOpacity
							key={item.title}
							style={styles.listItem}
							activeOpacity={0.7}
							onPress={item.route ? () => router.push(item.route) : undefined}
						>
							<Text style={styles.listItemText}>{item.title}</Text>
							<Feather name="chevron-right" style={styles.chevron} />
						</TouchableOpacity>
					))}
				</View>
			</View>
		</ScrollView>
	);
};

export default MenuPage;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.primary,
	},
	section: {
		backgroundColor: "#e5e5e5",
		paddingVertical: 18,
		paddingHorizontal: 0,
		marginBottom: 10,
	},
	sectionTitle: {
		fontFamily: fonts.heading,
		fontSize: 22,
		fontWeight: "bold",
		color: colors.secondary,
		marginBottom: 10,
		marginLeft: 18,
	},
	listContainer: {
		backgroundColor: "#fff",
		borderRadius: 8,
		marginHorizontal: 10,
		overflow: "hidden",
	},
	listItem: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 18,
		paddingHorizontal: 18,
		borderBottomWidth: 1,
		borderBottomColor: "#ececec",
	},
	listItemText: {
		fontFamily: fonts.heading,
		fontSize: 17,
		color: "#111",
	},
	chevron: {
		color: "#222",
		fontSize: 22,
	},
	bannerContainer: {
		backgroundColor: "#fff",
		marginHorizontal: 10,
		marginBottom: 10,
		borderRadius: 8,
		alignItems: "center",
		padding: 16,
		borderWidth: 1,
		borderColor: "#e74c3c",
	},
	bannerText: {
		color: "#e74c3c",
		textAlign: "center",
		fontFamily: fonts.heading,
		fontSize: 16,
		lineHeight: 22,
	},
});
