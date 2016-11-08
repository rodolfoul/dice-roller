const UINT32_MAX_VALUE = 0xFFFFFFFF;
const fadeInClass = 'fade-in';


let mainApp = angular.module('main', ['ngAnimate']);

mainApp.directive('integer', function () {
	return {
		require: 'ngModel',
		link: function (scope, ele, attr, ctrl) {

			ctrl.$parsers.unshift(function (inputValue) {
				var transformedInput = inputValue.replace(/\D+/g, '');

				if (transformedInput != inputValue) {
					ctrl.$setViewValue(transformedInput);
					ctrl.$render();
				}

				return parseInt(transformedInput, 10);
			});
		}
	};
});

const animateOnChange = 'animateOnChange';
mainApp.directive(animateOnChange, function ($animate) {
	return function (scope, elem, attr) {
		scope.$watch(attr[animateOnChange], function () {
			$animate.addClass(elem, fadeInClass).then(function () {
				$animate.removeClass(elem, fadeInClass);
			});
		});
	};
});

const valueRevealerDirective = 'valueRevealer';
mainApp.directive(valueRevealerDirective, function ($animate) {
	return function (scope, elem, attr) {

		let elements = $(elem.siblings().find('.' + attr[valueRevealerDirective]));
		let quality = $(elem.siblings().find('.quality'));


		const valueRevealClass = 'value-reveal';
		const fadeInClass = 'fade-in';

		elem.on('click', function () {

			elem.prop('disabled', true);

			if (quality.length > 0) {
				$animate.addClass(quality, fadeInClass)
					.then(function () {
						$animate.removeClass(quality, fadeInClass);
					});
			}

			elements.each(function (_, el) {
				$animate.addClass(el, valueRevealClass)
					.then(function () {
						$animate.removeClass(el, valueRevealClass);
						elem.prop('disabled', false);
					});
			});
		});
	};
});


const elementRevealer = 'elementRevealer';
mainApp.directive(elementRevealer, function ($animate) {
	return function (scope, elem, attr) {

		let elements = $(elem.parent().find('.' + attr[elementRevealer]));
		const fadeInClass = 'fade-in';

		elem.on('click', function () {

			elem.prop('disabled', true);

			elements.each(function (_, el) {
				$animate.addClass(el, fadeInClass)
					.then(function () {
						$animate.removeClass(el, fadeInClass);
						elem.prop('disabled', false);
					});
			});
			scope.$digest();
		});
	}
});

mainApp.service('ControllerService', function ($animate) {

	const buttonSelector = 'input[type="button"],button';
	const disabledProp = 'disabled';

	this.fadeInAnimate = function (elements) {
		let buttons = elements.filter(buttonSelector);
		buttons.prop(disabledProp, true);

		let otherElements = elements.not(buttonSelector);

		otherElements.each(function (i, el) {
			if (i == 0) {
				$animate.addClass(el, fadeInClass)
					.then(function () {
						$animate.removeClass(el, fadeInClass);
						buttons.prop(disabledProp, false);
					});
			} else {
				$animate.addClass(el, fadeInClass)
					.then(function () {
						$animate.removeClass(el, fadeInClass);
					});
			}
		});
	};
});

mainApp.controller('SkillsController', function ($scope, ControllerService) {
	ControllerService.SkillsController = $scope;

	$scope.quality = 0;

	$scope.generateSkills = function () {
		$scope.skill = randomRange(1, 6) + 6;
		$scope.stamina = randomRange(1, 6) + randomRange(1, 6) + 12;
		$scope.luck = randomRange(1, 6) + 6;

		$scope.quality = (getQuality($scope.skill, 7, 12) + getQuality($scope.stamina, 14, 24) + getQuality($scope.luck, 7, 12)) / 3;
	}
});

mainApp.controller('GamebookController', function ($scope, $element, ControllerService) {

	ControllerService.GamebookController = $scope;

	$scope.initializeFight = function () {
		$scope.currentStep = 0;
		$scope.fled = false;

		if (typeof $scope.mainChar !== 'undefined') {
			$scope.mainChar.initialize();
		}

		if (typeof $scope.creature !== 'undefined') {
			$scope.creature.initialize();
		}
	};
	$scope.initializeFight();

	$scope.nextStep = function () {
		let turn = $scope.currentStep % 3;

		let mainChar = $scope.mainChar;
		let creature = $scope.creature;

		if (turn == 0) {

			creature.rollAttackStrength();
			$scope.mainChar.roll = '';
			mainChar.wasHit = false;
			creature.wasHit = false;

		} else if (turn == 1) {
			$scope.mainChar.rollAttackStrength();

		} else if (turn == 2) {
			let mainStrength = mainChar.char.attackStrength;
			let creatStregth = creature.char.attackStrength;

			if (mainStrength < creatStregth) {
				mainChar.char.stamina -= 2;
				mainChar.wasHit = true;

			} else if (mainStrength > creatStregth) {
				creature.char.stamina -= 2;
				creature.wasHit = true;
			}
		}

		$scope.currentStep++;
		$scope.mayUseLuck = mainChar.wasHit || creature.wasHit;
	};

	$scope.battleEnded = function () {
		return $scope.creature.char.stamina <= 0 || $scope.mainChar.char.stamina <= 0 || $scope.fled;
	};

	$scope.flee = function () {
		$scope.currentStep++;
		$scope.mainChar.char.stamina -= 2;
		$scope.mainChar.wasHit = true;
		$scope.fled = true;
		$scope.mayUseLuck = true;
	};

	$scope.statusMessage = function () {
		let attackTurn = $scope.currentStep > 0 && ($scope.currentStep) % 3 == 0;

		if ($scope.fled) {
			return 'You fled';
		} else if ($scope.currentStep > 0 && $scope.mainChar.char.stamina <= 0) {
			return 'You die!';
		} else if ($scope.currentStep > 0 && $scope.creature.char.stamina <= 0) {
			return 'Creature dies!';
		} else if ($scope.creature.wasHit && attackTurn) {
			return 'Creature loses';
		} else if ($scope.mainChar.wasHit && attackTurn) {
			return 'You lose';
		} else if ($scope.mainChar.char.attackStrength == $scope.creature.char.attackStrength && attackTurn) {
			return 'Draw';
		}

	};

	$scope.testLuck = function ($event) {
		let isLucky;
		try {
			isLucky = ControllerService.LuckController.testLuck($event);
		} catch (err) {
			return
		}

		$scope.mayUseLuck = false;

		if (isLucky && $scope.mainChar.wasHit) {
			$scope.mainChar.char.stamina++;

		} else if (isLucky && $scope.creature.wasHit) {
			$scope.creature.char.stamina -= 2;

		} else if (!isLucky && $scope.mainChar.wasHit) {
			$scope.mainChar.char.stamina--;

		} else if (!isLucky && $scope.creature.wasHit) {
			$scope.creature.char.stamina++;
		}
	};
});

mainApp.controller('CharController', function CharController($scope, $element) {

	$scope.initialize = function () {
		$scope.char = {
			stamina: 10,
			skill: 10,
			attackStrength: ''
		};

		$scope.roll = '';
	};

	$scope.initialize();

	$scope.$parent[$($element[0]).attr('char-type')] = $scope;

	$scope.rollAttackStrength = function () {
		let a = randomRange(1, 6);
		let b = randomRange(1, 6);
		$scope.roll = sprintf('%d = %d + %d', a + b, a, b);
		$scope.char.attackStrength = $scope.char.skill + a + b;
	};
});

mainApp.controller('LuckController', function ($scope, $animate, $element, ControllerService) {
	ControllerService.LuckController = $scope;

	$scope.clearLuck = function () {
		$scope.roll1 = null;
		$scope.roll2 = null;
		$scope.validationError = false;
	};

	$scope.testLuck = function ($event) {
		var clickedButton = $($event.currentTarget);

		if (!$scope.currentLuck) {
			$scope.validationError = true;
			ControllerService.fadeInAnimate($element.find('.validation').add(clickedButton));

			throw 'invalid luck';
		}

		let elementsToAnimate = $element.find('.reveal');
		if (clickedButton.parents().filter($element).length > 0) {
			elementsToAnimate = elementsToAnimate.add(clickedButton);
		}
		ControllerService.fadeInAnimate(elementsToAnimate);

		$scope.validationError = false;

		$scope.roll1 = randomRange(1, 6);
		$scope.roll2 = randomRange(1, 6);

		$scope.isLucky = $scope.roll1 + $scope.roll2 <= $scope.currentLuck;

		if ($scope.isLucky) {
			$scope.comparator = '<='
		} else {
			$scope.comparator = '>'
		}
		$scope.currentLuck--;

		return $scope.isLucky;
	};

	$scope.statusMessage = function () {
		if ($scope.isLucky) {
			return 'Lucky!';
		} else {
			return 'Unlucky :(';
		}
	};

	$scope.luckProbability = function (n) {
		function diceNumPossibilities(n) {
			if (n <= 7) {
				return n - 1;
			} else {
				return 13 - n;
			}
		}

		if (n >= 12) {
			return 1;
		} else if (n < 0) {
			return 0;
		}

		let totalPossibilities = 0;
		for (let i = 1; i <= n; i++) {
			totalPossibilities += diceNumPossibilities(i)
		}

		return totalPossibilities / 36;
	}

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