'use strict';

function makeId(length = 6) {
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let txt = '';
	for (let i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return txt;
}

function makeLorem(wordCount = 1) {
	const words = [
		'sky',
		'above',
		'port',
		'was',
		'the',
		'color',
		'television',
		'tuned',
		'to',
		'a',
		'dead',
		'all',
		'this',
		'happened',
		'more',
		'or',
		'less',
		'I',
		'had',
		'story',
		'bit',
		'from',
		'various',
		'people',
		'and',
		'as',
		'generally',
		'happens',
		'in',
		'such',
		'cases',
		'each',
		'time',
		'it',
		'different',
		'pleasure',
		'burn',
	];
	let txt = '';
	while (wordCount > 0) {
		wordCount--;
		txt += words[Math.floor(Math.random() * words.length)] + ' ';
	}
	return txt;
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function getRandomColor() {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function getMovementAngle(pos1, pos2) {
	var distY = pos2.y - pos1.y; //opposite
	var distX = pos2.x - pos1.x; //adjacent
	return Math.atan2(distY, distX);
}
