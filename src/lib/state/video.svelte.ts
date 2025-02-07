export const videoPlayer: {
	showing: boolean;
	id: string | undefined;

	show: (id: string) => void;
	hide: () => void;
} = $state({
	showing: false,
	id: undefined,

	show: (id: string) => {
		videoPlayer.id = id;
		videoPlayer.showing = true;
	},

	hide: () => {
		videoPlayer.id = undefined;
		videoPlayer.showing = false;
	}
});
