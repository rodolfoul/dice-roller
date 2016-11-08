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

mainApp.controller('GamebookController', function ($scope, $element, ControllerService, ProbabilityService) {

	ControllerService.GamebookController = $scope;

	$scope.winningChance = function () {
		if($scope.mainChar.wasHit || $scope.creature.wasHit) {
			return ProbabilityService.probability2d6Minus2d6GreaterThan($scope.creature.char.skill - $scope.mainChar.char.skill);

		} else if ($scope.creature.roll && !$scope.mainChar.roll) {
			return ProbabilityService.probability2d6GreaterThan($scope.creature.char.attackStrength - $scope.mainChar.char.skill);

		} if ($scope.creature.roll && $scope.mainChar.roll) {
			return $scope.mainChar.char.attackStrength > $scope.creature.char.attackStrength

		} else {
			return ProbabilityService.probability2d6Minus2d6GreaterThan($scope.creature.char.skill - $scope.mainChar.char.skill);
		}
	};

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

	$scope.nextStep = function ($event) {
		let turn = $scope.currentStep % 3;

		let mainChar = $scope.mainChar;
		let creature = $scope.creature;

		if (turn == 0) {

			creature.rollAttackStrength();
			mainChar.roll = '';
			mainChar.wasHit = false;
			creature.wasHit = false;

		} else if (turn == 1) {
			mainChar.rollAttackStrength();

		} else if (turn == 2) {
			let mainStrength = mainChar.char.attackStrength;
			let creatStregth = creature.char.attackStrength;

			let elementsToAnimate = $element.find(['.turn-result']);

			if (mainStrength < creatStregth) {
				mainChar.hit(-2);

			} else if (mainStrength > creatStregth) {
				creature.hit(-2);
			}

			ControllerService.fadeInAnimate($element.find('.turn-result'));
		}

		$scope.currentStep++;
		$scope.mayUseLuck = (mainChar.wasHit || creature.wasHit) && creature.char.stamina > 0;

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
			$scope.mainChar.hit(1);

		} else if (isLucky && $scope.creature.wasHit) {
			$scope.creature.hit(-2);

		} else if (!isLucky && $scope.mainChar.wasHit) {
			$scope.mainChar.hit(-1);

		} else if (!isLucky && $scope.creature.wasHit) {
			$scope.creature.hit(1);
		}
	};
});

mainApp.controller('CharController', function CharController($scope, $element, ControllerService) {

	$scope.initialize = function () {
		$scope.char = {
			stamina: 10,
			skill: 10,
			attackStrength: ''
		};

		$scope.roll = '';
	};

	$scope.hit = function (hpChange) {
		$scope.char.stamina += hpChange;
		$scope.wasHit = true;

		ControllerService.fadeInAnimate($element.find('.health'))
	};

	$scope.initialize();

	$scope.$parent[$($element[0]).attr('char-type')] = $scope;

	$scope.rollAttackStrength = function () {
		let a = randomRange(1, 6);
		let b = randomRange(1, 6);
		$scope.roll = sprintf('%d = %d + %d', a + b, a, b);
		$scope.char.attackStrength = $scope.char.skill + a + b;
		ControllerService.fadeInAnimate($element.find('.fight-value'));
	};
});

mainApp.service('ProbabilityService', function () {
	function variationsFor2d6and2d6Combination(a, b) {
		if (a > 7) {
			a = 14 - a;
		}
		if (b > 7) {
			b = 14 - b;
		}
		return (a - 1) * (b - 1);
	}

	function variants2d6Minus2d6(difference) {
		let sum = 0;

		difference = Math.abs(difference);

		for (let i = 2; i + difference <= 12; i++) {
			sum += variationsFor2d6and2d6Combination(i, i + difference)
		}

		return sum;
	}

	function variants2d6Sum(n) {
		if (n <= 7) {
			return n - 1;
		} else {
			return 13 - n;
		}
	}

	this.probability2d6GreaterThan = function (D) {
		return 1 - this.probability2d6LessOrEqualTo(D);
	};

	this.probability2d6Minus2d6GreaterThan = function (D) {
		if (D >= 10) {
			return 0;
		} else if (D < -10) {
			return 1;
		}
		let possibilitiesSum = 0;
		for (let i = 10; i > D; i--) {
			possibilitiesSum += variants2d6Minus2d6(i);
		}
		return possibilitiesSum / (6 * 6 * 6 * 6);
	};

	this.probability2d6LessOrEqualTo = function (n) {
		if (n >= 12) {
			return 1;
		} else if (n < 0) {
			return 0;
		}

		let totalPossibilities = 0;
		for (let i = 1; i <= n; i++) {
			totalPossibilities += variants2d6Sum(i)
		}

		return totalPossibilities / 36;
	}
});

mainApp.controller('LuckController', function ($scope, $animate, $element, ControllerService, ProbabilityService) {
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

	$scope.luckProbability = ProbabilityService.probability2d6LessOrEqualTo;

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