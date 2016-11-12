angular.module('main').controller('CharController', function CharController($scope, $element, ControllerService, ProbabilityService) {

	$scope.initialize = function () {
		$scope.char = $scope.char || {
			stamina: null,
			skill: null,
			attackStrength: null
		};

		$scope.roll = null;
	};

	$scope.hit = function (hpChange) {
		$scope.char.stamina += hpChange;
		$scope.wasHit = true;

		ControllerService.fadeInAnimate($element.find('.health'))
	};


	$scope.initialize();
	$scope.$parent[$($element[0]).attr('char-type')] = $scope;
	let randomRange = ProbabilityService.randomRange;

	$scope.rollAttackStrength = function () {
		let a = randomRange(1, 6);
		let b = randomRange(1, 6);
		$scope.roll = sprintf('%d = %d + %d', a + b, a, b);
		$scope.char.attackStrength = $scope.char.skill + a + b;
		ControllerService.fadeInAnimate($element.find('.fight-value'));
	};
});