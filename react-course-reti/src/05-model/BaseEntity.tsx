
export interface BaseEntity {
	id: string;
}

export const GenerateId = () => {
	return Math.random().toString(36).substring(2, 7);
}