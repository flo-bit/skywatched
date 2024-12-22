// src/routes/og/+server.ts
import { getRecordByUri, type MainRecord } from '$lib/db';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import { error, type RequestHandler } from '@sveltejs/kit';

const template = (data: MainRecord) => {
	return `
<div tw="bg-zinc-900 flex w-full h-full items-center justify-center">

	<div tw="flex absolute bottom-0 left-0 right-0 top-0 bg-sky-400">
		<img src="https://image.tmdb.org/t/p/w780${data.record.metadata?.backdrop_path}" alt="" class="flex h-full w-full rounded-xl opacity-50" />

		<div tw="flex absolute h-full w-full bg-black/80">
		</div>
	</div>
    <div tw="flex flex-row w-full py-12 px-4 items-center justify-start p-8">
		<div tw="flex h-auto aspect-[3/2] w-82">
			<img src="https://image.tmdb.org/t/p/w500${data.record.metadata?.poster_path}" alt="" 
			class="flex h-full w-full rounded-xl border-2 border-zinc-800" style="border-radius: 16px; border-width: 1px; border-color: #3f3f46;" />
		</div>

        <h2 tw="flex flex-col text-7xl font-bold text-zinc-100 text-left px-8 max-w-3xl">
            <span tw="flex tracking-tight">${data.record.metadata?.title}</span>
        </h2>
    </div>
</div>`;
};

const host = import.meta.env.DEV ? 'http://localhost:5173' : 'https://skywatched.app';
const fontPath = `fonts/inter-latin-ext-400-normal.woff`;
const fontFile = await fetch(`${host}/${fontPath}`);
const fontData: ArrayBuffer = await fontFile.arrayBuffer();

export const GET: RequestHandler = async ({ params }) => {
	const uri = params.uri;

	if (!uri) {
		return error(404, 'Not found');
	}

	const record = await getRecordByUri({ uri });

	return new ImageResponse(
		template(record),
		{
			fonts: [
				{
					name: 'Inter Latin',
					data: fontData,
					weight: 400
				}
			]
		},
		{}
	);
};
