// ============================================================================
// Enums
// ============================================================================

export enum SortDirection {
	ASC = 'ASC',
	DESC = 'DESC',
}

export enum Currency {
	EGP = 'EGP',
	USD = 'USD',
}

export enum BadgeTypes {
	gray = 'gray',
	warning = 'warning',
	blue = 'blue',
	success = 'success',
	error = 'error',
}

// ============================================================================
// Types
// ============================================================================

export type Option<T> = {
	label: string;
	value: T;
	color?: BadgeTypes;
};

export type MetaData = {
	page: number;
	page_size: number;
	last_page: number;
	total_records: number;
};

export type BaseTableVariables = {
	page: number;
	limit: number;
	search?: string;
	sort?: string;
	sort_dir?: SortDirection;
};

export type Response<T> = {
	status: number;
	data: T;
};

export type GetListResponse<T, M extends MetaData = MetaData> = {
	data: T[];
	_metadata: M;
};

export type BackendError = {
	message: string;
	errors?: Record<string, string[]>;
};
