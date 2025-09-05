function myDebounce(fn, delay, immediate) {
  let timer = null;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    if (immediate) {
      const callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      if (callNow) fn.apply(this, args);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
}

function myThrrottle(fn, delay) {
  let timer = null;
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();
    const remaining = delay - (now - lastTime);

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(this, args);
      lastTime = now;
    } else if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        lastTime = Date.now();
        timer = null;
      }, remaining);
    }
  };
}

export { myDebounce, myThrrottle };
