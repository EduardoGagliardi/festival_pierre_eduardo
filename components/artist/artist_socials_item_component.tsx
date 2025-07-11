import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "../../constants/design_constants";
import type ArtistSocialsItemProps from "../../models/props/artist_socials_item_props";

const ArtistSocialsItemComponent = ({
	artistSocial,
}: ArtistSocialsItemProps): React.JSX.Element | null => {
	if (!artistSocial?.social) {
		return null;
	}
	return (
		<TouchableOpacity
			key={Math.random()}
			style={styles.iconBtn}
			onPress={() => router.navigate(artistSocial.url)}
		>
			<FontAwesome6 name={artistSocial.social.slug} style={styles.icon} />
		</TouchableOpacity>
	);
};

export default ArtistSocialsItemComponent;

const styles = StyleSheet.create({
	iconBtn: {
		width: 50,
		height: 50,
		backgroundColor: colors.ternary,
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},
	icon: {
		fontSize: 20,
		color: "rgba(255 255 255 /1)",
	},
});
