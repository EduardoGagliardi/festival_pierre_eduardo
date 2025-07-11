import type StageType from "./stage_type";

type Stage = {
	id: number;
	stage_typeId: number;
	slug: string;
	name: string;
	poster: string;
	description: string[];
	stage_type: StageType;
};

export default Stage;
