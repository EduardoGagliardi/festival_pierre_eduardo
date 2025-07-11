import type React from "react";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../../constants/design_constants";
import type CountDownState from "../../models/states/countdown_state";
import NumberUtilsService from "../../services/number_utils_service";

const CountDownComponent = (): React.JSX.Element => {
	// créer un état
	const [countDown, setCountDown] = useState<CountDownState>(
		{} as CountDownState,
	);

	// date d'aujourd'hui
	const now = new Date();

	// date future
	const eventDate = new Date("2025-07-15T14:00:00.000");

	// différence de millisecondes entres les deux dates
	const diffDate = eventDate.getTime() - now.getTime();

	// exécuter des actions à l'affichage du composant
	useEffect(
		() => {
			// calcul du compte à rebours
			const result: CountDownState = {
				days: new NumberUtilsService().addZero(
					Math.floor(diffDate / (1000 * 60 * 60 * 24)),
				),
				hours: new NumberUtilsService().addZero(
					Math.floor((diffDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
				),
				minutes: new NumberUtilsService().addZero(
					Math.floor((diffDate % (1000 * 60 * 60)) / (1000 * 60)),
				),
				seconds: new NumberUtilsService().addZero(
					Math.floor((diffDate % (1000 * 60)) / 1000),
				),
			};

			// timer
			const timer = setInterval(() => {
				// mise à jour de l'état
				setCountDown(result);
			}, 1000);

			// exécuter des actions au désaffichage du composant
			return () => {
				// arrêter le timer
				clearInterval(timer);
			};
		}, // un array vide déclenche des actions uniquement à l'affichage du composant, 1 seule fois
		[diffDate],
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Rendez-vous dans</Text>
			<View style={styles.columns}>
				<View style={styles.column}>
					<Text style={styles.value}>{countDown.days}</Text>
					<Text style={styles.label}>jours</Text>
				</View>
				<View style={styles.column}>
					<Text style={styles.value}>{countDown.hours}</Text>
					<Text style={styles.label}>heures</Text>
				</View>
				<View style={styles.column}>
					<Text style={styles.value}>{countDown.minutes}</Text>
					<Text style={styles.label}>minutes</Text>
				</View>
				<View style={styles.column}>
					<Text style={stylesVariant.value}>{countDown.seconds}</Text>
					<Text style={stylesVariant.label}>secondes</Text>
				</View>
			</View>
		</View>
	);
};

export default CountDownComponent;

const styles = StyleSheet.create({
	container: {
		marginBlockEnd: 30,
	},
	title: {
		fontFamily: fonts.body,
		fontSize: 16,
		textAlign: "center",
	},
	columns: {
		flexDirection: "row",
		justifyContent: "center",
		columnGap: 10,
	},
	column: {
		alignItems: "center",
	},
	value: {
		fontFamily: fonts.subtitle,
		fontSize: 30,
	},
	label: {
		fontFamily: fonts.body,
		textTransform: "uppercase",
		fontSize: 9,
	},
});

const stylesVariant = StyleSheet.create({
	value: {
		...styles.value,
		color: colors.ternary,
	},
	label: {
		...styles.label,
		color: colors.ternary,
	},
});
