'use strict';

const CANVAS_WIDTH = 500;

let gElCanvas, gCtx, gImg;

function openMemeEditor() {
	initCanvas();
	const meme = getMeme();
	renderMeme(meme);
}

function initCanvas() {
	gElCanvas = document.querySelector('.meme-editor-canvas');
	gCtx = gElCanvas.getContext('2d');
}

function renderMeme(meme) {
	drawMeme(meme);
}

function drawMeme(meme) {
	let elImg;
	//if we already have image, don't create it again.
	if (!elImg) {
		gImg = getImgById(meme.selectedImgId);
		elImg = getElImg(gImg.url);
	}
	// Wait for image load before updating canvas
	elImg.onload = () => {
		// Set canvas size using image aspect ratio
		gElCanvas.width = CANVAS_WIDTH;
		gElCanvas.height = (elImg.naturalHeight * CANVAS_WIDTH) / elImg.naturalWidth;
		gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);

		drawTxt(gMeme.lines[0]);
	};
}

function getElImg(url) {
	const elImg = new Image(); // Create a new html img element
	elImg.src = url;
	elImg.alt = 'meme';
	return elImg;
}

function onAddTxt(elInput) {
	const txt = elInput.value;
	setLineTxt(txt);
	// drawTxt(gMeme.lines[0]);
	renderMeme(gMeme);
}

function drawTxt(line, pos) {
	pos = {};
	pos.x = 50;
	pos.y = 50;
	gCtx.strokeStyle = 'black';
	gCtx.fillStyle = line.color;
	gCtx.textAlign = line.align;
	gCtx.font = `${line.size}px Impact`;
	gCtx.fillText(line.txt, pos.x, pos.y);
	gCtx.strokeText(line.txt, pos.x, pos.y);
}
