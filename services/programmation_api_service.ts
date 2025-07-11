import { dbUrl } from "../constants/api_constans";
import type Artist from "../models/artist";
import type Day from "../models/day";
import type Programme from "../models/programme";
import type Stage from "../models/stage";

class ProgrammationApiService {
	// Fetch all programmation and join artist, stage, and day manually
	public getProgrammation = async (): Promise<Programme[]> => {
		// Fetch all programmes
		const programmesRes = await fetch(`${dbUrl}/programme`);
		const programmes = await programmesRes.json();

		// Fetch all artists, stages, and days in parallel
		const [artistsRes, stagesRes, daysRes] = await Promise.all([
			fetch(`${dbUrl}/artists`),
			fetch(`${dbUrl}/stages`),
			fetch(`${dbUrl}/days`),
		]);
		const [artists, stages, days]: [Artist[], Stage[], Day[]] =
			await Promise.all([artistsRes.json(), stagesRes.json(), daysRes.json()]);

		// Merge the data
		const merged = programmes.map((programme: any) => ({
			...programme,
			id: Number(programme.id),
			artistId: Number(programme.artistId),
			stageId: Number(programme.stageId),
			dayId: Number(programme.dayId),
			artist: artists.find((a) => Number(a.id) === Number(programme.artistId)),
			stage: stages.find((s) => Number(s.id) === Number(programme.stageId)),
			day: days.find((d) => Number(d.id) === Number(programme.dayId)),
		}));

		return merged;
	};

	// Fetch programmation by artistId and join related data
	public getProgrammationByArtistId = async (
		id: number,
	): Promise<Programme[]> => {
		const programmesRes = await fetch(
			`${dbUrl}/programme?artistId=${id}`,
		);
		const programmes = await programmesRes.json();

		const [artistsRes, stagesRes, daysRes] = await Promise.all([
			fetch(`${dbUrl}/artists`),
			fetch(`${dbUrl}/stages`),
			fetch(`${dbUrl}/days`),
		]);
		const [artists, stages, days]: [Artist[], Stage[], Day[]] =
			await Promise.all([artistsRes.json(), stagesRes.json(), daysRes.json()]);

		const merged = programmes.map((programme: any) => ({
			...programme,
			id: Number(programme.id),
			artistId: Number(programme.artistId),
			stageId: Number(programme.stageId),
			dayId: Number(programme.dayId),
			artist: artists.find((a) => Number(a.id) === Number(programme.artistId)),
			stage: stages.find((s) => Number(s.id) === Number(programme.stageId)),
			day: days.find((d) => Number(d.id) === Number(programme.dayId)),
		}));

		return merged;
	};
}

export default ProgrammationApiService;
