(function () {
	const valueRevealerDirective = 'valueRevealer';
	angular.module('main').directive(valueRevealerDirective, function ($animate) {
		return function (scope, elem, attr) {

			let elements = $(elem.siblings().find('.' + attr[valueRevealerDirective]));
			let quality = $(elem.siblings().find('.quality'));


			const valueRevealClass = 'value-reveal';
			const fadeInClass = 'fade-in';

			elem.on('click', function () {

				elem.prop('disabled', true);

				if (quality.length > 0) {
					$animate.addClass(quality, fadeInClass)
						.then(function () {
							$animate.removeClass(quality, fadeInClass);
						});
				}

				elements.each(function (_, el) {
					$animate.addClass(el, valueRevealClass)
						.then(function () {
							$animate.removeClass(el, valueRevealClass);
							elem.prop('disabled', false);
						});
				});
			});
		};
	});
})();