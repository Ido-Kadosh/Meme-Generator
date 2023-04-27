'use strict';

let gGalleryRendered = false;

function onInit() {
	document.body.classList.remove('nav-open'); // just incase we got here from mobile, we want to close navbar.
	if (!gGalleryRendered) renderGallery();
	renderKeywordSize();
	document.querySelector('.meme-gallery-page').classList.remove('hidden');
	document.querySelector('.meme-editor-page').classList.add('hidden');
	document.querySelector('.meme-saved-page').classList.add('hidden');
}

function renderGallery(filter) {
	const imgs = getImagesByFilter(filter);
	let strHTML = `<label class="file-input-label" for="file-upload-input">Upload Image</label>
		<input type="file" id="file-upload-input" class="btn file-input" name="image" onchange="onImgUpload(event)"/>`;
	strHTML += imgs
		.map(img => {
			return `<article class="meme-list-image">
        <img src="${img.url}" alt="${img.keywords[0]} meme" onclick="onMemePicked(this)"/>
        </article>`;
		})
		.join('');
	const elGallery = document.querySelector('.memes-grid-container');
	elGallery.innerHTML = strHTML;
	gGalleryRendered = true;
	doTrans();
}

function onMemePicked(elImg, random = false) {
	setMeme(elImg, random);
	openMemeEditor();
}

function onSavedClicked() {
	document.body.classList.remove('nav-open'); // just incase we got here from mobile, we want to close navbar.
	document.querySelector('.meme-gallery-page').classList.add('hidden');
	document.querySelector('.meme-editor-page').classList.add('hidden');
	document.querySelector('.meme-saved-page').classList.remove('hidden');
	onSavedInit();
}

function onRandomClicked() {
	document.body.classList.remove('nav-open'); // just incase we got here from mobile, we want to close navbar.
	const imgs = getImages();
	const imgIdx = getRandomInt(0, imgs.length);
	const elImgs = document.querySelectorAll('.meme-list-image img');
	const elImg = elImgs[imgIdx];
	onMemePicked(elImg, true); // second argument for random meme attributes
}

function onSearchMeme(searchValue) {
	renderGallery(searchValue);
	updateKeyWordSize(searchValue);
}

function onKeywordPressed(keyWord) {
	const elInput = document.querySelector('.search-meme-input');
	elInput.value = keyWord;
	onSearchMeme(keyWord);
}

function updateKeyWordSize(keyWord) {
	// because we get a reference and not the object, I wasn't sure if I need to update map directly or not
	// this function "assumes" that you get a new copy of keyWordMap, and thus never changes anything directly.
	const keyWordMap = getKeyWordMap();
	if (keyWord in keyWordMap) {
		updateKeyWordMap(keyWord, keyWordMap[keyWord] + 1);
	} else {
		updateKeyWordMap(keyWord, 1);
	}
	renderKeywordSize();
}

function renderKeywordSize() {
	const keyWordMap = getKeyWordMap();
	const elBtns = document.querySelectorAll('.key-words-container button');
	elBtns.forEach(elBtn => {
		const word = elBtn.value.toLowerCase();
		elBtn.style.fontSize = `${keyWordMap[word] * 0.05}em`;
	});
}

function onImgUpload(ev) {
	loadImageFromInput(ev, onMemePicked);
}

function loadImageFromInput(ev, onImageReady) {
	const reader = new FileReader();
	// After we read the file
	reader.onload = function (event) {
		let img = new Image(); // Create a new html img element
		img.src = event.target.result; // Set the img src to the img file we read
		// Run the callBack func, To render the img on the canvas
		img.onload = () => onImageReady(img);
	};
	reader.readAsDataURL(ev.target.files[0]); // Read the file we picked
}

function onToggleNavOpen() {
	document.body.classList.toggle('nav-open');
}

function onSetLang(lang) {
	document.querySelector('.language-select').value = lang;
	setLang(lang);
	doTrans();
	if (isRTL(lang)) {
		document.body.classList.add('rtl');
	} else {
		document.body.classList.remove('rtl');
	}
}
