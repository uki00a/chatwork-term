import { createContext, useContext, createElement } from 'rax';

/**
 * adopted from https://github.com/jamiebuilds/unstated-next
 */

/**
 * @template T
 * @param {T} hook
 */
export function createContainer(hook) {
  const Context = createContext(null);

  /**
   * @returns {ReturnType<T>}
   */
  function useContainer() {
    return useContext(Context);
  }

  function Provider({ children, ...rest }) {
    const container = hook(rest);
    return (
      <Context.Provider value={container}>
        {children}
      </Context.Provider>
    );
  }

  return { useContainer, Provider };
}

/**
 * @template T
 * @param {{ useContainer: () => T }} Container
 */
export function useContainer(Container) {
  return Container.useContainer();
}