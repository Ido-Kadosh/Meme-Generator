'use strict';

const DEFAULT_CANVAS_WIDTH = 600;
const ROTATE_SQUARE_SIZE = 10;
const CLICK_MARGIN = 10; //we give 10 pixels on each side to make clicking easier.
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend'];

let gElCanvas,
	gCtx,
	gElImg,
	gCanvasWidth = DEFAULT_CANVAS_WIDTH,
	gStartPos = {},
	gIsListenersAdded = false,
	gIsMouseDown = false,
	gIsRotate = false,
	gIsDrag = false;

function openMemeEditor() {
	document.querySelector('.meme-gallery-page').classList.add('hidden');
	document.querySelector('.meme-saved-page').classList.add('hidden');
	document.querySelector('.meme-editor-page').classList.remove('hidden');

	gElImg = null;
	gElCanvas = document.querySelector('.meme-editor-canvas');
	gCtx = gElCanvas.getContext('2d');
	gCtx.lineWidth = 3; //this will stay like this as long as we don't implement a button to change it so it's initialized here

	renderFonts();
	renderImage();
	resetInputs();
	if (!gIsListenersAdded) addCanvasEventListeners();
}

function addCanvasEventListeners() {
	window.addEventListener('resize', onResizeCanvas);
	//TODO make it work with document listener, so that you can remove selected when clicking outside of canvas
	gElCanvas.addEventListener('mousedown', onDown);
	gElCanvas.addEventListener('mousemove', onMove);
	gElCanvas.addEventListener('mouseup', onUp);
	gElCanvas.addEventListener('touchstart', onDown);
	gElCanvas.addEventListener('touchmove', onMove);
	gElCanvas.addEventListener('touchend', onUp);
	gElCanvas.addEventListener('keydown', onKeyPressed);

	// this prevents dragging when mouseup fires after
	document.addEventListener('mousedown', () => (gIsMouseDown = true));
	document.addEventListener('mouseup', () => (gIsMouseDown = false));
	document.addEventListener('touchstart', () => (gIsMouseDown = true));
	document.addEventListener('touchend', () => (gIsMouseDown = false));
	gIsListenersAdded = true; // make sure we only add listeners once.
}

function onSetSelectedLine(lineIdx) {
	setSelectedLine(lineIdx);
	renderFontInputs();
}

function resetInputs() {
	document.querySelector('.meme-text-input').value = '';
	renderFontInputs();
}

function renderFonts() {
	const fonts = getFonts();
	const strHTML = fonts.map(font => `<option value="${font}">${font.toUpperCase()}</option>`).join('');
	const elContainer = document.querySelector('.font-picker');
	elContainer.innerHTML = strHTML;
}

function renderFontInputs() {
	const meme = getMeme();
	const lineIdx = meme.selectedLineIdx;
	const line = meme.lines[lineIdx] || 0;
	document.querySelector('.stroke-color-input').value = line.strokeStyle;
	document.querySelector('.fill-color-input').value = line.fillStyle;
	document.querySelector('.stroke-color-icon').style.color = line.strokeStyle;
	document.querySelector('.fill-color-icon').style.color = line.fillStyle;
	document.querySelector('.font-picker').value = line.font;
}

function onDown(ev) {
	const pos = getEvPos(ev);
	let lineIdx = findClickedLineIdx(pos);
	// check lineIdx again to see if text line pressed.
	if (lineIdx === -1) {
		setLineEmpty();
		renderImage();
		return;
	}
	onSetSelectedLine(lineIdx);
	renderImage();
	gIsDrag = true;
	document.body.style.cursor = 'move';
	gStartPos.x = pos.x;
	gStartPos.y = pos.y;
}

function onMove(ev) {
	// only stay if mouse is down and either one of gIsDrag or gIsRotate is true
	if (!gIsMouseDown || !gIsDrag) return;

	const pos = getEvPos(ev);
	const dx = pos.x - gStartPos.x;
	const dy = pos.y - gStartPos.y;
	gStartPos.x = pos.x;
	gStartPos.y = pos.y;

	setLinePos(dx, dy);
	renderImage();
}

function onUp() {
	gIsDrag = false;
	gIsRotate = false;
	document.body.style.cursor = 'default';
}

function getEvPos(ev) {
	let pos = {
		x: ev.offsetX,
		y: ev.offsetY,
	};
	if (TOUCH_EVS.includes(ev.type)) {
		// prevent triggering mouse events
		ev.preventDefault();
		ev = ev.changedTouches[0];
		// calc the right pos according to the touch screen
		pos = {
			x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
			y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
		};
	}
	return pos;
}

function renderImage() {
	const meme = getMeme();
	if (!gElImg) {
		const img = getCurrImg();
		gElImg = getElImg(img.url);
		gElImg.onload = () => renderMeme(meme);
	} else {
		renderMeme(meme);
	}
}

// we put this in an outside function so we can call it without waiting for img to load if we have img in global.
function renderMeme(meme) {
	// set canvas size using image aspect ratio
	gElCanvas.width = gCanvasWidth;
	gElCanvas.height = (gElImg.naturalHeight * gCanvasWidth) / gElImg.naturalWidth;
	gCtx.drawImage(gElImg, 0, 0, gElCanvas.width, gElCanvas.height);
	drawTxt(meme.lines);
	// if found, means we have selected line and we want to draw outline.
	const line = getCurrLine();
	if (line) {
		drawOutlineRectangle(line);
	}
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
	renderImage();
}

function drawTxt(lines) {
	lines.forEach(line => {
		const { x, y } = line.pos;
		gCtx.strokeStyle = line.strokeStyle;
		gCtx.fillStyle = line.fillStyle;
		gCtx.textAlign = line.align;
		gCtx.font = `${line.size}px  ${line.font}`;
		gCtx.fillText(line.txt, x, y);
		gCtx.strokeText(line.txt, x, y);
	});
}

function onAddLine() {
	addLine();
	renderImage();
}

function onDeleteLine() {
	deleteLine();
	renderImage();
}

function onSwitchLine() {
	switchLine();
	renderFontInputs();
	renderImage();
}

function onUpdateLineSize(diff) {
	updateLineSize(diff);
	renderImage();
}

function onSetAlignment(alignment) {
	setLineAlign(alignment);
	renderImage();
}

function onSetFont(elSelect) {
	setLineFont(elSelect.value);
	renderImage();
}

function onSetStrokeStyle(elColor) {
	elColor.parentNode.style.color = elColor.value;
	setStrokeStyle(elColor.value);
	renderImage();
}

function onSetFillStyle(elColor) {
	elColor.parentNode.style.color = elColor.value;
	setFillStyle(elColor.value);
	renderImage();
}

function onDownloadMeme(elLink) {
	setLineEmpty();
	renderImage();
	const imgContent = gElCanvas.toDataURL('image/jpeg'); // image/jpeg the default format
	elLink.download = getCurrImg().name;
	elLink.href = imgContent;
}

function onSaveMeme() {
	setLineEmpty();
	renderImage();
	const meme = getMeme();
	const img = getCurrImg();
	const annotatedImg = gElCanvas.toDataURL('image/jpeg');
	saveMeme(meme, img, annotatedImg);
}

function onShareMeme() {}

function findClickedLineIdx(checkPos) {
	const meme = getMeme();
	return meme.lines.findIndex(line => {
		gCtx.save();
		gCtx.font = `${line.size}px ${line.font}`; // we need to set font since measureText uses selected font to find width.
		const width = gCtx.measureText(line.txt).width;
		// since drawing text goes up and canvas coords goes down, we put this in y2.
		let { x: x1, y: y2 } = line.pos;
		let x2 = x1 + width;
		let y1 = y2 - line.size;

		if (line.align === 'center') {
			x1 -= width / 2;
			x2 -= width / 2;
		}
		if (line.align === 'right') {
			x1 -= width;
			x2 -= width;
		}
		// set click margin for easier clicking
		x1 -= CLICK_MARGIN;
		x2 += CLICK_MARGIN;
		y1 -= CLICK_MARGIN;
		y2 += CLICK_MARGIN;
		gCtx.restore();
		return checkPos.x > x1 && checkPos.x < x2 && checkPos.y > y1 && checkPos.y < y2;
	});
}

function drawOutlineRectangle(line) {
	gCtx.save();
	gCtx.lineWidth = 3;
	gCtx.strokeStyle = '#000000';

	let { x, y } = line.pos;
	y -= line.size; // since drawing text goes up and canvas coords goes down, we reduce y by height.
	gCtx.font = `${line.size}px ${line.font}`; // we need to set font since measureText uses selected font to find width.
	const width = gCtx.measureText(line.txt).width;

	if (line.align === 'center') {
		x = x - width / 2;
	}
	if (line.align === 'right') {
		x = x - width;
	}

	x -= CLICK_MARGIN;

	gCtx.beginPath();
	gCtx.rect(x, y, width + CLICK_MARGIN * 2, line.size + CLICK_MARGIN);
	gCtx.stroke();
}

function onResizeCanvas() {
	//if screen is smaller than default width, we make canvas smaller.
	gCanvasWidth = Math.min(window.innerWidth, DEFAULT_CANVAS_WIDTH);
	renderImage();
}

function onKeyPressed(ev) {
	appendLineTxt(ev.key);
	renderImage();
}
