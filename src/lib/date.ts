import { format, isToday, isYesterday } from 'date-fns';

const dayFormat = 'yyyy-MM-dd';
const secondFormat = 'HH:mm:ss';

export interface FormatedDateTime {
	date: string;
	time: string;
}

export function parseFotmatedDate(from: Date) {
	return isToday(from)
		? 'Today'
		: isYesterday(from)
		? 'Yesterday'
		: format(from, dayFormat);
}

export function parseFormatedDateTime(from: Date) {
	return {
		date: parseFotmatedDate(from),
		time: format(from, secondFormat),
	};
}
