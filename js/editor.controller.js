'use strict';

const CANVAS_WIDTH = 500;
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend'];

let gElCanvas,
	gCtx,
	gCurrMeme,
	gIsMouseDown = false,
	gIsDrag = false;

function openMemeEditor() {
	gElCanvas = document.querySelector('.meme-editor-canvas');
	gCtx = gElCanvas.getContext('2d');
	gCtx.lineWidth = 3; //this will stay like this as long as we don't implement a button to change it so it's initialized here.
	gCurrMeme = getMeme();
	renderMeme();
	addCanvasEventListeners();
}

function addCanvasEventListeners() {
	//TODO lose text when mouse outside of bounds.
	gElCanvas.addEventListener('mousedown', onDown);
	gElCanvas.addEventListener('mousemove', onMove);
	gElCanvas.addEventListener('mouseup', onUp);
	gElCanvas.addEventListener('touchstart', onDown);
	gElCanvas.addEventListener('touchmove', onMove);
	gElCanvas.addEventListener('touchend', onUp);

	document.addEventListener('mousedown', () => (gIsMouseDown = true));
	document.addEventListener('mouseup', () => (gIsMouseDown = false));
}

function onDown(ev) {
	const pos = getEvPos(ev);
	gIsDrag = true;
	document.body.style.cursor = 'move';
	//TODO make this work
	// gOffsetX = ev.clientX - elDiv.offsetLeft;
	// gOffsetY = ev.clientY - elDiv.offsetTop;
}

function onMove(ev) {
	if (!gIsDrag || !gIsMouseDown) return;
	const pos = getEvPos(ev);
	//TODO make this work
	// elDiv.style.top = ev.clientY - gOffsetY + 'px';
	// elDiv.style.left = ev.clientX - gOffsetX + 'px';

	setLinePos(pos);
	renderMeme();
}

function onUp() {
	gIsDrag = false;
	document.body.style.cursor = 'default';
}

function getEvPos(ev) {
	// Gets the offset pos , the default pos
	let pos = {
		x: ev.offsetX,
		y: ev.offsetY,
	};
	if (TOUCH_EVS.includes(ev.type)) {
		// prevent triggering mouse events
		ev.preventDefault();
		ev = ev.changedTouches[0];
		//Calc the right pos according to the touch screen
		pos = {
			x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
			y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
		};
	}
	return pos;
}

function renderMeme() {
	//TODO  only render image once. this requires to put drawTxt outside of onload, and to set global vars
	const img = getImgById(gCurrMeme.selectedImgId);
	const elImg = getElImg(img.url);
	// Wait for image load before updating canvas
	elImg.onload = () => {
		// Set canvas size using image aspect ratio
		gElCanvas.width = CANVAS_WIDTH;
		gElCanvas.height = (elImg.naturalHeight * CANVAS_WIDTH) / elImg.naturalWidth;
		gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height);
		drawTxt(gCurrMeme.lines[0]);
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
	renderMeme();
}

function drawTxt(line) {
	const { x = line.pos.x, y = line.pos.y } = line;
	gCtx.strokeStyle = line.strokeStyle;
	gCtx.fillStyle = line.fillStyle;
	gCtx.textAlign = line.align;
	gCtx.font = `${line.size}px ${line.font}`;
	gCtx.fillText(line.txt, x, y);
	gCtx.strokeText(line.txt, x, y);
}

function onUpdateFont(diff) {
	updateLineSize(diff);
	renderMeme();
}

function onSetAlignment(alignment) {
	setLineAlign(alignment);
	renderMeme();
}

function onSetFont(elSelect) {
	setLineFont(elSelect.value);
	renderMeme();
}

function onSetStrokeStyle(elColor) {
	elColor.parentNode.style.color = elColor.value;
	setStrokeStyle(elColor.value);
	renderMeme();
}

function onSetFillStyle(elColor) {
	elColor.parentNode.style.color = elColor.value;
	setFillStyle(elColor.value);
	renderMeme();
}
