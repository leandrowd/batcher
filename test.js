import test from 'ava';
import sinon from 'sinon';
import batcher from './';

test('should throw if created without a method as first argument', t => {
	t.plan(3);

	t.throws(() => batcher(), TypeError, 'The first argument should be a function');
	t.throws(() => batcher(1), TypeError, 'The first argument should be a function');
	t.notThrows(() => batcher(function () {}));
});

test('should throw if parameters are not passed to the batched call', t => {
	t.plan(2);

	const batch = batcher(function () {});

	t.throws(() => batch(), TypeError, 'Missing parameters in batched call');
	t.notThrows(() => batch({}, () => 123));
});

test.cb('should batch multiple function calls in a given interval - default is zero', t => {
	t.plan(2);

	const myMethod = sinon.spy();

	const batch = batcher(myMethod);
	const callback = () => undefined;

	batch({id: 1}, callback);
	batch({id: 2}, callback);
	batch({id: 3}, callback);
	batch({id: 4}, callback);
	batch({id: 5}, callback);

	setTimeout(() => {
		t.true(myMethod.calledOnce);
		t.true(myMethod.calledWith([{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}]));
		t.end();
	});
});

test.cb('should not batch function calls out of the interval', t => {
	t.plan(3);

	const myMethod = sinon.spy();

	const batch = batcher(myMethod);
	const callback = () => undefined;

	batch({id: 1}, callback);
	batch({id: 2}, callback);
	batch({id: 3}, callback);
	batch({id: 4}, callback);
	batch({id: 5}, callback);

	setTimeout(() => {
		batch({id: 6}, callback);

		setTimeout(() => {
			t.true(myMethod.calledTwice);
			t.true(myMethod.firstCall.calledWith([{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}]));
			t.true(myMethod.secondCall.calledWith([{id: 6}]));
			t.end();
		}, 15);
	}, 5);
});

test.cb('should not batch together function calls with different callback', t => {
	t.plan(3);

	const myMethod = sinon.spy();

	const batch = batcher(myMethod);
	const callback1 = function () { return 123; };
	const callback2 = function () { return 456; };

	batch({id: 1}, callback1);
	batch({id: 2}, callback1);
	batch({id: 3}, callback1);
	batch({id: 4}, callback1);
	batch({id: 5}, callback1);

	batch({id: 8}, callback2);
	batch({id: 9}, callback2);
	batch({id: 10}, callback2);
	batch({id: 123}, callback2);

	setTimeout(() => {
		batch({id: 6}, callback1);

		setTimeout(() => {
			console.log(JSON.stringify(myMethod.args));
			t.true(myMethod.calledThrice);
			t.true(myMethod.firstCall.calledWith([{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}]));
			t.true(myMethod.secondCall.calledWith([{id: 8}, {id: 9}, {id: 10}, {id: 123}]));
			t.true(myMethod.thirdCall.calledWith([{id: 6}]));
			t.end();
		}, 15);
	}, 5);
});

test.cb('should allow to define a custom interval', t => {
	t.plan(2);

	const myMethod = sinon.spy();

	const batch = batcher(myMethod, 10);
	const callback = () => undefined;

	batch({id: 1}, callback);
	batch({id: 2}, callback);
	batch({id: 3}, callback);
	batch({id: 4}, callback);
	batch({id: 5}, callback);

	setTimeout(() => {
		batch({id: 6}, callback);

		setTimeout(() => {
			t.true(myMethod.calledOnce);
			t.true(myMethod.calledWith([{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}]));
			t.end();
		}, 10);
	}, 5);
});
