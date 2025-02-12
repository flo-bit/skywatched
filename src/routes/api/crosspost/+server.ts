import { error, json, type RequestHandler } from '@sveltejs/kit';
import { AtpBaseClient, type BlobRef } from '@atproto/api';
import { TID } from '@atproto/common';
import { getRecordByUri } from '$lib/db';

import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import { REL_COLLECTION } from '$lib';

export const POST: RequestHandler = async ({ request, locals, fetch }) => {
	const user = locals.user;
	const agent = locals.agent;
	if (!user || !agent || agent instanceof AtpBaseClient) {
		console.log('unauthorized');
		return error(401, 'Unauthorized API call');
	}
	const body = await request.json();
	const uri = body.uri;
	const did = user.did;

	const [reviewDid, reviewCollection, reviewRkey] = uri.replace('at://', '').split('/');

	// check that user did is the same as the did in the uri
	if (reviewDid !== did || reviewCollection !== REL_COLLECTION) {
		return error(401, 'Unauthorized API call');
	}

	const imgResponse = await fetch(`/review/${encodeURIComponent(uri)}/og.png`);
	const imgBlob = await imgResponse.blob();

	const imgBuffer = await imgBlob.arrayBuffer();

	// save to file, with fs for debugging
	// fs.writeFileSync('og.png', Buffer.from(imgBuffer));

	const convertedImage = await imagemin.buffer(Buffer.from(imgBuffer), {
		plugins: [
			imageminWebp({
				quality: 100
			})
		]
	});

	// turn into blob
	const lossyImageBlob = new Blob([convertedImage], { type: 'image/webp' });

	const blobResponse = await agent.com.atproto.repo.uploadBlob(lossyImageBlob);
	const imgUri = blobResponse.data.blob;

	const reviewRecord = await getRecordByUri({ uri });

	const rkey = TID.nextStr();

	const rating = (reviewRecord.record.rating?.value ?? 0) / 2;

	const ratingText = `I rated "${reviewRecord.record.metadata?.title}" with ${rating} star${rating === 1 ? '' : 's'} on skywatched.app`;
	let text = reviewRecord.record.note?.value
		? `My review for "${reviewRecord.record.metadata?.title}" on skywatched.app:\n\n${reviewRecord.record.note?.value}`
		: ratingText;

	if (text.length > 299) {
		text = text.slice(0, 295) + '...';
	}

	// find all skywatched.app in text and add as facets with start and end indices
	const skywatchedFacets = text.matchAll(/skywatched\.app/g);

	const facets: {
		index: {
			byteStart: number;
			byteEnd: number;
		};
		features: {
			$type: 'app.bsky.richtext.facet#link';
			uri: string;
		}[];
	}[] = [];
	if (skywatchedFacets) {
		for (const facet of skywatchedFacets) {
			facets.push({
				index: {
					byteStart: facet.index,
					byteEnd: facet.index + 14
				},
				features: [{ $type: 'app.bsky.richtext.facet#link', uri: 'https://skywatched.app' }]
			});
		}
	}

	const record: {
		repo: string;
		collection: string;
		rkey: string;
		record: {
			$type: 'app.bsky.feed.post';
			createdAt: string;
			text: string;
			embed?: {
				$type: 'app.bsky.embed.external';
				external: {
					uri: string;
					thumb: BlobRef;
					title: string;
					description: string;
				};
			};
			facets?: {
				index: {
					byteStart: number;
					byteEnd: number;
				};
				features: {
					$type: 'app.bsky.richtext.facet#link';
					uri: string;
				}[];
			}[];
		};
	} = {
		repo: did,
		collection: 'app.bsky.feed.post',
		rkey,
		record: {
			$type: 'app.bsky.feed.post',
			createdAt: new Date().toISOString(),
			text: text,
			embed: {
				$type: 'app.bsky.embed.external',
				external: {
					uri: `https://skywatched.app/review/${encodeURIComponent(reviewRecord.uri)}`,
					thumb: imgUri,
					title: `${reviewRecord.record.note?.value ? 'Reviewed' : 'Rated'} "${reviewRecord.record.metadata?.title ?? ''}"`,
					description: ''
				}
			},
			facets
		}
	};

	// post to bluesky
	await agent.com.atproto.repo.putRecord(record);

	const crosspostUri = `at://${did}/app.bsky.feed.post/${rkey}`;

	const updatedRecord: {
		repo: string;
		collection: string;
		rkey: string;
		record: {
			item: {
				ref: string;
				value: string;
			};
			rating?: { value: number; createdAt: string };
			note?: {
				value: string;
				createdAt: string;
				updatedAt: string;
			};
			from?: string;
			crosspost?: {
				uri: string;
				likes?: number;
				reposts?: number;
				replies?: number;
			};
		};
	} = {
		repo: did,
		collection: REL_COLLECTION,
		rkey: reviewRkey,
		record: {
			item: reviewRecord.record.item,
			rating: reviewRecord.record.rating,
			from: 'skywatched',
			note: reviewRecord.record.note,
			crosspost: {
				uri: crosspostUri
			}
		}
	};

	// update the main record with the crosspost uri
	await agent.com.atproto.repo.putRecord(updatedRecord);

	return json({ status: 'rated' });
};
