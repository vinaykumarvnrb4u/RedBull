const debounce = (func, delay) => {
    let inDebounce
    return function(...arguments) {
      const context = this
      const args = arguments
      clearTimeout(inDebounce)
      inDebounce = setTimeout(() =>{ func.apply(context, args) }, delay)
    }
  }

// const debounce = (func, delay) => {
//     console.log('In debouncer');
//     let debounceTimer;
//     return ({...args}) => {
//         console.log(args);
//         clearTimeout(debounceTimer);
//         debounceTimer = setTimeout(() => func.apply(this, args), delay);
//     }
// }

module.exports = debounce;