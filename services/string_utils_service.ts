class StringUtilsService {
	// raccourcir un texte
	public getTextOverflow = (value: string, limit: number = 10) => {
		if (value) {
			return value.length > limit ? `${value.substring(0, limit)}…` : value;
		}
	};

	// récupérer l'identifiant d'une vidéo YouTube à partir d'une URL YouTube
	public getYouTubeVideoId = (value: string) => {
		if (value) {
			return value.split("?v=")[1];
		}
	};
}

export default StringUtilsService;
