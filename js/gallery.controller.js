'use strict';

let gGalleryRendered = false;

function onInit() {
	if (!gGalleryRendered) renderGallery();
	renderKeywordSize();
	document.querySelector('.meme-gallery-page').classList.remove('hidden');
	document.querySelector('.meme-editor-page').classList.add('hidden');
	document.querySelector('.meme-saved-page').classList.add('hidden');
}

function renderGallery(filter) {
	const imgs = getImagesByFilter(filter);
	const strHTML = imgs
		.map(img => {
			return `<article class="meme-list-image">
        <img src="${img.url}" alt="${img.keywords[0]} meme" onclick="onMemePicked(this)"/>
        </article>`;
		})
		.join('');
	const elGallery = document.querySelector('.memes-grid-container');
	elGallery.innerHTML = strHTML;
	gGalleryRendered = true;
}

function onMemePicked(el) {
	document.querySelector('.meme-gallery-page').classList.add('hidden');
	document.querySelector('.meme-editor-page').classList.remove('hidden');
	setMeme(el);
	openMemeEditor();
}

function onSearchMeme(elInput) {
	const keyWord = elInput.value;
	renderGallery(keyWord);
	updateKeyWordSize(keyWord);
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
		const word = elBtn.innerText.toLowerCase();
		elBtn.style.fontSize = `${keyWordMap[word] * 0.05}em`;
	});
}

function onToggleNavOpen() {
	document.body.classList.toggle('nav-open');
}
