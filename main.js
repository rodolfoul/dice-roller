var UINT32_MAX_VALUE = 0xFFFFFFFF;

function roll(nTimes, dType) {
	var results = [];
	for (var i = 1; i <= nTimes; i++) {
		results = results.concat(randomRange(1, dType));
	}
	return results;
}

function writeRolls(button, nTimes, dType) {
	var rolls = roll(nTimes, dType);

	var text = '';
	if (rolls.length == 1) {
		text += rolls[0];
	
	} else {
		var sum = 0;
		
		for (var i = 0; i < rolls.length; i++) {
			if (i == 0) {
				text += rolls[i];
			} else {
				text += ' + ' + rolls[i];
			}
		}

		text += ' = ' + rolls.reduce(function(a, b) { return a + b;}, 0);
	}
	
	$label = $(button).siblings();
	$label.text(text);
	fadeAnimation($label, button);
}

function generatePfChar(button) {

	var $results = $(button).siblings('table').find('tr td:nth-child(2)');
	var $button = $(button);

	var maxSum = 0;
	var skillsSum = 0;
	$results.each(function(index, el) {
		//Each skill goes from 4 to 24, average 14

		var sum = sumElements(roll(4, 6));
		skillsSum += sum;
		maxSum = Math.max(maxSum, sum);

		$(el).text(sum);
	});

	$results.removeClass('max-skill');


	var MIN_SKILL = 4;
	var MAX_SKILL = 24;

	var quality = getQuality(skillsSum / 6, MIN_SKILL, MAX_SKILL);

	var $spanQuality = $button.parent().find('.quality');
	$spanQuality.text(sprintf('%.0d', quality));

	$results.filter(sprintf(':contains(%d)', maxSum)).addClass('max-skill');

	fadeAnimation($results.add($spanQuality), $button);
}

function generateDdChar(button) {
	var $results = $(button).siblings('table').find('tr td:nth-child(2)');
	var $button = $(button);

	var v1 = randomRange(1, 6) + 6;
	var v2 = randomRange(1, 6) + randomRange(1, 6) + 12;
	var v3 = randomRange(1, 6) + 6;

	$($results[0]).text(v1);
	$($results[1]).text(v2);
	$($results[2]).text(v3);

	var quality = (getQuality(v1, 7, 12) + getQuality(v2, 14, 24) + getQuality(v3, 7, 12)) / 3;
	var $spanQuality = $button.parent().find('.quality');
	$spanQuality.text(sprintf('%.0d', quality));


	fadeAnimation($results.add($spanQuality), button);
}

function highlightHighest(labels) {
	Math.max.apply(null, arr);
}

function getQuality(value, min, max) {
	return 100 * (value - min) / (max - min);
}

function fadeAnimation(elements, buttonToEnable) {
	var $button = $(buttonToEnable);
	$button.prop('disabled', true);

	var $elements = $(elements);
	$elements.hide();
	$elements.fadeIn('slow', function() {
		$(buttonToEnable).prop('disabled', false);
	});
}

function animateRoll($button, $result, number) {
	$button.prop('disabled', true);
	$result.hide();
	
	$result.text(number);
	$result.addClass('border-fade-in');

	$result.fadeIn('slow', function() {
		$button.prop('disabled', false);
	});
}

function randomRange(minimum, maximum) {
	var arr = new Uint32Array(1);
	var n = window.crypto.getRandomValues(arr)[0]/UINT32_MAX_VALUE;
	return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}


function sumElements() {
	var arr;
	if (typeof arguments[0] === 'number') {
		arr = Array.prototype.slice.call(arguments);
	} else {
		arr = arguments[0];
	}
	return arr.reduce(function(a, b) {return a + b});
}

class Char {
	constructor($env) {
		this.$env = $env;
	}

	get stamina() {
		return parseInt(this.$env.find('[name="stamina"]').val());
	}

	get skill() {
		return parseInt(this.$env.find('[name="skill"]').val());
	}

	get attackStrength() {
		return null;
	}
}

class Fight {

	constructor(button) {
		this.currentStep = 0;
		this.$env = $(button).parent().siblings('.fight');
		
		this.creature = new Char(this.$env.find('.creature'));
		this.mainChar = new Char(this.$env.find('.main-char'));
	}

	calcNextStep() {
		if (this.creature.attackStrength == null) {

		} else if (this.mainChar.attackStrength) {

		}
	}
}

var currentFight;