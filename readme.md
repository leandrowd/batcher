# batcher.js [![Build Status](https://api.travis-ci.org/leandrowd/batcher.svg?branch=master)](https://api.travis-ci.org/leandrowd/batcher)

> Batch function calls with ease :)

## Install

```
$ npm install --save batcher-js
```


## Usage

```js
const batch = batcher();

batch(options => myMethod(options), {id: 1});
batch(options => myMethod(options), {id: 2});
batch(options => myMethod(options), {id: 3});
batch(options => myMethod(options), {id: 4});
batch(options => myMethod(options), {id: 5});

// -> myMethod will be called only once with [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}];
```


## API

### batcher(interval)

#### interval

Type: `number`
Default: 0

The interval between calls to be batched - defaults to 0 meaning that only calls in the same cycle of the event loop are going to be batched; Increase the number for more tolerance.


## License

MIT © [Leandro Lemos](https://github.com/leandrowd)
