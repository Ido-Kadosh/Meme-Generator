'use strict';

const MEMES_STORAGE_KEY = 'DB_MEME';
const IMGS_STORAGE_KEY = 'DB_IMAGE';
const ANNOTATED_IMGS_STORAGE_KEY = 'DB_ANNOTATED_IMG';

function onSavedInit() {
	// const memes = getLoadedMemes();
	const imgs = getLoadedImgs();
	const annotatedImgs = getLoadedAnnotatedImgs();
	renderSaved(annotatedImgs, imgs);
}

function renderSaved(annotatedImgs, imgs) {
	const strHTML = annotatedImgs
		.map((img, index) => {
			return `<article class="meme-list-image">
        <img src="${img}" alt="${imgs[index].keywords[0]} meme" 
        data-index='${index}'
         onclick="onLoadFromSaved(this)"/>
        </article>`;
		})
		.join('');
	const elContainer = document.querySelector('.saved-memes-container');
	elContainer.innerHTML = strHTML;
}

function onLoadFromSaved(el) {
	const imgSrc = el.src;
	const memes = getLoadedMemes();
	let meme = memes[el.dataset.index];
	loadMeme(imgSrc, meme);
	openMemeEditor();
}