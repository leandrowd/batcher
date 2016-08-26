'use strict';

var murmurhash = require('murmurhash');

function getFunctionHash(fn) {
	return murmurhash.v3(fn.toString(), 1);
}

module.exports = function (method, interval) {
	if (!method || typeof method !== 'function') {
		throw new TypeError('The first argument should be a function');
	}

	if (!interval) {
		interval = 0;
	}

	var executors = {};
	var collectors = {};

	function execute(callbackHash) {
		return setTimeout(function () {
			var collector = collectors[callbackHash];
			method(collector.options, collector.callback);
			delete collectors[callbackHash];
		}, interval);
	}

	function aggregate(options, callback) {
		var callbackHash = getFunctionHash(callback);

		collectors[callbackHash] = collectors[callbackHash] || {
			options: [],
			hash: callbackHash
		};

		collectors[callbackHash].options.push(options);
		collectors[callbackHash].callback = callback;

		return collectors[callbackHash];
	}

	return function (options, callback) {
		if (typeof options === 'undefined') {
			throw new TypeError('Missing parameters in batched call');
		}

		var collector = aggregate(options, callback);

		if (executors[collector.hash]) {
			clearTimeout(executors[collector.hash]);
		}

		executors[collector.hash] = execute(collector.hash);
	};
};
