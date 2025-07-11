import { Feather } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../constants/design_constants";
import type UserIconBtnProps from "../../models/props/user_icon_btn_props";

const UserIconBtnComponent = ({
	isHome,
}: UserIconBtnProps): React.JSX.Element => {
	return (
		<TouchableOpacity
			style={isHome ? stylesInHome.iconBtn : styles.iconBtn}
			onPress={() => console.log("user icon press")}
		>
			<Feather name="user" style={styles.icon} />
		</TouchableOpacity>
	);
};

export default UserIconBtnComponent;

const styles = StyleSheet.create({
	// une clé de l'objet équivaut à une classe CSS
	iconBtn: {
		width: 40,
		height: 40,
		backgroundColor: colors.primary,
		borderRadius: "50%",
		// la disposition flex est utilisée par défaut, en mode colonne par défaut
		justifyContent: "center",
		alignItems: "center",
		top: -1,
		right: 15,
	},
	icon: {
		fontSize: 20,
		// color: "red",
		// color: "#ff0000",
		// color: "#f00",
		// color: "rgb(255 0 0)",
		color: "rgba(255 255 255 / 1)",
	},
});

const stylesInHome = StyleSheet.create({
	iconBtn: {
		...styles.iconBtn,
		position: "absolute",
		top: 35,
		zIndex: 1,
	},
});
