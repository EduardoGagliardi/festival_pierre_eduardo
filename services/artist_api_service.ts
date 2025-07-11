import type Artist from "../models/artist";

class ArtistApiService {
	// récupérer un artiste par son slug
	public getArtistBySlug = async (
		slug: string,
	): Promise<Artist | undefined> => {
		const request = new Request(
			`http://192.168.1.188:3000/artists?slug=${slug}`,
		);
		const response = await fetch(request);
		const data = await response.json();

		return (data as Artist[]).shift();
	};
}

export default ArtistApiService;
