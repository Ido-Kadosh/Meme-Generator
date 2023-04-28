'use strict';

const MAX_RANDOM_LINES_AMOUNT = 2;
const MEME_STORAGE_KEY = 'DB_MEME';
const IMG_STORAGE_KEY = 'DB_IMAGE';
const ANNOTATED_IMG_STORAGE_KEY = 'DB_ANNOTATED_IMG';
const G_IMAGES_STORAGE_KEY = 'DB_G_IMAGES';

const FONTS = [
	'impact',
	'arial',
	'verdana',
	'tahoma',
	'trebuchet ms',
	'times new  roman',
	'georgia',
	'garamond',
	'courier new',
	'brush script mt',
	'poppins',
];

const DUMMY_LINE = {
	txt: 'Add Text Here',
	size: 40,
	align: 'left',
	strokeStyle: '#000000',
	fillStyle: '#ffffff',
};

let gKeywordSearchCountMap = { happy: 13, sad: 13, crazy: 15, sarcastic: 17, funny: 20 };
let gImgs;
let gMeme = {};
let gCurrFont = 'impact';

const gCreationPos = { x: 50, y: 50 };

_setGImages();

function _setGImages() {
	gImgs = loadFromStorage(G_IMAGES_STORAGE_KEY);
	if (!gImgs || !gImgs.length) {
		gImgs = [
			{ id: makeId(), url: 'img/0001.jpg', keywords: ['smart', 'brains'], name: 'Brains meme' },
			{ id: makeId(), url: 'img/0002.jpg', keywords: ['death', 'tomb'], name: 'Peace sign tombstone meme' },
			{ id: makeId(), url: 'img/0003.jpg', keywords: ['peter', 'family guy'], name: 'Peter running meme' },
			{ id: makeId(), url: 'img/0004.jpg', keywords: ['mega mind', 'blue'], name: 'Megamind peeking' },
			{ id: makeId(), url: 'img/0005.jpg', keywords: ['funny', 'patrick', 'science'], name: 'Patrick star' },
			{ id: makeId(), url: 'img/0006.jpg', keywords: ['funny', 'chris'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0007.jpg', keywords: ['funny', 'guy'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0008.jpg', keywords: ['robin', 'batman', 'slap'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0009.jpg', keywords: ['jesus', 'funny'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0010.jpg', keywords: ['drake', 'no', 'yes'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0011.jpg', keywords: ['weird', 'fututrama'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0012.jpg', keywords: ['dinosaur', 'philosoraptor'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0013.jpg', keywords: ['penguin', 'funny'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0014.jpg', keywords: ['kid', 'happy'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0015.jpg', keywords: ['surprised', 'pikachu'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0016.jpg', keywords: ['same', 'corporate'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0017.jpg', keywords: ['buttons', 'red'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0018.jpg', keywords: ['funny', 'woman'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0019.jpg', keywords: ['cute', 'dogs'], name: 'Meme Name' },
			{ id: makeId(), url: 'img/0020.jpg', keywords: ['funny', 'obama'], name: 'Meme Name' },
		];
		saveToStorage(G_IMAGES_STORAGE_KEY, gImgs);
	}
}

function getMeme() {
	return gMeme;
}

function getFonts() {
	return FONTS;
}

function getKeyWordMap() {
	return gKeywordSearchCountMap;
}

function updateKeyWordMap(key, number) {
	gKeywordSearchCountMap[key] = number;
}

function getImages() {
	return gImgs;
}

function getImagesByFilter(filter = '') {
	return gImgs.filter(img => img.keywords.some(keyword => keyword.toLowerCase().includes(filter.toLowerCase())));
}

function getImgById(imgId) {
	return gImgs.find(img => img.id === imgId);
}

function getCurrImg() {
	return getImgById(gMeme.selectedImgId);
}

function getImgByUrl(imgUrl) {
	return gImgs.find(img => img.url === imgUrl);
}

function getImgByIdx(imgIdx) {
	return gImgs[imgIdx];
}

function setLineTxt(txt) {
	if (!gMeme.lines.length) return;
	resetSelectedLine();
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].txt = txt || 'Add Text Here';
}

function appendLineTxt(char) {
	if (!gMeme.lines.length) return;
	resetSelectedLine();
	const lineIdx = gMeme.selectedLineIdx;
	const txt = gMeme.lines[lineIdx].txt;
	if (char === 'Backspace') {
		gMeme.lines[lineIdx].txt = txt.substring(0, txt.length - 1);
		if (txt.length === 1) deleteLine();
	} else {
		if (char.length > 1) return;
		gMeme.lines[lineIdx].txt += char;
	}
}

function setLinePos(dx, dy) {
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].pos.x += dx;
	gMeme.lines[lineIdx].pos.y += dy;
}

function updateLineSize(diff) {
	if (!gMeme.lines.length) return;
	resetSelectedLine();
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].size += diff;
}

function setLineAlign(alignment) {
	if (!gMeme.lines.length) return;
	resetSelectedLine();
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].align = alignment;
}

function setLineFont(font) {
	gCurrFont = font;
	if (!gMeme.lines.length) return;
	resetSelectedLine();
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].font = font;
}

function setStrokeStyle(color) {
	if (!gMeme.lines.length) return;
	resetSelectedLine();
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].strokeStyle = color;
}

function setFillStyle(color) {
	resetSelectedLine();
	if (!gMeme.lines.length) return;
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].fillStyle = color;
}

function getStrokeStyle() {
	const lineIdx = gMeme.selectedLineIdx;
	return gMeme.lines[lineIdx].strokeStyle;
}

function getFillStyle() {
	const lineIdx = gMeme.selectedLineIdx;
	return gMeme.lines[lineIdx].fillStyle;
}

function setSelectedLine(lineIdx) {
	gMeme.selectedLineIdx = lineIdx;
}

function _createLine({ txt = 'Add Text Here', size, align, strokeStyle, fillStyle }) {
	return {
		txt,
		size,
		font: gCurrFont,
		align,
		strokeStyle,
		fillStyle,
		pos: { ...gCreationPos },
	};
}

function addLine(txt) {
	let line, lineValues;

	if (gMeme.selectedLineIdx === -1) resetSelectedLine();
	let selectedLine = getCurrLine(); //default values will be same as selected line
	if (!selectedLine) {
		lineValues = { ...DUMMY_LINE, ...(txt && { txt }) }; // this only inserts txt if txt is truthy.
	} else {
		lineValues = { ...selectedLine, ...(txt && { txt }) };
	}
	line = _createLine(lineValues);

	gMeme.lines.push(line);
	gMeme.selectedLineIdx = gMeme.lines.length - 1; // always select previous text
}

function deleteLine() {
	if (gMeme.selectedLineIdx === -1) return;
	gMeme.lines.splice(gMeme.selectedLineIdx, 1);
	gMeme.selectedLineIdx--;
}

function getCurrLine() {
	const lineIdx = gMeme.selectedLineIdx;
	return gMeme.lines[lineIdx];
}

function switchLine() {
	gMeme.selectedLineIdx += 1;
	if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0;
}

function setLineEmpty() {
	gMeme.selectedLineIdx = -1;
}

function saveMeme(meme, img, annotatedImg) {
	const memes = loadFromStorage(MEME_STORAGE_KEY) || [];
	const imgs = loadFromStorage(IMG_STORAGE_KEY) || [];
	const annotatedImgs = loadFromStorage(ANNOTATED_IMG_STORAGE_KEY) || [];
	memes.push(meme);
	imgs.push(img);
	annotatedImgs.push(annotatedImg);
	saveToStorage(ANNOTATED_IMG_STORAGE_KEY, annotatedImgs);
	saveToStorage(MEME_STORAGE_KEY, memes);
	saveToStorage(IMG_STORAGE_KEY, imgs);
	saveToStorage(G_IMAGES_STORAGE_KEY, gImgs);
}

function getLoadedMemes() {
	return loadFromStorage(MEME_STORAGE_KEY) || [];
}

function getLoadedImgs() {
	return loadFromStorage(IMG_STORAGE_KEY) || [];
}

function getLoadedAnnotatedImgs() {
	return loadFromStorage(ANNOTATED_IMG_STORAGE_KEY) || [];
}

function loadMeme(imgSrc, meme) {
	gMeme = {
		selectedImgId: meme.selectedImgId,
		selectedLineIdx: meme.selectedLineIdx,
		lines: structuredClone(meme.lines),
	};
	//TODO load image if uploaded.
}

function setMeme(elImg, randomize = false) {
	let lines;
	if (randomize) lines = _createRandomLines();
	else lines = [_createLine(DUMMY_LINE)];
	let img = getImgByUrl(elImg.getAttribute('src'));
	if (!img) {
		img = _createImgFromUpload(elImg);
		gImgs.push(img);
	}
	gMeme = {
		selectedImgId: img.id,
		selectedLineIdx: 0,
		lines,
	};
}

function _createRandomLine() {
	//TODO make this work with canvas size and change pos accordingly
	return {
		txt: makeLorem(getRandomInt(3, 6)),
		size: getRandomInt(30, 61),
		font: getRandomFont(),
		strokeStyle: getRandomColor(),
		fillStyle: getRandomColor(),
		pos: { x: getRandomInt(50, 101), y: getRandomInt(50, 101) },
	};
}

function _createRandomLines() {
	let lines = [];
	const lineCount = getRandomInt(0, MAX_RANDOM_LINES_AMOUNT);
	for (let i = 0; i <= lineCount; i++) {
		lines.push(_createRandomLine());
	}
	return lines;
}

function _createImgFromUpload(elImg) {
	return {
		id: makeId(),
		url: elImg.getAttribute('src'),
		keywords: [],
		name: 'user meme',
	};
}

function getRandomFont() {
	const fontIdx = getRandomInt(0, FONTS.length);
	return FONTS[fontIdx];
}

function resetSelectedLine() {
	if (gMeme.selectedLineIdx === -1) gMeme.selectedLineIdx = 0;
}
