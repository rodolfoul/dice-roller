angular.module('main').service('ControllerService', function ($animate) {
	const fadeInClass = 'fade-in';
	const tdFadeInClass = 'value-reveal';

	const buttonSelector = 'input[type="button"], button';
	const disabledProp = 'disabled';

	this.fadeInAnimate = function (elements) {
		let buttons = elements.filter(buttonSelector);
		buttons.prop(disabledProp, true);


		let otherElements = elements.not(buttonSelector);
		otherElements.each(function (i, el) {

			let animationClass;
			if ($(el).is('td')) {
				animationClass = tdFadeInClass;
			} else {
				animationClass = fadeInClass;
			}

			if (i == 0) {
				$animate.addClass(el, animationClass)
					.then(function () {
						$animate.removeClass(el, animationClass);
						buttons.prop(disabledProp, false);
					});
			} else {
				$animate.addClass(el, animationClass)
					.then(function () {
						$animate.removeClass(el, animationClass);
					});
			}
		});
	};
});