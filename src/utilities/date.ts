import dayjs from 'dayjs';

import { DateFormatOptions } from '@/constants/dateFormats';

export const formatDate = (date: string | null | undefined, format: DateFormatOptions = DateFormatOptions.Payroll) => {
	if (!date) return '--';
	return dayjs(date).format(format);
};
