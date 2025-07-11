import type MusicType from "./music_type";

type Artist = {
	id: number;
	music_typeId: number;
	slug: string;
	name: string;
	poster: string;
	description: string[];
	video: string;
	music_type: MusicType;
};

export default Artist;
