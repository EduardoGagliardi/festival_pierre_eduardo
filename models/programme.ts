import type Artist from "./artist";
import type Day from "./day";
import type Stage from "./stage";

type Programme = {
	id: number;
	artistId: number;
	stageId: number;
	dayId: number;
	time_start: string;
	time_end: string;
	artist: Artist;
	stage: Stage;
	day: Day;
};

export default Programme;
