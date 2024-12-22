// src/routes/og/+server.ts
import { getDetails } from '$lib/server/movies';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import { error, type RequestHandler } from '@sveltejs/kit';

const template = (data: {
	backdrop_path: string;
	poster_path: string;
	title?: string;
	name?: string;
}) => {
	return `
<div tw="bg-zinc-900 flex flex-col w-full h-full items-center justify-center">

	<div tw="flex absolute bottom-0 left-0 right-0 top-0 bg-sky-400">
		<img src="https://image.tmdb.org/t/p/w780${data.backdrop_path}" alt="" class="flex h-full w-full rounded-xl opacity-50" />

		<div tw="flex absolute h-full w-full bg-black/80">
		</div>
	</div>

    <div tw="flex flex-row w-full py-8 px-16 items-center justify-start">
		<div tw="flex h-auto aspect-[3/2] w-72">
			<img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="" 
			class="flex h-full w-full rounded-xl border-2 border-zinc-800" style="border-radius: 16px; border-width: 1px; border-color: #3f3f46;" />
		</div>

        <h2 tw="flex flex-col text-7xl font-bold text-zinc-100 text-left px-12 max-w-3xl">
            <span tw="flex tracking-tight">${data.title ?? data.name}</span>
        </h2>


    </div>

	<div tw="flex text-5xl py-8 text-sky-400">
		rate on skywatched.app
	</div>
</div>`;
};

const host = import.meta.env.DEV ? 'http://localhost:5173' : 'https://skywatched.app';
const fontPath = `fonts/inter-latin-ext-400-normal.woff`;
const fontFile = await fetch(`${host}/${fontPath}`);
const fontData: ArrayBuffer = await fontFile.arrayBuffer();

export const GET: RequestHandler = async ({ params }) => {
	const id = parseInt(params.id?.split('-')[0] ?? '');
	const kind = params.kind;

	if (kind !== 'movie' && kind !== 'tv') {
		return error(404, 'Not found');
	}

	if (!id) {
		return error(404, 'Not found');
	}
	const result = await getDetails(id, kind);

	return new ImageResponse(
		template(result),
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
