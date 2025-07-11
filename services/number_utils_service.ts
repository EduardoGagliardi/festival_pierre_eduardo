class NumberUtilsService {
	// ajouter un zéro si le chiffre est inférieur à 10
	public addZero = (value: number): number | string => {
		return value < 10 ? `0${value}` : value;
	};
}

export default NumberUtilsService;
