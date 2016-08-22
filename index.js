'use strict';

module.exports = function (method, interval) {
	if (!method || typeof method !== 'function') {
		throw new TypeError('The first argument should be a function');
	}

	if (!interval) {
		interval = 0;
	}

	var executor;
	var collector;

	function aggregator(collector, options) {
		return collector.push(options);
	}

	function reset() {
		executor = null;
		collector = [];
	}

	reset();

	function execute(fn) {
		return setTimeout(function () {
			fn();
			reset();
		}, interval);
	}

	return function (options) {
		if (typeof options === 'undefined') {
			throw new TypeError('Missing parameters in batched call');
		}

		if (executor) {
			clearTimeout(executor);
		}

		aggregator(collector, options);

		var clone = collector.slice();

		executor = execute(function () {
			return method(clone);
		});
	};
};
