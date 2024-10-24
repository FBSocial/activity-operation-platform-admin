function _promiseWithResolvers<T>() {
  let resolve: (value: T | PromiseLike<T>) => void
  let reject: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve: resolve!, reject: reject! }
}

export function promiseWithResolvers<T>() {
  //@ts-expect-error Promise.withResolvers 是新的属性
  const withResolvers = (Promise.withResolvers.bind(Promise) ?? _promiseWithResolvers) as typeof _promiseWithResolvers
  return withResolvers<T>()
}
