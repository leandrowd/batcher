'use strict';

module.exports = interval => {
	if (!interval) {
		interval = 0;
	}

	let executor;
	let collector;

	const aggregator = (collector, options) => collector.push(options);

	const reset = () => {
		executor = null;
		collector = [];
	};

	reset();

	const execute = fn => setTimeout(() => {
		fn();
		reset();
	}, interval);

	return (fn, options) => {
		if (executor) {
			clearTimeout(executor);
		}

		aggregator(collector, options);
		const clone = collector.slice();
		executor = execute(() => fn(clone));
	};
};
