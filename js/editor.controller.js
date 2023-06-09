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
	gIntervalId,
	gIsListenersAdded = false,
	gIsMouseDown = false,
	gIsRotate = false,
	gIsDrag = false;

function openMemeEditor() {
	document.querySelector('.active')?.classList.remove('active');
	document.querySelector('.meme-gallery-page').classList.add('hidden');
	document.querySelector('.meme-saved-page').classList.add('hidden');
	document.querySelector('.meme-editor-page').classList.remove('hidden');
	gElImg = null; // we only render images once, so we make this null to re-render image.
	gElCanvas = document.querySelector('.meme-editor-canvas');
	gCtx = gElCanvas.getContext('2d');
	gCtx.lineWidth = 3; //this will stay like this as long as we don't implement a button to change it so it's initialized here

	renderFonts();
	renderMeme();
	resetInputs();
	if (!gIsListenersAdded) addCanvasEventListeners();
	onResizeCanvas();
}

function addCanvasEventListeners() {
	window.addEventListener('resize', onResizeCanvas);
	gElCanvas.addEventListener('mousedown', onDown);
	gElCanvas.addEventListener('mousemove', onMove);
	gElCanvas.addEventListener('mouseup', onUp);
	gElCanvas.addEventListener('touchstart', onDown);
	gElCanvas.addEventListener('touchmove', onMove);
	gElCanvas.addEventListener('touchend', onUp);
	gElCanvas.addEventListener('keydown', onKeyPressed);

	// this prevents dragging when mouseup fires after it exits canvas
	document.addEventListener('mousedown', () => (gIsMouseDown = true));
	document.addEventListener('mouseup', () => (gIsMouseDown = false));
	document.addEventListener('touchstart', () => (gIsMouseDown = true));
	document.addEventListener('touchend', () => (gIsMouseDown = false));
	document.addEventListener('mousedown', stopLineEditing);
	gIsListenersAdded = true; // make sure we only add listeners once.
}

function renderMeme() {
	const meme = getMeme();
	if (!gElImg) {
		const img = getCurrImg();
		gElImg = getElImg(img.url);
		gElImg.onload = () => renderImage(meme);
	} else {
		renderImage(meme);
	}
}

// we put this in an outside function so we can call it without waiting for img to load if we have img in global.
function renderImage(meme) {
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

function onDown(ev) {
	const pos = getEvPos(ev);
	let lineIdx = findClickedLineIdx(pos);
	if (lineIdx === -1) {
		setLineEmpty();
		renderMeme();
		return;
	}
	ev.preventDefault(); // only prevent defaults if a line is clicked, so we can drag/zoom freely on mobile.
	onSetSelectedLine(lineIdx);
	renderMeme();
	gIsDrag = true;
	document.body.style.cursor = 'move';
	gStartPos.x = pos.x;
	gStartPos.y = pos.y;
}

function onMove(ev) {
	clearInterval(gIntervalId);
	// only stay if mouse is down and either one of gIsDrag or gIsRotate is true
	if (!gIsMouseDown || !gIsDrag) return;

	const pos = getEvPos(ev);
	const dx = pos.x - gStartPos.x;
	const dy = pos.y - gStartPos.y;
	gStartPos.x = pos.x;
	gStartPos.y = pos.y;

	setLinePos(dx, dy);
	renderMeme();
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
		// ev.preventDefault();
		ev = ev.changedTouches[0];
		// calc the right pos according to the touch screen
		pos = {
			x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
			y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
		};
	}
	return pos;
}

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
	gCtx.restore();
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

function stopLineEditing(ev) {
	let el = ev.target;
	do {
		if (['INPUT', 'BUTTON', 'A', 'CANVAS', 'SELECT'].includes(el.nodeName)) {
			return;
		}
		el = el.parentNode;
	} while (el);
	setLineEmpty();
	renderMeme();
}

function onAddTxt(elInput) {
	const txt = elInput.value;
	setLineTxt(txt);
	renderMeme();
}

function onSetSelectedLine(lineIdx) {
	setSelectedLine(lineIdx);
	const line = getCurrLine();
	if (line.txt !== 'Add Text Here') document.querySelector('.meme-text-input').value = line.txt;
	renderFontInputs();
}

function resetInputs() {
	document.querySelector('.meme-text-input').value = '';
	renderFontInputs();
}

function onAddLine() {
	const txt = document.querySelector('.meme-text-input').value;
	addLine(txt);
	renderMeme();
}

function onDeleteLine() {
	document.querySelector('.meme-text-input').value = '';
	deleteLine();
	renderMeme();
}

function onSwitchLine() {
	switchLine();
	renderFontInputs();
	renderMeme();
}

function onUpdateLineSize(diff) {
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

function onDownloadMeme(elLink) {
	setLineEmpty();
	renderMeme();
	const imgContent = gElCanvas.toDataURL('image/jpeg'); // image/jpeg the default format
	elLink.download = getCurrImg().name;
	elLink.href = imgContent;
}

function onSaveMeme() {
	setLineEmpty();
	renderMeme();
	const meme = getMeme();
	const img = getCurrImg();
	const annotatedImg = gElCanvas.toDataURL('image/jpeg');
	saveMeme(meme, img, annotatedImg);

	const saveModal = document.querySelector('.save-confirmation-modal');
	saveModal.classList.add('shown');
	setTimeout(() => {
		saveModal.classList.remove('shown');
	}, 2000);
}

function onShareMeme() {
	setLineEmpty();
	renderMeme();
	const imgDataUrl = gElCanvas.toDataURL('image/jpeg'); // Gets the canvas content as an image format
	// A function to be called if request succeeds
	function onSuccess(uploadedImgUrl) {
		// Encode the instance of certain characters in the url
		const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl);
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`);
	}
	// Send the image to the server
	doUploadImg(imgDataUrl, onSuccess);
}

function doUploadImg(imgDataUrl, onSuccess) {
	// Pack the image for delivery
	const formData = new FormData();
	formData.append('img', imgDataUrl);
	// Send a post req with the image to the server
	const XHR = new XMLHttpRequest();
	XHR.onreadystatechange = () => {
		// If the request is not done, we have no business here yet, so return
		if (XHR.readyState !== XMLHttpRequest.DONE) return;
		// if the response is not ok, show an error
		if (XHR.status !== 200) return console.error('Error uploading image');
		const url = XHR.responseText;
		// If the response is ok, call the onSuccess callback function,
		// that will create the link to facebook using the url we got
		onSuccess(url);
	};
	XHR.onerror = (req, ev) => {
		console.error('Error connecting to server with request:', req, '\nGot response data:', ev);
	};
	XHR.open('POST', '//ca-upload.com/here/upload.php');
	XHR.send(formData);
}

function onResizeCanvas() {
	//if screen is smaller than default width, we make canvas smaller.
	gCanvasWidth = Math.min(window.innerWidth, DEFAULT_CANVAS_WIDTH);
	renderMeme();
}

function onKeyPressed(ev) {
	document.querySelector('.meme-text-input').value += ev.key;
	appendLineTxt(ev.key);
	renderMeme();
}
