import aspectRatio from '@tailwindcss/aspect-ratio';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

import colors from 'tailwindcss/colors';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				base: colors.zinc,
				accent: colors.sky,

				tmdb_primary: '#0d253f',
				tmdb_secondary: '#01b4e4',
				tmdb_tertiary: '#90cea1'
			}
		}
	},

	plugins: [typography, forms, aspectRatio]
} satisfies Config;
