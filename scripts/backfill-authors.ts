import fs from 'fs';

async function main() {
	// const backendUrl = 'http://127.0.0.1:3001';
	const backendUrl = 'https://skywatched-jetstream.fly.dev';

	// get all authors from "author-dids.json"
	const authorDids = JSON.parse(fs.readFileSync('author-dids.json', 'utf8'));

	console.log(authorDids);

	for (const authorDid of authorDids) {
		try {
			const response = await fetch(`${backendUrl}/api/refresh-user?did=${authorDid}`);
			const data = await response.json();
			console.log(data);
		} catch (error) {
			console.error(`Error refreshing user ${authorDid}:`, error);
		}

		// wait 1 second
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}

main();
