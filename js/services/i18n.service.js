'use strict';

const gTrans = {
	'meme-generator': {
		en: 'Meme Generator',
		he: 'מחולל הממים',
	},
	gallery: {
		en: 'Gallery',
		he: 'גלריה',
	},
	saved: {
		en: 'Saved',
		he: 'שמורים',
	},
	randomize: {
		en: 'Randomize',
		he: 'ממ אקראי',
	},
	search: {
		en: 'Search',
		he: 'חיפוש',
	},
	happy: {
		en: 'Happy',
		he: 'שמח',
	},
	sad: {
		en: 'Sad',
		he: 'עצוב',
	},
	crazy: {
		en: 'Crazy',
		he: 'משוגע',
	},
	sarcastic: {
		en: 'Sarcastic',
		he: 'סרקטסי',
	},
	funny: {
		en: 'Funny',
		he: 'מצחיק',
	},
	'upload-image': {
		en: 'Upload Image',
		he: 'העלה תמונה',
	},
	'add-text-here': {
		en: 'Add Text Here',
		he: 'הוסף טקסט כאן',
	},
	save: {
		en: 'Save',
		he: 'שמור',
	},
	share: {
		en: 'Share',
		he: 'שתף',
	},
	download: {
		en: 'Download',
		he: 'הורדה',
	},
};

let gCurrLang = 'en';

function getTrans(transKey) {
	const transMap = gTrans[transKey];
	if (!transMap) return 'UNKNOWN';
	let transTxt = transMap[gCurrLang];
	if (!transTxt) transTxt = transMap.en;
	return transTxt;
}

function doTrans() {
	let els = document.querySelectorAll('[data-trans]');
	els.forEach(el => {
		const transKey = el.dataset.trans;
		const transTxt = getTrans(transKey);
		if (el.placeholder) el.placeholder = transTxt;
		else el.innerText = transTxt;
	});
}

function setLang(lang) {
	gCurrLang = lang;
}

function getLang() {
	return gCurrLang;
}

function formatCurrency(num) {
	return new Intl.NumberFormat(gCurrLang, { style: 'currency', currency: gCurrencies[gCurrLang] }).format(num);
}
