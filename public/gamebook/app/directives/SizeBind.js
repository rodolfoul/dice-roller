(function () {
	const sizeBind = 'sizeBind';
	angular.module('main').directive(sizeBind, function () {
		return function (scope, ele, attr, ctrl) {

			scope.$watch(function () {
				let size = ele.css(['width', 'height']);
				return size.width + size.height;

			}, function (newValue, oldValue) {
				scope[attr[sizeBind]] = newValue;
			});
		}
	});
})();
