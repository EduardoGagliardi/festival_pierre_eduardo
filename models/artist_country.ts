import type Artist from "./artist";
import type Country from "./country";

type ArtistCountry = {
	id: number;
	artistId: number;
	countryId: number;
	country: Country;
	artist: Artist;
};

export default ArtistCountry;
