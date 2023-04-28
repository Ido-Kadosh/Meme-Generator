'use strict';

const MEMES_STORAGE_KEY = 'DB_MEME';
const IMGS_STORAGE_KEY = 'DB_IMAGE';
const ANNOTATED_IMGS_STORAGE_KEY = 'DB_ANNOTATED_IMG';

function onSavedInit() {
	document.body.classList.remove('nav-open'); // just incase we got here from mobile, we want to close navbar.
	document.querySelector('.meme-gallery-page').classList.add('hidden');
	document.querySelector('.meme-editor-page').classList.add('hidden');
	document.querySelector('.meme-saved-page').classList.remove('hidden');
	document.querySelector('.active')?.classList.remove('active');
	document.querySelector('.saved-li').classList.add('active');

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
	const memes = getLoadedMemes();
	let meme = memes[el.dataset.index];
	loadMeme(meme);
	openMemeEditor();
}
