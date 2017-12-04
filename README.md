# racing-for-await-of
Yield value from any resolved promise in array in for-await-of loop as soon as it resolved.

If you use for-await-of array of promises, you iterate over it by initial order, doesn't matter if the next promise in given array is resolved before the previous one:

```javascript
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

(async function () {
    const arr = [
        sleep(2000).then(() => 'a'),
        'x',
        sleep(1000).then(() => 'b'),
        'y',
        sleep(3000).then(() => 'c'),
        'z',
    ];

    for await (const item of arr) {
        console.log(item);
    }
}());

// Output
// a
// x
// b
// y
// z
```

But sometimes you need to get next result of any promise in given array as soon as it resolved. To achieve it, import current module and wrap your array in for-await-of as shown below:

```javascript
import raceIterator from 'racing-for-await-of';

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

(async function () {
    const arr = [
        sleep(2000).then(() => 'a'),
        'x',
        sleep(1000).then(() => 'b'),
        'y',
        sleep(3000).then(() => 'c'),
        'z',
    ];

    for await (const item of raceIterator(arr)) {
        console.log(item);
    }
}());

// Output
// x
// y
// z
// b
// a
// c
```
