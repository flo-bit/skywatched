import { env } from '$env/dynamic/private';

export type MainRecord = {
	uri: string;
	cid: string;

	author: {
		did: string;
		handle: string;
		displayName?: string;
		avatar?: string;
	};

	indexedAt: string;
	createdAt: string;
	updatedAt: string;

	record: {
		$type: string;
		item: {
			ref: string;
			value: string;
		};
		note?: {
			value: string;
			createdAt: string;
			updatedAt: string;
		};
		rating?: {
			value: number;
			createdAt: string;
		};
		metadata?: {
			title: string;
			poster_path: string;
			backdrop_path: string;
			tagline: string;
			overview: string;
			genres: string[];
			release_date?: string;
		};
		crosspost?: {
			uri: string;
			likes?: number;
			reposts?: number;
			replies?: number;
		};

		likes?: number;
	};
};

export async function getRecentRecordOfUser({ did }: { did: string }): Promise<MainRecord[]> {
	const response = await fetch(`${env.BACKEND_URL}/api/recent-records-by-user?did=${did}`);
	const data = await response.json();
	return data;
}

export async function getRecentRecords(): Promise<MainRecord[]> {
	const response = await fetch(`${env.BACKEND_URL}/api/most-recent-records?limit=50`);
	const data = await response.json();
	return data;
}

export async function getRecentRecordsForItem({
	ref,
	value
}: {
	ref: string;
	value: string;
}): Promise<MainRecord[]> {
	const response = await fetch(
		`${env.BACKEND_URL}/api/recent-records-by-item?ref=${ref}&value=${value}`
	);
	const data = await response.json();
	return data;
}

export async function getRecordByUri({ uri }: { uri: string }): Promise<MainRecord> {
	const response = await fetch(`${env.BACKEND_URL}/api/record?uri=${uri}`);
	const data = await response.json();
	return data;
}
export async function getAuthorDids(): Promise<string[]> {
	const response = await fetch(`${env.BACKEND_URL}/api/author-dids`);
	const data = await response.json();
	return data;
}
