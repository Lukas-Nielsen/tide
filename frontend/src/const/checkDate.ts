export const checkDate = (d: Date, m: number) => {
	const end = new Date();
	end.setDate(end.getDate() + m - 1);
	const start = new Date();
	start.setDate(start.getDate() - 1);

	return d.valueOf() >= start.valueOf() && d.valueOf() <= end.valueOf();
};

export const isToday = (d: string) =>
	new Date(d).toDateString() === new Date().toDateString();
