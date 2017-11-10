'use strict';

function get(arr, key) {
	return findFirstPair(arr, key, function (i) {
		return arr[i].value;
	});
}

function set(arr, key, value) {
	var found = findFirstPair(arr, key, function (i) {
		arr[i].value = value;
		return true;
	});

	if (!found) {
		arr.push({key: key, value: value});
	}
}

function del(arr, key) {
	findFirstPair(arr, key, function (i) {
		arr.splice(i, 1);
	});
}

function findFirstPair(arr, key, func) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].key === key) {
			return func(i);
		}
	}
	return null;
}

module.exports = function (method, settings) {
	if (!method || typeof method !== 'function') {
		throw new TypeError('The first argument should be a function');
	}

	var interval = 0;
	var maximum = null;

	// keeps compatibility with initial version
	if (typeof settings === 'number') {
		interval = settings;
	} else if (typeof settings === 'object') {
		interval = settings.interval;
		maximum = settings.maximum || null;
	}

	var executors = [];
	var collectors = [];

	function execute(callback) {
		return setTimeout(function () {
			run(callback);
		}, interval);
	}

	function run(callback) {
		method(get(collectors, callback), callback);
		del(collectors, callback);
	}

	function aggregate(options, callback) {
		var collector = get(collectors, callback) || [];
		collector.push(options);
		set(collectors, callback, collector);
		return collector;
	}

	return function (options, callback) {
		var collector = aggregate(options, callback);
		var executor = get(executors, callback);
		if (executor) {
			clearTimeout(executor);
		}
		set(executors, callback, execute(callback));

		if (maximum && collector.length >= maximum) {
			clearTimeout(get(executors, callback));
			run(callback);
		}
	};
};
