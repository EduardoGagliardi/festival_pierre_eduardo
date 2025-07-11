import type Artist from "../models/artist";
import type Day from "../models/day";
import type Programme from "../models/programme";
import type Stage from "../models/stage";

class ProgrammationApiService {
	// Fetch all programmation and join artist, stage, and day manually
	public getProgrammation = async (): Promise<Programme[]> => {
		// Fetch all programmes
		const programmesRes = await fetch("http://192.168.1.188:3000/programme");
		const programmes = await programmesRes.json();

		// Fetch all artists, stages, and days in parallel
		const [artistsRes, stagesRes, daysRes] = await Promise.all([
			fetch("http://192.168.1.188:3000/artists"),
			fetch("http://192.168.1.188:3000/stages"),
			fetch("http://192.168.1.188:3000/days"),
		]);
		const [artists, stages, days]: [Artist[], Stage[], Day[]] =
			await Promise.all([artistsRes.json(), stagesRes.json(), daysRes.json()]);

		// Merge the data
		const merged = programmes.map((programme: any) => ({
			...programme,
			artist: artists.find((a) => a.id === programme.artistId),
			stage: stages.find((s) => s.id === programme.stageId),
			day: days.find((d) => d.id === programme.dayId),
		}));

		return merged;
	};

	// Fetch programmation by artistId and join related data
	public getProgrammationByArtistId = async (
		id: number,
	): Promise<Programme[]> => {
		const programmesRes = await fetch(
			`http://192.168.1.188:3000/programme?artistId=${id}`,
		);
		const programmes = await programmesRes.json();

		const [artistsRes, stagesRes, daysRes] = await Promise.all([
			fetch("http://192.168.1.188:3000/artists"),
			fetch("http://192.168.1.188:3000/stages"),
			fetch("http://192.168.1.188:3000/days"),
		]);
		const [artists, stages, days]: [Artist[], Stage[], Day[]] =
			await Promise.all([artistsRes.json(), stagesRes.json(), daysRes.json()]);

		const merged = programmes.map((programme: any) => ({
			...programme,
			artist: artists.find((a) => a.id === programme.artistId),
			stage: stages.find((s) => s.id === programme.stageId),
			day: days.find((d) => d.id === programme.dayId),
		}));

		return merged;
	};
}

export default ProgrammationApiService;
