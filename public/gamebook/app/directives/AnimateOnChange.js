(function () {
	const animateOnChange = 'animateOnChange';

	angular.module('main').directive(animateOnChange, function ($animate) {

		return function (scope, elem, attr) {
			scope.$watch(attr[animateOnChange], function () {
				$animate.addClass(elem, fadeInClass).then(function () {
					$animate.removeClass(elem, fadeInClass);
				});
			});
		};
	});
})();