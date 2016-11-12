angular.module('gamebook').controller('SkillsController', function ($scope, $localStorage, $element, ControllerService, ProbabilityService) {
	ControllerService.SkillsController = $scope;

	$scope.quality = 0;
	$scope.storage = $localStorage;

	function getQuality(value, min, max) {
		return 100 * (value - min) / (max - min);
	}

	let randomRange = ProbabilityService.randomRange;
	$scope.generateSkills = function ($event) {
		$scope.storage.skill = randomRange(1, 6) + 6;
		$scope.storage.stamina = randomRange(1, 6) + randomRange(1, 6) + 12;
		$scope.storage.luck = randomRange(1, 6) + 6;

		ControllerService.fadeInAnimate($element.find('.skill-roll').add($event.currentTarget));
	};

	$scope.calculateQuality = function () {
		return (getQuality($scope.storage.skill, 7, 12) + getQuality($scope.storage.stamina, 14, 24) + getQuality($scope.storage.luck, 7, 12)) / 3;
	};

	$scope.applySkills = function () {
		ControllerService.FightController.mainChar.char.skill = $scope.storage.skill;
		ControllerService.FightController.mainChar.char.stamina = $scope.storage.stamina;
		$scope.storage.currentLuck = $scope.storage.luck;
	};

	$scope.mayApplySkills = function () {
		return ControllerService.FightController.currentStep != 0;
	};
});