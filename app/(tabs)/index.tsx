import { Image, ImageBackground } from "expo-image";
import type React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import {
	GestureHandlerRootView,
	ScrollView,
} from "react-native-gesture-handler";
import CountDownComponent from "../../components/home/countdown_component";
import ProgrammationListComponent from "../../components/home/programmation_list_component";
import UserIconBtnComponent from "../../components/shared/user_icon_btn_component";

/*
	créer un composant :
		- un composant est une fonction JS exportée
		- le nom des composants sont capitalisés
		- return définit les éléments affichés dans le composant
		- exporter le composant
*/
const HomeScreen = (): React.JSX.Element => {
	return (
		// GestureHandlerRootView permet le défilement d'un écran
		<GestureHandlerRootView>
			{/* View équivaut à un div en HTML */}
			<View>
				{/* la props isHome permet de savoir si l'icône est affichée sur l'écran d'accueil */}
				<UserIconBtnComponent isHome />
				<ImageBackground
					source={require("../../assets/images/prog-globale-web-fond-03-scaled.jpg")}
					// contentFit équivaut à object-fit en CSS
					contentFit="cover"
					style={styles.imgBg}
				>
					{/* logo */}
					<Image
						source={require("../../assets/images/LOGO-PG-2025-couleur.png")}
						contentFit="contain"
						style={styles.logo}
					/>
					{/* foule */}
					<Image
						source={require("../../assets/images/480648993_1152406629587252_299510857718669656_n.png")}
						contentFit="contain"
						style={styles.crowd}
					/>
				</ImageBackground>
				{/* ScrollView : contenu défilant */}
				<ScrollView>
					<ImageBackground
						source={require("../../assets/images/DECHIRE-GRIS-SIMPLE.png")}
						contentFit="fill"
						style={styles.scrollContainer}
					>
						{/* compte à rebours */}
						<CountDownComponent />

						{/* programmation */}
						<ProgrammationListComponent />
					</ImageBackground>
				</ScrollView>
			</View>
		</GestureHandlerRootView>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	imgBg: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height * 0.7,
		position: "absolute",
		top: 0,
		left: 0,
	},
	logo: {
		width: 300,
		height: 400,
		position: "absolute",
		top: Dimensions.get("window").height * 0.2,
		left: Dimensions.get("window").width / 2 - 300 / 2,
	},
	crowd: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height * 0.15,
		position: "absolute",
		top: Dimensions.get("window").height * 0.2 + 350,
	},
	scrollContainer: {
		paddingBlockStart: 30,
		marginBlockStart: Dimensions.get("window").height * 0.7,
	},
});
