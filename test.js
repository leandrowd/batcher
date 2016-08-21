import test from 'ava';
import sinon from 'sinon';
import batcher from './';

test.cb('will batch multiple function calls in a given interval - default is zero', t => {
	t.plan(2);

	const myMethod = sinon.spy();

	const batch = batcher();

	batch(options => myMethod(options), {id: 1});
	batch(options => myMethod(options), {id: 2});
	batch(options => myMethod(options), {id: 3});
	batch(options => myMethod(options), {id: 4});
	batch(options => myMethod(options), {id: 5});

	setTimeout(() => {
		t.true(myMethod.calledOnce);
		t.true(myMethod.calledWith([{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}]));
		t.end();
	});
});

test.cb('will not batch function calls out of the interval', t => {
	t.plan(3);

	const myMethod = sinon.spy();

	const batch = batcher();

	batch(options => myMethod(options), {id: 1});
	batch(options => myMethod(options), {id: 2});
	batch(options => myMethod(options), {id: 3});
	batch(options => myMethod(options), {id: 4});
	batch(options => myMethod(options), {id: 5});

	setTimeout(() => {
		batch(options => myMethod(options), {id: 6});

		setTimeout(() => {
			t.true(myMethod.calledTwice);
			t.true(myMethod.firstCall.calledWith([{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}]));
			t.true(myMethod.secondCall.calledWith([{id: 6}]));
			t.end();
		}, 15);
	}, 5);
});

test.cb('will allow to define a custom interval', t => {
	t.plan(2);

	const myMethod = sinon.spy();

	const batch = batcher(10);

	batch(options => myMethod(options), {id: 1});
	batch(options => myMethod(options), {id: 2});
	batch(options => myMethod(options), {id: 3});
	batch(options => myMethod(options), {id: 4});
	batch(options => myMethod(options), {id: 5});

	setTimeout(() => {
		batch(options => myMethod(options), {id: 6});

		setTimeout(() => {
			t.true(myMethod.calledOnce);
			t.true(myMethod.calledWith([{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}]));
			t.end();
		}, 10);
	}, 5);
});
