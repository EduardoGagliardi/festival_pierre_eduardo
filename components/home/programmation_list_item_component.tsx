import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type React from "react";
import {
	Image,
	Pressable,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { dbUrl } from "../../constants/api_constans";
import type ProgrammationListItemProps from "../../models/props/programmation_list_item_props";
import DateUtilsService from "../../services/date_utils_service";

const dateUtils = new DateUtilsService();

const ProgrammationListItemComponent: React.FC<ProgrammationListItemProps> = ({
	programme,
}) => {
	const { artist, day } = programme;
	const router = useRouter();
	if (!day) {
		return null;
	}
	const date = dateUtils.getFullDate(day.date);
	const imageUrl = `${dbUrl}/images/artists/${artist.poster}`;

	const handlePress = () => {
		router.push(`/artist/${artist.slug}`);
	};

	return (
		<Pressable
			onPress={handlePress}
			style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
		>
			<View style={styles.card}>
				<View style={styles.imageRow}>
					<View style={styles.imageContainer}>
						<Image source={{ uri: imageUrl }} style={styles.image} />
					</View>
					<TouchableOpacity style={styles.heartIcon}>
						<Feather name="heart" size={28} color="#fff" />
					</TouchableOpacity>
				</View>
				<Text style={styles.artistName}>{artist.name}</Text>
				<View style={styles.row}>
					<MaterialCommunityIcons name="music" size={16} color="#222" />
					<Text style={styles.musicType}>
						{artist.music_type ? artist.music_type.name : "Type inconnu"}
					</Text>
				</View>
				<View style={styles.row}>
					<Feather name="calendar" size={16} color="#222" />
					<Text
						style={styles.dateText}
					>{`${date.dayNameShort}. ${date.dayNumber}/${date.month}`}</Text>
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		marginRight: 16,
		width: 200,
		alignItems: "flex-start",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	imageRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "center",
		width: 200,
		position: "relative",
		marginBottom: 8,
	},
	imageContainer: {
		width: 100,
		height: 100,
		borderRadius: 50,
		overflow: "hidden",
		alignSelf: "center",
		position: "relative",
	},
	image: {
		width: "100%",
		height: "100%",
		borderRadius: 50,
	},
	heartIcon: {
		position: "relative",
		right: 20,
		backgroundColor: "rgba(0,0,0,0.3)",
		borderRadius: 16,
		padding: 2,
		zIndex: 2,
	},
	artistName: {
		fontWeight: "bold",
		fontSize: 18,
		marginBottom: 4,
		marginLeft: 2,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 2,
		marginLeft: 2,
	},
	musicType: {
		marginLeft: 6,
		fontSize: 15,
		color: "#222",
	},
	dateText: {
		marginLeft: 6,
		fontSize: 15,
		color: "#222",
	},
});

export default ProgrammationListItemComponent;
