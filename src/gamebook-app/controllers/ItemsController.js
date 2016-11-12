angular.module('gamebook').controller('ItemsController', function ($scope, $localStorage) {
	$scope.storage = $localStorage;
});
