angular.module('main').directive('integer', function () {
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