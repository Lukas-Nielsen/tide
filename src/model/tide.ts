export interface ITideDate {
	date: string;
	items: ITide[];
}

export interface ITide {
	state: TState;
	timestamp: string;
	height?: number;
}

export type TState = "H" | "N";

export const States: Record<TState, string> = {
	H: "highTide",
	N: "lowTide",
};
