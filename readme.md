# batcher.js [![Build Status](https://api.travis-ci.org/leandrowd/batcher.svg?branch=master)](https://api.travis-ci.org/leandrowd/batcher)

> Batch function calls with ease :)

It's like a debounce but you don't need to miss the intermediate calls.

Batcher aggregates your options and group calls in a given interval using a function hash, so you can avoid repetitive calls to the same function.

## Install

```
$ npm install --save batcher-js
```


## Usage

```js
const batch = batcher(myMethod);

const callback1 = () => 'callback1';
const callback2 = () => 'callback2';

batch({id: 1}, callback1);
batch({id: 2}, callback1);
batch({id: 3}, callback1);
batch({id: 4}, callback1);
batch({id: 5}, callback1);
batch({id: 6}, callback2);
batch({id: 7}, callback2);

// there will be only two calls to myMethod:
// -> myMethod([{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}], callback1); //and
// -> myMethod([{id: 6}, {id: 7}], callback2);
```

More examples available in [test.js](test.js)

### TypeScript

Definitions are included.

```typescript
import Batcher from "batcher-js";
```

More examples available in [batcher-js-tests.ts](batcher-js-tests.ts)

## API

### batcher(method, settings)

Returns a batch method to wrap each call to be batched. Use one for each purpose.

#### method

Type: `function`

The method to be batched

#### settings

Type: `object`
Default: {
	interval: 0,
	maximum: null
}

Custom settings for the batcher. It allows to customize:
	- `interval`:  the interval between calls to be batched - defaults to 0 meaning that only calls in the same cycle of the event loop are going to be batched; Increase the number for more tolerance.
	- `maximum`: the maximum ammount of calls to be batched - defaults to null or no limit. Use this number if your api has a limit.


### batch(options, callback)
> The return of a call for batcher()

#### options

Type: `any`

The arguments to be passed to the batched method. It will be pushed to an Array and passed to the method at the end of the batch.


#### callback

Type: `function`

The callback to be passed to the batched method. Calls are grouped based on the hash of this method.

## License

MIT © [Leandro Lemos](https://github.com/leandrowd)
