(function () {
	const sizeBindDirective = 'sizeBind';
	angular.module('main').directive(sizeBindDirective, function () {
		return {
			restrict: 'A',
			scope: {
				size: '=' + sizeBindDirective
			},

			link: function (scope, ele) {

				let arr = scope.size;
				if (arr != null) {
					ele.css({
						width: arr[0],
						height: arr[1]
					});
				}

				scope.$watch(function () {
					let size = ele.css(['width', 'height']);
					return [size.width, size.height];

				}, function (newValue, oldValue) {
					if (newValue != oldValue) {
						scope.size = newValue;
					}

				}, true);
			}
		}
	});
})();
