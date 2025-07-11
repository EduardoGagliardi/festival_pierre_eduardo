import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createHash } from "crypto"; // Add at the top if available, otherwise use a simple hash function below
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

// Add a simple hash function for fallback
function simpleHash(str: string): string {
	let hash = 0;
	let chr: number;
	if (str.length === 0) return hash.toString();
	for (let i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0;
	}
	return hash.toString();
}

const ArtistSlug = () => {
	const { slug }: { slug?: string | string[] } = useLocalSearchParams();
	const slugValue = Array.isArray(slug) ? slug[0] : slug;

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
				socialsRes, // <-- add this
			] = await Promise.all([
				fetch(`${API_URL}/artists`),
				fetch(`${API_URL}/programme`),
				fetch(`${API_URL}/days`),
				fetch(`${API_URL}/stages`),
				fetch(`${API_URL}/music_types`),
				fetch(`${API_URL}/artists_countries`),
				fetch(`${API_URL}/artists_socials`),
				fetch(`${API_URL}/socials`), // <-- add this
			]);
			const [
				artists,
				programme,
				days,
				stages,
				musicTypes,
				artistCountries,
				artistSocials,
				socials, // <-- add this
			] = await Promise.all([
				artistsRes.json(),
				programmationRes.json(),
				daysRes.json(),
				stagesRes.json(),
				musicTypesRes.json(),
				artistCountriesRes.json(),
				artistSocialsRes.json(),
				socialsRes.json(), // <-- add this
			]);

			// Find artist by slug
			const foundArtist = artists.find((a: any) => a.slug === slugValue);
			if (!foundArtist) {
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

			// Filter artist socials and join with socials
			setArtistSocials(
				artistSocials
					.filter((s: any) => String(s.artistId) === String(foundArtist.id))
					.map((s: any) => ({
						...s,
						social: socials.find(
							(soc: any) => String(soc.id) === String(s.socialId),
						),
					})),
			);
			setLoading(false);
		};
		fetchData();
	}, [slugValue, setFavorite]);

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

	// Use only the first programmation entry for the card
	const mainProg = programmation[0];
	let dateObj: Date | undefined;
	let dayName: string | undefined;
	let dayNumber: string | undefined;
	let monthName: string | undefined;
	if (mainProg && mainProg.day) {
		dateObj = new Date(mainProg.day.date);
		dayName = dateObj.toLocaleDateString("fr-FR", { weekday: "long" });
		dayNumber = dateObj.getDate().toString().padStart(2, "0");
		monthName = dateObj.toLocaleDateString("fr-FR", { month: "long" });
	}

	return (
		<GestureHandlerRootView>
			<View style={{ flex: 1, backgroundColor: "#ededed" }}>
				<TouchableOpacity
					style={styles.closeIconBtn}
					onPress={() => router.back()}
				>
					<Feather name="x" style={styles.closeIcon} />
				</TouchableOpacity>
				<ScrollView>
					{/* Artist image with pink overlay and text */}
					<View style={{ position: "relative" }}>
						<ImageBackground
							source={{
								uri: `${API_URL}/images/artists/${artist.poster}`,
							}}
							style={{
								width: "100%",
								height: 450,
								justifyContent: "flex-end",
								marginBottom: 24,
							}}
							imageStyle={{ resizeMode: "contain" }}
						>
							<View
								style={{
									...StyleSheet.absoluteFillObject,
									backgroundColor: "rgba(200,0,100,0.25)",
									borderBottomLeftRadius: 0,
									borderBottomRightRadius: 0,
								}}
							/>
							<View style={{ padding: 24, paddingBottom: 32 }}>
								<Text
									style={{
										fontFamily: fonts.subtitle,
										fontSize: 36,
										color: "#fff",
										fontWeight: "bold",
										marginBottom: 4,
									}}
								>
									{artist.name}
								</Text>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Feather name="music" size={18} color="#fff" />
									<Text style={{ color: "#fff", fontSize: 18, marginLeft: 8 }}>
										{artist.music_type
											? artist.music_type.name
											: "Type inconnu"}
									</Text>
								</View>
							</View>
						</ImageBackground>
					</View>

					{/* Programmation card */}
					{mainProg && mainProg.day && (
						<View
							style={{
								backgroundColor: "#fff",
								borderRadius: 12,
								marginHorizontal: 16,
								marginTop: -40,
								marginBottom: 24,
								padding: 18,
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.08,
								shadowRadius: 4,
								elevation: 2,
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<View style={{ flex: 1 }}>
								<Text
									style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}
								>
									{dayName && dayNumber && monthName
										? `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNumber} ${monthName}`
										: ""}
								</Text>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										marginBottom: 4,
									}}
								>
									<Feather name="clock" size={16} color="#222" />
									<Text style={{ marginLeft: 6, fontSize: 16 }}>
										{mainProg.time_start} → {mainProg.time_end}
									</Text>
								</View>
								<View style={{ flexDirection: "row", alignItems: "center" }}>
									<Feather name="map-pin" size={16} color="#222" />
									<Text style={{ marginLeft: 6, fontSize: 16 }}>
										{mainProg.stage ? mainProg.stage.name : ""}
									</Text>
								</View>
							</View>
							<TouchableOpacity
								style={{
									marginLeft: 12,
									backgroundColor: "#eee",
									borderRadius: 20,
									padding: 6,
								}}
							>
								<Feather name="heart" size={24} color="#b0b0b0" />
							</TouchableOpacity>
						</View>
					)}

					{/* Country and Description, Video */}
					<View
						style={{
							backgroundColor: "#ededed",
							paddingHorizontal: 16,
							paddingTop: 8,
							paddingBottom: 24,
						}}
					>
						{artistCountries.length > 0 && (
							<Text
								style={{
									color: "#e24ca0",
									fontWeight: "bold",
									fontSize: 18,
									marginBottom: 8,
								}}
							>
								{artistCountries
									.map((value) => value.country?.name)
									.join(" / ")}
							</Text>
						)}
						<View style={{ marginBottom: 10 }}>
							{artist?.description?.map((value: string) => (
								<Text
									key={simpleHash(value)}
									style={{
										fontSize: 15,
										color: "#222",
										marginBottom: 10,
										lineHeight: 22,
									}}
								>
									{value}
								</Text>
							))}
						</View>
						{/* Video */}
						{artist.video && (
							<View style={{ alignItems: "center", marginVertical: 16 }}>
								<YoutubePlayer
									height={210}
									width={340}
									videoId={new StringUtilsService().getYouTubeVideoId(
										artist.video,
									)}
									webViewStyle={{ borderRadius: 12, overflow: "hidden" }}
								/>
							</View>
						)}
					</View>
					{/* Socials at the very end */}
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							gap: 16,
							marginTop: 8,
							marginBottom: 24,
						}}
					>
						{artistSocials.map(
							(value) =>
								value.social && (
									<TouchableOpacity
										key={value.social.slug}
										style={{
											width: 50,
											height: 50,
											backgroundColor: "#e24ca0",
											justifyContent: "center",
											alignItems: "center",
											borderRadius: 8,
											marginHorizontal: 4,
										}}
										onPress={() => value.url && router.navigate(value.url)}
									>
										<FontAwesome6
											name={value.social.slug}
											size={24}
											color="#fff"
										/>
									</TouchableOpacity>
								),
						)}
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
