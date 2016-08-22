# batcher.js [![Build Status](https://api.travis-ci.org/leandrowd/batcher.svg?branch=master)](https://api.travis-ci.org/leandrowd/batcher)

> Batch function calls with ease :)

It's like a debounce but you don't need to miss the intermediate calls.

## Install

```
$ npm install --save batcher-js
```


## Usage

```js
const batch = batcher(myMethod);

batch({id: 1});
batch({id: 2});
batch({id: 3});
batch({id: 4});
batch({id: 5});

// -> myMethod will be called only once with [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}];
```


## API

### batcher(method, interval)

Returns a batch method to wrap each call to be batched. Use one for each purpose.

#### method

Type: `function`

The method to be batched

#### interval

Type: `number`
Default: 0

The interval between calls to be batched - defaults to 0 meaning that only calls in the same cycle of the event loop are going to be batched; Increase the number for more tolerance.


### batch(options)
> The return of a call for batcher()

#### options

Type: `any`

The arguments to be passed to the batched method. It will be pushed to an Array and passed to the method at the end of the batch.


## License

MIT © [Leandro Lemos](https://github.com/leandrowd)
