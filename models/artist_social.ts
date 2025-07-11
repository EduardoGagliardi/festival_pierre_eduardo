import type Artist from "./artist";
import type Social from "./social";

type ArtistSocial = {
	id: number;
	artistId: number;
	socialId: number;
	url: string;
	artist: Artist;
	social: Social;
};

export default ArtistSocial;
