
import WebSocket from 'ws';
import { backfillUserIfNecessary, createRecord, recreateTables, getLatestTimestamp, MainRecord, saveLikeToDatabase, setLatestTimestamp } from './database';
import { getFormattedDetails } from './tmdb';
import { getProfile } from './atp';

function printTimestamp(timestamp: number) {
    const time = new Date(timestamp / 1_000).toISOString();
    console.log('Timestamp:', time);
}

// Function to calculate microseconds
function secondsToMicroseconds(seconds: number) {
    return Math.floor(seconds * 1_000_000);
}

let currentTimestamp: number = 0;
let lastPrintedTimestamp: number = 0;

// Function to start the WebSocket connection
function startWebSocket(cursor: number) {
    const url = `wss://jetstream2.us-east.bsky.network/subscribe?wantedCollections=my.skylights.rel&wantedCollections=community.lexicon.interaction.like&cursor=${cursor}`;

    const ws = new WebSocket(url);

    ws.onopen = () => {
        console.log('Connected to WebSocket');
    };

    ws.onmessage = (event) => {
        const data = event.data as string;
        const json = JSON.parse(data.toString());

		if(json.kind === 'commit' && json.commit.collection === 'my.skylights.rel' && json.commit.operation === 'create') {
			saveRatingToDatabase(json);
		}

		if(json.kind === 'commit' && json.commit.collection === 'community.lexicon.interaction.like' && json.commit.operation === 'create') {			
			saveLike(json);
		}

		if(!lastPrintedTimestamp || lastPrintedTimestamp < json.time_us - secondsToMicroseconds(60)) {
			lastPrintedTimestamp = json.time_us;
			printTimestamp(lastPrintedTimestamp);

			setLatestTimestamp(new Date(lastPrintedTimestamp / 1_000).toISOString());
		}
    };

    ws.onerror = (event: any) => {
        console.error('WebSocket error:', event.message);
        reconnectWebSocket();
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
        reconnectWebSocket();
    };
}

async function saveRatingToDatabase(json: any) {
	if(json.commit.record.item.ref !== 'tmdb:s' && json.commit.record.item.ref !== 'tmdb:m') {
		return;
	}

	setLatestTimestamp(new Date(json.time_us / 1_000).toISOString());

	await backfillUserIfNecessary(json.did);

	let item = {
		ref: json.commit.record.item.ref,
		value: json.commit.record.item.value,
	}

	const details = await getFormattedDetails(item.value, item.ref);

	const timestamp = new Date(json.time_us / 1_000).toISOString();

	const author = await getProfile({ did: json.did });

	const record: MainRecord = {
		uri: `at://${json.did}/${json.commit.collection}/${json.commit.rkey}`,
		cid: json.commit.cid,

		author: {
			did: json.did,
			handle: author.handle,
			displayName: author.displayName,
			avatar: author.avatar,
		},

		indexedAt: timestamp,
		createdAt: json.commit.record.rating.createdAt ?? json.commit.record.note.createdAt ?? timestamp,
		updatedAt: json.commit.record.rating.createdAt ?? json.commit.record.note.createdAt ?? timestamp,

		record: {
			$type: json.commit.collection,
			metadata: details,
			item,
			rating: {
				value: json.commit.record.rating.value,
				createdAt: json.commit.record.rating.createdAt,
			},
		}
	}

	if(json.commit.record.note?.value) {
		record.record.note = {
			value: json.commit.record.note.value,
			createdAt: json.commit.record.note.createdAt,
			updatedAt: json.commit.record.note.createdAt,
		}
	}
	try {
		createRecord(record);
	} catch(e: any) {
		if(e.code === "SQLITE_CONSTRAINT_PRIMARYKEY") {
			console.log("not saving record, already exists", record.uri);
		} else {
			console.error("FAILED TO SAVE RECORD", e.code);
		}
	}
}

async function saveLike(json: any) {
	// get uri
	const uri = json.commit.record.subject.uri;
	// split into did, collection, rkey
	const [did, collection, rkey] = uri.replace('at://', '').split('/');

	if(collection !== 'my.skylights.rel') return;

	// make sure we have the post that is being liked
	await backfillUserIfNecessary(did);

	saveLikeToDatabase({
		author_did: json.did,
		subject_cid: json.commit.record.subject.cid,
		subject_uri: json.commit.record.subject.uri,
		createdAt: json.commit.record.createdAt,
	});
}

// Function to reconnect WebSocket with an optional delay
function reconnectWebSocket(delay = 5000) {
    console.log(`Reconnecting WebSocket in ${delay / 1000} seconds...`);
    printTimestamp(currentTimestamp);

    setTimeout(() => startWebSocket(currentTimestamp), delay);
}


export async function startJetstream() {
	const nowMS = Date.now();
    const oneMinuteAgoMS =
        nowMS - 1 * 60 * 1000;

    let lastTimestamp = await getLatestTimestamp();
	console.log('Last timestamp:', lastTimestamp);

	const currentStartTime = lastTimestamp ? new Date(lastTimestamp) : new Date(oneMinuteAgoMS);

	currentTimestamp = currentStartTime.getTime() * 1000;
	console.log('Using timestamp', currentTimestamp);
	printTimestamp(currentTimestamp);

	startWebSocket(currentTimestamp);
} 