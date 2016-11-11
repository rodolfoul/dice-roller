angular.module('main').service('ProbabilityService', function () {
	const UINT32_MAX_VALUE = 0xFFFFFFFF;

	function variationsFor2d6and2d6Combination(a, b) {
		if (a > 7) {
			a = 14 - a;
		}
		if (b > 7) {
			b = 14 - b;
		}
		return (a - 1) * (b - 1);
	}

	function variants2d6Minus2d6(difference) {
		let sum = 0;

		difference = Math.abs(difference);

		for (let i = 2; i + difference <= 12; i++) {
			sum += variationsFor2d6and2d6Combination(i, i + difference)
		}

		return sum;
	}

	function variants2d6Sum(n) {
		if (n <= 7) {
			return n - 1;
		} else {
			return 13 - n;
		}
	}

	this.probability2d6GreaterThan = function (D) {
		return 1 - this.probability2d6LessOrEqualTo(D);
	};

	this.probability2d6Minus2d6GreaterThan = function (D) {
		if (D >= 10) {
			return 0;
		} else if (D < -10) {
			return 1;
		}
		let possibilitiesSum = 0;
		for (let i = 10; i > D; i--) {
			possibilitiesSum += variants2d6Minus2d6(i);
		}
		return possibilitiesSum / (6 * 6 * 6 * 6);
	};

	this.probability2d6LessOrEqualTo = function (n) {
		if (n >= 12) {
			return 1;
		} else if (n < 0) {
			return 0;
		}

		let totalPossibilities = 0;
		for (let i = 1; i <= n; i++) {
			totalPossibilities += variants2d6Sum(i)
		}

		return totalPossibilities / 36;
	};

	this.randomRange = function (minimum, maximum) {
		let arr = new Uint32Array(1);
		let n = window.crypto.getRandomValues(arr)[0] / UINT32_MAX_VALUE;
		return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
	}
});