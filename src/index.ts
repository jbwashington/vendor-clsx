// Vendored from lukeed/clsx v2.1.1 (src/index.js + clsx.d.mts), MIT — see ./LICENSE.
// Logic unchanged; ported to TypeScript (var -> let/const, arguments -> rest
// params, `str && (str += " ")` -> `if (str)`). Types are upstream clsx.d.mts.
export type ClassValue = ClassArray | ClassDictionary | string | number | bigint | null | boolean | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassValue[];

function toVal(mix: any): string {
	let k, y, str='';

	if (typeof mix === 'string' || typeof mix === 'number') {
		str += mix;
	} else if (typeof mix === 'object') {
		if (Array.isArray(mix)) {
			const len=mix.length;
			for (k=0; k < len; k++) {
				if (mix[k]) {
					if (y = toVal(mix[k])) {
						if (str) str += ' ';
						str += y;
					}
				}
			}
		} else {
			for (y in mix) {
				if (mix[y]) {
					if (str) str += ' ';
					str += y;
				}
			}
		}
	}

	return str;
}

export function clsx(...inputs: ClassValue[]): string {
	let i=0, tmp, x, str='';
	const len=inputs.length;
	for (; i < len; i++) {
		if (tmp = inputs[i]) {
			if (x = toVal(tmp)) {
				if (str) str += ' ';
				str += x
			}
		}
	}
	return str;
}

export default clsx;
