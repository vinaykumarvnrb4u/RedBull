const debounce = (func, delay) => {
    let inDebounce
    return function(...arguments) {
      const context = this
      const args = arguments
      clearTimeout(inDebounce)
      inDebounce = setTimeout(() =>{ func.apply(context, args) }, delay)
    }
  }

module.exports = debounce;