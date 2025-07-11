import { dbUrl } from "../constants/api_constans";
import type ArtistSocial from "../models/artist_social";

class ArtistSocialApiService {
	// récupérer les réseaux sociaux d'un artiste par son id
	public getSocialsByArtistId = async (id: number): Promise<ArtistSocial[]> => {
		const request = new Request(
			`${dbUrl}/artists_socials?artistId=${id}`,
		);
		const response = await fetch(request);
		const data = await response.json();

		return data;
	};
}

export default ArtistSocialApiService;
