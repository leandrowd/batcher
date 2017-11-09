// Type definitions for batcher-js 1.0.1
// Project: https://github.com/leandrowd/batcher
// Definitions by: makepost <https://github.com/makepost>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/**
 * Groups calls in a given interval using a function hash. Like a
 * debounce but you don't miss intermediate calls.
 */
export default function Batcher<T>(
  method: (payloads: T[], callback?: any) => void,

  /**
   * Custom settings for the batcher, or just the interval.
   */
  settings?: {
    /**
     * How long to wait before executing callback. If 0, only batches calls
     * in same event loop cycle.
     */
    interval?: number

    /**
     * Callback and start fresh after this many calls. Use if your api
     * has a limit.
     */
    maximum?: number,
  } | number,
): (
  /**
   * Pushed to an Array, passed to the method at the end of the batch.
   */
  payload?: T,

  /**
   * The callback to be passed to the batched method. Calls are grouped
   * based on the hash of this method.
   */
  callback?: any,
) => void;
