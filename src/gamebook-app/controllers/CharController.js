angular.module('gamebook').controller('CharController', function CharController($scope, $element, $localStorage, ControllerService, ProbabilityService) {

	let charType = $($element[0]).attr('char-type');
	$scope.$parent[charType] = $scope;
	let randomRange = ProbabilityService.randomRange;

	$scope.initialize = function () {
		$localStorage[charType] = $localStorage[charType] || {
				stamina: null,
				skill: null,
				attackStrength: null
			};

		$scope.char = $localStorage[charType];

		$scope.roll = null;
	};
	$scope.initialize();

	$scope.hit = function (hpChange) {
		$scope.char.stamina += hpChange;
		$scope.wasHit = true;

		ControllerService.fadeInAnimate($element.find('.health'))
	};

	$scope.rollAttackStrength = function () {
		let a = randomRange(1, 6);
		let b = randomRange(1, 6);
		$scope.roll = sprintf('%d = %d + %d', a + b, a, b);
		$scope.char.attackStrength = $scope.char.skill + a + b;
		ControllerService.fadeInAnimate($element.find('.fight-value'));
	};
});