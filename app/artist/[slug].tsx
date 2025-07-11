import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageBackground } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
	Dimensions,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import YoutubePlayer from "react-native-youtube-iframe";
import ArtistProgrammationItemComponent from "../../components/artist/artist_programmation_item_component";
import ArtistSocialsItemComponent from "../../components/artist/artist_socials_item_component";
import { colors, fonts } from "../../constants/design_constants";
import StringUtilsService from "../../services/string_utils_service";

const API_URL = "http://192.168.1.188:3000";

const ArtistSlug = () => {
	const { slug } = useLocalSearchParams();
	console.log("slug param:", slug);

	const [artist, setArtist] = useState<any>(null);
	const [programmation, setProgrammation] = useState<any[]>([]);
	const [artistCountries, setArtistCountries] = useState<any[]>([]);
	const [artistSocials, setArtistSocials] = useState<any[]>([]);
	const [isFavorite, setIsFavorite] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);

	const setFavorite = useCallback(async (artistId?: string | number) => {
		if (!artistId) return;
		const favoritesRaw = await AsyncStorage.getItem("favorites");
		const favorites: number[] = favoritesRaw ? JSON.parse(favoritesRaw) : [];
		if (favorites.indexOf(Number(artistId)) !== -1) {
			setIsFavorite(true);
		} else {
			setIsFavorite(false);
		}
	}, []);

	const handleFavorite = async () => {
		if (!artist) return;
		setIsFavorite((prev) => !prev);
		const favoritesRaw = await AsyncStorage.getItem("favorites");
		const favorites: number[] = favoritesRaw ? JSON.parse(favoritesRaw) : [];
		if (favorites.indexOf(Number(artist.id)) === -1) {
			favorites.push(Number(artist.id));
		} else {
			favorites.splice(favorites.indexOf(Number(artist.id)), 1);
		}
		await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
	};

	useEffect(() => {
		const fetchData = async () => {
			const [
				artistsRes,
				programmationRes,
				daysRes,
				stagesRes,
				musicTypesRes,
				artistCountriesRes,
				artistSocialsRes,
			] = await Promise.all([
				fetch(`${API_URL}/artists`),
				fetch(`${API_URL}/programme`),
				fetch(`${API_URL}/days`),
				fetch(`${API_URL}/stages`),
				fetch(`${API_URL}/music_types`),
				fetch(`${API_URL}/artists_countries`),
				fetch(`${API_URL}/artists_socials`),
			]);
			const [
				artists,
				programme,
				days,
				stages,
				musicTypes,
				artistCountries,
				artistSocials,
			] = await Promise.all([
				artistsRes.json(),
				programmationRes.json(),
				daysRes.json(),
				stagesRes.json(),
				musicTypesRes.json(),
				artistCountriesRes.json(),
				artistSocialsRes.json(),
			]);

			// Find artist by slug
			const foundArtist = artists.find((a: any) => a.slug === slug);
			console.log("foundArtist:", foundArtist);
			if (!foundArtist) {
				console.log("foundArtist not found");
				setArtist(null);
				setLoading(false);
				return;
			}
			// Enrich artist with music_type
			foundArtist.music_type = musicTypes.find(
				(mt: any) => String(mt.id) === String(foundArtist.music_typeId),
			);
			setArtist(foundArtist);
			setFavorite(foundArtist.id);

			// Filter and enrich programmation for this artist
			const artistProgrammation = programme
				.filter((p: any) => String(p.artistId) === String(foundArtist.id))
				.map((p: any) => ({
					...p,
					day: days.find((d: any) => String(d.id) === String(p.dayId)),
					stage: stages.find((s: any) => String(s.id) === String(p.stageId)),
				}));
			setProgrammation(artistProgrammation);

			// Filter artist countries
			setArtistCountries(
				artistCountries.filter(
					(c: any) => String(c.artistId) === String(foundArtist.id),
				),
			);

			// Filter artist socials
			setArtistSocials(
				artistSocials.filter(
					(s: any) => String(s.artistId) === String(foundArtist.id),
				),
			);
			setLoading(false);
		};
		fetchData();
	}, [slug, setFavorite]);

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>Chargement...</Text>
			</View>
		);
	}
	if (!artist) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text>Artiste introuvable.</Text>
			</View>
		);
	}

	return (
		<GestureHandlerRootView>
			<View style={{ flex: 1 }}>
				<TouchableOpacity
					style={styles.closeIconBtn}
					onPress={() => router.back()}
				>
					<Feather name="x" style={styles.closeIcon} />
				</TouchableOpacity>
				<ScrollView>
					<View>
						<ImageBackground
							source={{
								uri: `http://192.168.1.188:3000/images/artists/${artist.poster}`,
							}}
							contentFit="cover"
							style={styles.poster}
						></ImageBackground>
						<View style={styles.artistMusicTypeContainer}>
							<Text style={styles.artist}>{artist?.name}</Text>
							<View style={styles.musicTypeContainer}>
								<Ionicons
									name="pricetag-outline"
									style={styles.musicTypeIcon}
								/>
								<Text style={styles.musicType}>
									{artist?.music_type ? artist.music_type.name : "Type inconnu"}
								</Text>
							</View>
						</View>
					</View>

					<View style={styles.programmationContainer}>
						<FlatList
							data={programmation}
							renderItem={(value) => (
								<ArtistProgrammationItemComponent
									programme={value.item}
									nbItems={programmation.length}
									index={value.index}
								/>
							)}
							horizontal
						/>
						<TouchableOpacity
							style={{
								...styles.favoriteIconBtn,
								backgroundColor: isFavorite
									? colors.ternary
									: "rgba(200 200 200 / 1)",
							}}
							onPress={handleFavorite}
						>
							<Feather name="heart" style={styles.favoriteIcon} />
						</TouchableOpacity>
					</View>
					<View style={styles.contentContainer}>
						<Text style={styles.countries}>
							{artistCountries.map((value) => value.country?.name).join(" / ")}
						</Text>
						<View style={styles.descriptionContainer}>
							{artist?.description?.map((value: string) => (
								<Text key={Math.random()} style={styles.description}>
									{value}
								</Text>
							))}
						</View>
						<View style={styles.videoContainer}>
							<YoutubePlayer
								height={215}
								videoId={new StringUtilsService().getYouTubeVideoId(
									artist?.video,
								)}
							/>
						</View>
						<View style={styles.socialsContainer}>
							{artistSocials.map((value) => (
								<ArtistSocialsItemComponent
									key={Math.random()}
									artistSocial={value}
								/>
							))}
						</View>
					</View>
				</ScrollView>
			</View>
		</GestureHandlerRootView>
	);
};

export default ArtistSlug;

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
	poster: {
		height: Dimensions.get("window").height * 0.5,
		opacity: 0.7,
		backgroundColor: colors.ternary,
		padding: 15,
		justifyContent: "flex-end",
	},
	artistMusicTypeContainer: {
		position: "absolute",
		left: 15,
		bottom: 15,
	},
	artist: {
		fontFamily: fonts.subtitle,
		fontSize: 42,
		color: "rgba(255 255 255 / 1)",
	},
	musicTypeContainer: {
		flexDirection: "row",
		alignItems: "center",
		columnGap: 5,
	},
	musicTypeIcon: {
		fontSize: 17,
		color: "rgba(255 255 255 / 1)",
	},
	musicType: {
		fontFamily: fonts.body,
		fontSize: 17,
		color: "rgba(255 255 255 / 1)",
	},
	programmationContainer: {
		padding: 15,
	},
	favoriteIconBtn: {
		width: 35,
		height: 35,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		top: 45,
		right: 30,
		zIndex: 1,
	},
	favoriteIcon: {
		color: "white",
		fontSize: 20,
	},
	contentContainer: {
		padding: 15,
	},
	countries: {
		fontFamily: fonts.body,
		fontSize: 15,
		color: colors.primary,
		marginBottom: 10,
	},
	descriptionContainer: {
		marginBottom: 10,
	},
	description: {
		fontFamily: fonts.body,
		fontSize: 15,
		color: colors.secondary,
		marginBottom: 5,
	},
	videoContainer: {
		marginBottom: 10,
	},
	socialsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
});
