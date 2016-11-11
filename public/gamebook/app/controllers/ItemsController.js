angular.module('main').controller('ItemsController', function ($scope, $localStorage) {
	$scope.storage = $localStorage;
});
