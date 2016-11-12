const UINT32_MAX_VALUE = 0xFFFFFFFF;
const fadeInClass = 'fade-in';

function roll(nTimes, dType) {
	let results = [];
	for (let i = 1; i <= nTimes; i++) {
		results = results.concat(randomRange(1, dType));
	}
	return results;
}

function writeRolls(button, nTimes, dType) {
	let rolls = roll(nTimes, dType);

	let text = '';
	if (rolls.length == 1) {
		text += rolls[0];

	} else {
		let sum = 0;

		for (let i = 0; i < rolls.length; i++) {
			if (i == 0) {
				text += rolls[i];
			} else {
				text += ' + ' + rolls[i];
			}
		}

		text += ' = ' + rolls.reduce((a, b) => a + b);
	}

	$label = $(button).siblings();
	$label.text(text);
	fadeAnimation($label, button);
}

function generatePfChar(button) {

	let $results = $(button).siblings('table').find('tr td:nth-child(2)');
	let $button = $(button);

	let maxSum = 0;
	let skillsSum = 0;
	$results.each(function (index, el) {
		//Each skill goes from 4 to 24, average 14

		let sum = sumElements(roll(4, 6));
		skillsSum += sum;
		maxSum = Math.max(maxSum, sum);

		$(el).text(sum);
	});

	$results.removeClass('max-skill');


	const MIN_SKILL = 4;
	const MAX_SKILL = 24;

	let quality = getQuality(skillsSum / 6, MIN_SKILL, MAX_SKILL);

	let $spanQuality = $button.parent().find('.quality');
	$spanQuality.text(sprintf('%.0d', quality));

	$results.filter(sprintf(':contains(%d)', maxSum)).addClass('max-skill');

	fadeAnimation($results.add($spanQuality), $button);
}

function highlightHighest(labels) {
	Math.max.apply(null, arr);
}

function getQuality(value, min, max) {
	return 100 * (value - min) / (max - min);
}

function fadeAnimation(elements, buttonToEnable) {
	let $button = $(buttonToEnable);
	$button.prop('disabled', true);

	let $elements = $(elements);
	$elements.hide();
	$elements.fadeIn('slow', function () {
		$(buttonToEnable).prop('disabled', false);
	});
}

function animateRoll($button, $result, number) {
	$button.prop('disabled', true);
	$result.hide();

	$result.text(number);
	$result.addClass('border-fade-in');

	$result.fadeIn('slow', function () {
		$button.prop('disabled', false);
	});
}

function randomRange(minimum, maximum) {
	let arr = new Uint32Array(1);
	let n = window.crypto.getRandomValues(arr)[0] / UINT32_MAX_VALUE;
	return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}


function sumElements() {
	let arr;
	if (typeof arguments[0] === 'number') {
		arr = Array.prototype.slice.call(arguments);
	} else {
		arr = arguments[0];
	}
	return arr.reduce(function (a, b) {
		return a + b
	});
}