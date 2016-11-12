angular.module('main').controller('GamebookController', function ($scope, $element, ControllerService, ProbabilityService) {

	ControllerService.GamebookController = $scope;

	$scope.winningChance = function () {
		if ($scope.mainChar.wasHit || $scope.creature.wasHit) {
			return ProbabilityService.probability2d6Minus2d6GreaterThan($scope.creature.char.skill - $scope.mainChar.char.skill);

		} else if ($scope.creature.roll && !$scope.mainChar.roll) {
			return ProbabilityService.probability2d6GreaterThan($scope.creature.char.attackStrength - $scope.mainChar.char.skill);

		}
		if ($scope.creature.roll && $scope.mainChar.roll) {
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
