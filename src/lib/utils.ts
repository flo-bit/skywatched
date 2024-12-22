import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function nameToId(name: string) {
	// replace spaces with hyphens, non-alphanumeric characters with empty string, replace multiple hyphens with a single hyphen, max length 100
	return name
		.toLowerCase()
		.replace(/ /g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-')
		.slice(0, 100);
}
