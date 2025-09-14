export type SceneBuilder<T> = {
	current?: string;
	expires?: number;
	state: T;
};
