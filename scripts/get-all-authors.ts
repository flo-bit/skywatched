import fs from 'fs';

async function main() {
	const backendUrl = 'https://skywatched-jetstream.fly.dev';

	const response = await fetch(`${backendUrl}/api/author-dids`);
	const authorDids = await response.json();

	// save to file
	fs.writeFileSync('author-dids.json', JSON.stringify(authorDids, null, 2));

	console.log(authorDids);
}

main();
