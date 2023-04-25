'use strict';

let gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 12, smart: 30 };

let gImgs = [
	{ id: makeId(), url: 'img/0001.jpg', keywords: ['smart', 'funny'] },
	{ id: makeId(), url: 'img/0002.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0003.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0004.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0005.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0006.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0007.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0008.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0009.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0010.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0011.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0012.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0013.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0014.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0015.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0016.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0017.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0018.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0019.jpg', keywords: ['funny', 'cat'] },
	{ id: makeId(), url: 'img/0020.jpg', keywords: ['funny', 'cat'] },
];

let gMeme = {
	selectedImgId: gImgs[0].id,
	selectedLineIdx: 0,
	lines: [
		{
			txt: 'Add Text Here',
			size: 40,
			align: 'left',
			color: 'red',
		},
	],
};

function getMeme() {
	return gMeme;
}

function getImages() {
	return gImgs;
}

function getImgById(imgId) {
	return gImgs.find(img => img.id === imgId);
}

function getImgByUrl(imgUrl) {
	return gImgs.find(img => img.url === imgUrl);
}

function setLineTxt(txt, lineIdx = 0) {
	gMeme.lines[lineIdx].txt = txt || 'Add Text Here';
}

function initializeEmptyMeme(elImg) {
	const img = getImgByUrl(elImg.getAttribute('src'));
	gMeme = {
		selectedImgId: img.id,
		selectedLineIdx: 0,
		lines: [
			{
				txt: 'Add Text Here',
				size: 40,
				align: 'center',
				color: 'red',
			},
		],
	};
}
