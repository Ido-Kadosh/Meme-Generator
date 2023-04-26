'use strict';

const DUMMY_LINE = {
	txt: 'Add Text Here',
	size: 40,
	font: 'impact',
	align: 'left',
	strokeStyle: 'black',
	fillStyle: 'white',
};

let gKeywordSearchCountMap = { happy: 13, sad: 13, crazy: 15, sarcastic: 17, funny: 20 };

let gImgs = [
	{ id: makeId(), url: 'img/0001.jpg', keywords: ['smart', 'brains'], name: 'Brains meme' },
	{ id: makeId(), url: 'img/0002.jpg', keywords: ['death', 'tomb'], name: 'Peace sign tombstone meme' },
	{ id: makeId(), url: 'img/0003.jpg', keywords: ['peter', 'family guy'], name: 'Peter Griffin running meme' },
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

let gMeme = {};

function getMeme() {
	return gMeme;
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

function setLineTxt(txt) {
	resetSelectedLine();
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].txt = txt || 'Add Text Here';
}

function setLinePos(dx, dy) {
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].pos.x += dx;
	gMeme.lines[lineIdx].pos.y += dy;
}

function updateLineSize(diff) {
	resetSelectedLine();
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].size += diff;
}

function setLineAlign(alignment) {
	resetSelectedLine();
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].align = alignment;
}

function setLineFont(font) {
	resetSelectedLine();
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].font = font;
}

function setStrokeStyle(color) {
	resetSelectedLine();
	const lineIdx = gMeme.selectedLineIdx;
	gMeme.lines[lineIdx].strokeStyle = color;
}

function setFillStyle(color) {
	resetSelectedLine();
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

function _createLine({ txt = 'Add Text Here', size, font, align, strokeStyle, fillStyle }) {
	return {
		txt,
		size,
		font,
		align,
		strokeStyle,
		fillStyle,
		pos: { x: 50, y: 50 },
	};
}

function addLine() {
	let line;
	if (gMeme.selectedLineIdx === -1) resetSelectedLine();
	let selectedLine = getCurrLine(); //default values will be same as selected line
	console.log(selectedLine);
	if (!selectedLine) {
		console.log('h');
		line = _createLine(DUMMY_LINE);
	} else {
		line = _createLine(selectedLine);
	}

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

function setMeme(elImg) {
	const img = getImgByUrl(elImg.getAttribute('src'));
	gMeme = {
		selectedImgId: img.id,
		selectedLineIdx: 0,
		lines: [_createLine(DUMMY_LINE)],
	};
}

function resetSelectedLine() {
	if (gMeme.selectedLineIdx === -1) gMeme.selectedLineIdx = 0;
}
