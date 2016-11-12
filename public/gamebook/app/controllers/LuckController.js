angular.module('main').controller('LuckController', function ($scope, $animate, $element, ControllerService, ProbabilityService) {
	ControllerService.LuckController = $scope;


	$scope.clearLuck = function () {
		$scope.roll1 = null;
		$scope.roll2 = null;
		$scope.validationError = false;
	};

	randomRange = ProbabilityService.randomRange;
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