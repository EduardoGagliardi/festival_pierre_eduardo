import type ArtistCountry from "../models/artist_country";

class ArtistCountryApiService {
	// récupérer les pays d'un artiste par son id
	public getCountriesByArtistId = async (
		id: number,
	): Promise<ArtistCountry[]> => {
		const request = new Request(
			`http://192.168.1.188:3000/artists_countries?artistId=${id}`,
		);
		const response = await fetch(request);
		const data = await response.json();

		return data;
	};
}

export default ArtistCountryApiService;
