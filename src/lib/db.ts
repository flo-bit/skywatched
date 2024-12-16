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
		};
	};
};

export async function getRecentRecordOfUser({ did }: { did: string }): Promise<MainRecord[]> {
	const response = await fetch(
		`https://skywatched-jetstream.fly.dev/api/recent-records-by-user?did=${did}`
	);
	const data = await response.json();
	return data;
}

export async function getRecentRecords(): Promise<MainRecord[]> {
	const response = await fetch(`https://skywatched-jetstream.fly.dev/api/most-recent-records`);
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
		`https://skywatched-jetstream.fly.dev/api/recent-records-by-item?ref=${ref}&value=${value}`
	);
	console.log(
		`https://skywatched-jetstream.fly.dev/api/recent-records-by-item?ref=${ref}&value=${value}`
	);
	const data = await response.json();
	return data;
}

export async function getRecordByUri({ uri }: { uri: string }): Promise<MainRecord> {
	const response = await fetch(`https://skywatched-jetstream.fly.dev/api/record?uri=${uri}`);
	const data = await response.json();
	return data;
}
