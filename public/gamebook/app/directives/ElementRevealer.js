(function () {
	const elementRevealer = 'elementRevealer';
	angular.module('main').directive(elementRevealer, function ($animate) {
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
})();