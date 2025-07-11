import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
	const [loaded] = useFonts({
		GelicaBlack: require("../assets/fonts/Gelica-Black.ttf"),
		ObviouslyCompressedSuper: require("../assets/fonts/Obviously-Compressed-Super.ttf"),
		ObviouslyCondensedSuper: require("../assets/fonts/Obviously-Condensed-Super.ttf"),
		ObviouslyMediumItalic: require("../assets/fonts/Obviously-Medium-Italic.ttf"),
		ParabolicaMedium: require("../assets/fonts/Parabolica-Medium.ttf"),
	});

	const checkFavorites = useCallback(async () => {
		const favorites = await AsyncStorage.getItem("favorites");

		if (!favorites) {
			await AsyncStorage.setItem("favorites", JSON.stringify([]));
		}
	}, []);

	useEffect(() => {
		checkFavorites();

		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded, checkFavorites]);

	if (!loaded) {
		return null;
	}

	// définir la liste des écrans et leur personnalisation
	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			{/* <Stack.Screen name="index" /> */}
			<Stack.Screen name="(tabs)" />
			<Stack.Screen
				name="artist/[slug]"
				options={{
					// animation permet de gérer les transitions entres écrans
					animation: "slide_from_bottom",
				}}
			/>
		</Stack>
	);
};

export default RootLayout;
