export function setStorageItem(key, value) {
	let roomCookie = getStorageItem(key);
	if (roomCookie && roomCookie instanceof Object) {
		roomCookie = Object.assign(roomCookie, value);
	} else {
		roomCookie = value;
	}
	if (roomCookie instanceof Object) {
		roomCookie = JSON.stringify(roomCookie);
	}
	localStorage.setItem(key, roomCookie);
}

export function getStorageItem(name) {
	let item = localStorage.getItem(name);
	if (item) {
		return JSON.parse(item);
	} else {
		return null;
	}
}

export function delStorageItem(name) {
	localStorage.removeItem(name);
}
