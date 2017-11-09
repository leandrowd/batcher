// This code does not run, but it is type-checked.

import Batcher from ".";

{
    const myMethod = (payloads: any[]) => undefined;
    const batch = Batcher(myMethod);

    batch(); // No callback, e.g. batch MobX action (synchronous).
    batch(undefined, () => 123);
    batch({}, () => 123);
}

{
    const myMethod = (
        payloads: Array<{ id: number }>,
        callback: () => undefined,
    ) => undefined;

    const batch = Batcher(myMethod);
    batch({ id: 1 }, () => undefined);
}

{
    const myMethod = (payloads: Array<{ id: number }>) => undefined;

    Batcher(myMethod, 10);
    Batcher(myMethod, { maximum: 2 });
    Batcher(myMethod, { maximum: 2, interval: 1 });
}

{
    let loading = 10;

    let stop = () => {
        loading--;
    };

    /**
     * Reduces flicker on front end.
     */
    const lazyStop = () => {
        stop = Batcher(decrease, 500);
    };

    const decrease = (calls: any[]) => {
        loading -= calls.length;
    };

    if (typeof window !== "undefined") {
        lazyStop();
    }
}
