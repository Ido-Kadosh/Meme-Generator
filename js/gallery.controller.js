'use strict';

function onInit() {
	renderGallery();
}

function renderGallery() {
	const imgs = getImages();
	const thing = imgs
		.map(img => {
			return `<article class="meme-list-image">
        <img src="${img.url}" alt="${img.keywords[0]} meme" onclick="onMemePicked(this)"/>
        </article>`;
		})
		.join('');
	const elGallery = document.querySelector('.memes-grid-container');
	elGallery.innerHTML = thing;
}

function onMemePicked(el) {
	document.querySelector('.meme-gallery-page').hidden = true;
	document.querySelector('.meme-editor-page').hidden = false;
	setMeme(el);
	openMemeEditor();
}
