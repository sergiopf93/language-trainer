// Release mode is built only from the approved snapshot verified by the Vite plugin.
export const isRelease = import.meta.env?.MODE === 'release';
export const localOnly = isRelease;
