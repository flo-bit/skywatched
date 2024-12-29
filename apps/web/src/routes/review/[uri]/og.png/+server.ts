// src/routes/og/+server.ts
import { getRecordByUri, type MainRecord } from '$lib/db';
import { ImageResponse } from '@ethercorps/sveltekit-og';
import { error, type RequestHandler } from '@sveltejs/kit';

const template = (data: MainRecord) => {
	return `
<div tw="bg-zinc-900 flex flex-col w-full h-full items-center justify-center">
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

        <div tw="flex flex-col text-7xl font-bold text-zinc-100 text-left px-8 max-w-3xl">
			<div tw="flex items-center">
				${data.author.avatar ? `<img src=${data.author.avatar} tw="w-16 h-16 rounded-full" />` : ``}
				<div tw="flex truncate text-4xl text-zinc-100 pl-4">
					${data.author.displayName || data.author.handle}
					<span tw="flex truncate text-sky-500 pl-2">
						reviewed
					</span>
				</div>
			</div>

            <span tw="flex tracking-tight mt-4">${data.record.metadata?.title}</span>

			${
				data.record.rating
					? `<div tw="flex items-center mt-8">
				<div tw="flex items-center">

					${new Array(5)
						.fill(0)
						.map(
							(_, i) => `<svg
						tw="w-20 h-20 flex ${i * 2 < (data.record.rating?.value ?? 0) - 1 ? 'text-sky-400' : 'text-zinc-600'}"
						viewBox="0 0 24 24"
						fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
							clip-rule="evenodd"
						/>
					</svg>`
						)
						.join('')}
				</div>
			</div>`
					: ``
			}
        </div>
    </div>

	<div tw="flex text-4xl text-sky-400 items-end justify-end w-full px-6 pb-4">
		<div tw="flex">
			skywatched.app
		</div>
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