async function* raceIterator(promises) {
  let leftToResolve = [];

  for (const promise of promises) {
    if (!promise || typeof promise !== 'object' || typeof promise.then !== 'function') {
      // Yield non-promise-like value right away, since it doesn't need to be waited
      yield promise;
    } else {
      const item = {status: 'pending'};

      item.promise = promise.then((val, error) => {
        item.status = 'resolved';
        leftToResolve = leftToResolve.filter(item => item.status !== 'resolved')

        if (error) {
          throw error;
        }

        return val;
      });

      leftToResolve.push(item);
    }
  }

  while (leftToResolve.length) {
    yield await Promise.race(leftToResolve.map(item => item.promise));
  }
}

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = raceIterator;
