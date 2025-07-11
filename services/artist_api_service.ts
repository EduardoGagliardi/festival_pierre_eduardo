import { dbUrl } from "../constants/api_constans";
import type Artist from "../models/artist";

class ArtistApiService {
	// récupérer un artiste par son slug
	public getArtistBySlug = async (
		slug: string,
	): Promise<Artist | undefined> => {
		const request = new Request(
			`${dbUrl}/artists?slug=${slug}`,
		);
		const response = await fetch(request);
		const data = await response.json();

		return (data as Artist[]).shift();
	};
}

export default ArtistApiService;
