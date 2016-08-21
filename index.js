'use strict';

module.exports = function (interval) {
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

	return function (fn, options) {
		if (executor) {
			clearTimeout(executor);
		}

		aggregator(collector, options);

		var clone = collector.slice();
		executor = execute(function () {
			return fn(clone);
		});
	};
};
