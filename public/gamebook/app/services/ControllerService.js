angular.module('main').service('ControllerService', function ($animate) {
	const fadeInClass = 'fade-in';

	const buttonSelector = 'input[type="button"],button';
	const disabledProp = 'disabled';

	this.fadeInAnimate = function (elements) {
		let buttons = elements.filter(buttonSelector);
		buttons.prop(disabledProp, true);

		let otherElements = elements.not(buttonSelector);

		otherElements.each(function (i, el) {
			if (i == 0) {
				$animate.addClass(el, fadeInClass)
					.then(function () {
						$animate.removeClass(el, fadeInClass);
						buttons.prop(disabledProp, false);
					});
			} else {
				$animate.addClass(el, fadeInClass)
					.then(function () {
						$animate.removeClass(el, fadeInClass);
					});
			}
		});
	};
});