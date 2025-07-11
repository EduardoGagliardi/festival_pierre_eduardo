import type React from "react";
import { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	View,
} from "react-native";
import ProgrammationListItemComponent from "./programmation_list_item_component";

const API_URL = "http://192.168.1.188:3000";

const ProgrammationListComponent: React.FC = () => {
	const [programmation, setProgrammation] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch all data in parallel
				const [programmeRes, artistsRes, stagesRes, daysRes, musicTypesRes] =
					await Promise.all([
						fetch(`${API_URL}/programme`),
						fetch(`${API_URL}/artists`),
						fetch(`${API_URL}/stages`),
						fetch(`${API_URL}/days`),
						fetch(`${API_URL}/music_types`),
					]);
				const [programme, artists, stages, days, musicTypes] =
					await Promise.all([
						programmeRes.json(),
						artistsRes.json(),
						stagesRes.json(),
						daysRes.json(),
						musicTypesRes.json(),
					]);

				// Enrich artists with music_type
				const artistsWithMusicType = artists.map((artist: any) => ({
					...artist,
					music_type: musicTypes.find(
						(mt: any) => String(mt.id) === String(artist.music_typeId),
					),
				}));

				// Merge data
				const merged = programme.map((item: any) => ({
					...item,
					artist: artistsWithMusicType.find(
						(a: any) => String(a.id) === String(item.artistId),
					),
					stage: stages.find((s: any) => String(s.id) === String(item.stageId)),
					day: days.find((d: any) => String(d.id) === String(item.dayId)),
				}));

				setProgrammation(merged);
			} catch (err) {
				setError("Erreur lors du chargement de la programmation.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	if (loading) {
		return <ActivityIndicator size="large" style={{ marginTop: 32 }} />;
	}

	if (error) {
		return <Text style={{ color: "red", margin: 16 }}>{error}</Text>;
	}

	if (programmation.filter((item) => item.day).length === 0) {
		return (
			<Text style={{ margin: 16 }}>Aucune programmation valide trouvée.</Text>
		);
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={programmation.filter((item) => item.day)}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<ProgrammationListItemComponent programme={item} />
				)}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ paddingHorizontal: 8 }}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginTop: 16,
		marginBottom: 16,
	},
});

export default ProgrammationListComponent;
