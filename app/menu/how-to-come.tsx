import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
	Image,
	ImageBackground,
	LayoutAnimation,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	UIManager,
	View,
} from "react-native";
import { colors, fonts } from "../../constants/design_constants";

// Enable LayoutAnimation on Android
if (
	Platform.OS === "android" &&
	UIManager.setLayoutAnimationEnabledExperimental
) {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SECTIONS = [
	{
		title: "À pied",
		content:
			"Le festival est à 20 minutes à pied du centre-ville. Vous arriverez directement à l’entrée du site en passant par la rue de Lamothe.",
	},
	{
		title: "À vélo ou à moto",
		content:
			"Et si vous veniez au festival à vélo ?\n\nVenir à vélo, c’est nous aider à réduire l’impact carbone du festival, et ça évite de se retrouver dans les bouchons !\n\nUn parking deux roues gratuit et gardienné est situé au plus près de l’entrée du festival.\nDu matériel de réparation est prévu en cas de besoin.\nConsigne gratuite à l’entrée du festival pour déposer son casque.\n\nL’association Vélocratie vous propose chaque jour des convois collectifs pour rejoindre le site de Pratgraussals !\nUne belle occasion de partager un moment avec d’autres festivalier.ère.s. tout en parcourant le centre-ville d’Albi.\n\nDépart tous les jours à 18h20 de la Gare SNCF Albi-Ville\nArrêt à 18h30 place du Vigan (devant Bouchara)\nArrivée à 18h45 au parking vélo du Festival\nDIMANCHE : HORAIRES AVANCÉS D’UNE HEURE\n\nEn partenariat avec AXA Assurance Albi Baures et Saunal et l’association Vélocratie.",
	},
	{ title: "En bus LIO", content: "Infos pour venir en bus LIO." },
	{ title: "En train", content: "Infos pour venir en train." },
	{
		title: "En voiture / covoiturage",
		content: "Infos pour venir en voiture ou covoiturage.",
	},
];

export default function HowToCome() {
	const [openSections, setOpenSections] = useState<number[]>([]);

	const toggleSection = (idx: number) => {
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setOpenSections((prev) =>
			prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
		);
	};

	return (
		<View style={{ flex: 1, backgroundColor: "#ededed" }}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.headerIconBtn}
				>
					<Feather name="arrow-left" size={24} color="#222" />
				</TouchableOpacity>
				<Image
					source={require("../../assets/images/LOGO-PG-2025-couleur.png")}
					style={styles.logo}
					resizeMode="contain"
				/>
				<TouchableOpacity style={styles.headerIconBtn}>
					<Feather name="user" size={24} color="#222" />
				</TouchableOpacity>
			</View>

			<ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
				{/* Background image with overlay and title */}
				<ImageBackground
					source={require("../../assets/images/velo.png")}
					style={styles.bgImage}
				>
					<View style={styles.overlay} />
					<Text style={styles.bgTitle}>Comment venir ?</Text>
				</ImageBackground>

				{/* Collapsible sections */}
				<View style={styles.sectionsContainer}>
					{SECTIONS.map((section, idx) => (
						<View key={section.title}>
							<TouchableOpacity
								style={styles.sectionHeader}
								onPress={() => toggleSection(idx)}
								activeOpacity={0.8}
							>
								<Text style={styles.sectionTitle}>{section.title}</Text>
								<Feather
									name={
										openSections.includes(idx) ? "chevron-up" : "chevron-down"
									}
									size={22}
									color="#222"
								/>
							</TouchableOpacity>
							{openSections.includes(idx) && (
								<View style={styles.sectionContent}>
									<Text style={styles.sectionText}>{section.content}</Text>
								</View>
							)}
						</View>
					))}
				</View>

				{/* Banner image */}
				<Image
					source={require("../../assets/images/27839514-diaporama.png")}
					style={styles.banner}
					resizeMode="contain"
				/>

				{/* Explanatory text */}
				<View style={styles.textContainer}>
					<Text style={styles.infoText}>
						Les transports représentent plus de 70% de l'empreinte carbone des
						festivals.{"\n"}
						La mobilité est donc un levier sur lequel nous pouvons agir ensemble
						! Le moyen de transport que vous utilisez pour rejoindre le festival
						a un réel impact. La voiture est souvent considérée comme l'option
						la plus pratique, mais ce n'est pas forcément le cas.
					</Text>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingTop: 32,
		paddingHorizontal: 16,
		backgroundColor: colors.primary,
		height: 70,
	},
	headerIconBtn: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
		elevation: 2,
	},
	logo: {
		height: 38,
		width: 120,
	},
	bgImage: {
		width: "100%",
		height: 200,
		justifyContent: "flex-end",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.25)",
	},
	bgTitle: {
		fontFamily: fonts.subtitle,
		fontSize: 32,
		color: "#fff",
		fontWeight: "bold",
		textAlign: "left",
		margin: 16,
		marginBottom: 12,
		textShadowColor: "rgba(0,0,0,0.3)",
		textShadowOffset: { width: 1, height: 2 },
		textShadowRadius: 4,
	},
	sectionsContainer: {
		backgroundColor: "#fff",
		borderRadius: 12,
		marginHorizontal: 12,
		marginTop: 12,
		paddingVertical: 8,
		paddingHorizontal: 0,
		elevation: 2,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 18,
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#eee",
	},
	sectionTitle: {
		fontFamily: fonts.subtitle,
		fontSize: 20,
		color: "#111",
		fontWeight: "bold",
	},
	sectionContent: {
		paddingHorizontal: 18,
		paddingBottom: 14,
		backgroundColor: "#fafafa",
	},
	sectionText: {
		fontFamily: fonts.body,
		fontSize: 15,
		color: colors.secondary,
		lineHeight: 22,
	},
	banner: {
		width: "100%",
		height: 70,
		marginTop: 18,
		marginBottom: 8,
	},
	textContainer: {
		marginHorizontal: 16,
		marginTop: 8,
	},
	infoText: {
		fontFamily: fonts.body,
		fontSize: 15,
		color: colors.secondary,
		lineHeight: 22,
	},
});
