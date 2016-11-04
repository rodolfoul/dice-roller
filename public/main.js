const UINT32_MAX_VALUE = 0xFFFFFFFF;


let mainApp = angular.module('main', ['ngAnimate']);
mainApp.controller('GamebookController', function ($scope, $element) {


	$scope.initializeFight = function () {
		$scope.currentStep = 0;
		$scope.fled = false;
	};
	$scope.initializeFight();

	$scope.test = function () {
		console.log('aa');
	};

	$scope.nextStep = function () {
		let turn = $scope.currentStep % 3;

		let mainChar = $scope.mainChar;
		let creature = $scope.creature;

		if (turn == 0) {
			creature.rollAttackStrength();

		} else if (turn == 1) {
			$scope.mainChar.rollAttackStrength();

		} else if (turn == 2) {
			let mainStrength = mainChar.attackStrength;
			let creatStregth = creature.attackStrength;

			if (mainStrength < creatStregth) {
				mainChar.stamina -= 2;
				mainChar.wasHit = true;
				creature.wasHit = false;

			} else if (mainStrength > creatStregth) {
				creature.stamina -= 2;
				mainChar.wasHit = false;
				creature.wasHit = true;
			}
		}

		$scope.currentStep++;
	};

	$scope.battleEnded = function () {
		return $scope.creature.stamina <= 0 || $scope.mainChar.stamina <= 0 || $scope.fled;
	};

	$scope.flee = function () {
		$scope.currentStep++;
		$scope.mainChar.stamina -= 2;
		$scope.fled = true;
	};

	$scope.statusMessage = function () {
		if ($scope.mainChar.stamina <= 0) {
			return 'You die!';
		} else if ($scope.creature.stamina <= 0) {
			return 'Creature dies!';
		} else if ($scope.creature.wasHit) {
			return 'Creature loses 2';
		} else if ($scope.mainChar.wasHit) {
			return 'You lose 2';
		}
	};

	$scope.nextStepButton = $($element[0]).find('input[name="next-step"]');
});

mainApp.controller('CharController', function CharController($scope, $element) {

	$scope.stamina = 10;
	$scope.skill = 10;
	$scope.attackStrength = 0;

	$scope.$parent[$($element[0]).attr('char-type')] = $scope;

	$scope.test = function () {
		console.log('bb');
	};

	$scope.rollAttackStrength = function () {
		let a = randomRange(1, 6);
		let b = randomRange(1, 6);
		$scope.roll = sprintf('%d = %d + %d', a + b, a, b);
		$scope.attackStrength = $scope.skill + a + b;
	};
	// $scope.
});

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

function generateDdChar(button) {
	let $results = $(button).siblings('table').find('tr td:nth-child(2)');
	let $button = $(button);

	let v1 = randomRange(1, 6) + 6;
	let v2 = randomRange(1, 6) + randomRange(1, 6) + 12;
	let v3 = randomRange(1, 6) + 6;

	$($results[0]).text(v1);
	$($results[1]).text(v2);
	$($results[2]).text(v3);

	let quality = (getQuality(v1, 7, 12) + getQuality(v2, 14, 24) + getQuality(v3, 7, 12)) / 3;
	let $spanQuality = $button.parent().find('.quality');
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