import { useMemo, useCallback, useRef } from 'react';

/**
 * Deep equality check for objects and arrays
 */
function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  
  if (a == null || b == null) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  
  return false;
}

/**
 * useMemo with deep equality check
 */
export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<{ deps: React.DependencyList; value: T }>();
  
  if (!ref.current || !deepEqual(deps, ref.current.deps)) {
    ref.current = {
      deps,
      value: factory(),
    };
  }
  
  return ref.current.value;
}

/**
 * useCallback with deep equality check for dependencies
 */
export function useDeepCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useDeepMemo(() => callback, deps);
}

/**
 * Stable reference hook - returns the same reference unless value changes
 */
export function useStableReference<T>(value: T): T {
  const ref = useRef<T>(value);
  
  if (!deepEqual(ref.current, value)) {
    ref.current = value;
  }
  
  return ref.current;
}

/**
 * Expensive computation hook with caching
 */
export function useExpensiveValue<T, Args extends any[]>(
  computeFn: (...args: Args) => T,
  args: Args,
  keyFn?: (...args: Args) => string
): T {
  const cacheRef = useRef<Map<string, T>>(new Map());
  
  const key = keyFn ? keyFn(...args) : JSON.stringify(args);
  
  return useMemo(() => {
    if (cacheRef.current.has(key)) {
      return cacheRef.current.get(key)!;
    }
    
    const result = computeFn(...args);
    cacheRef.current.set(key, result);
    
    // Limit cache size
    if (cacheRef.current.size > 100) {
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
    }
    
    return result;
  }, [key]);
}

/**
 * Previous value hook - returns the previous value of a variable
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  
  const prevValue = ref.current;
  ref.current = value;
  
  return prevValue;
}

/**
 * Changed hook - returns true if value has changed since last render
 */
export function useChanged<T>(value: T): boolean {
  const prevValue = usePrevious(value);
  return !deepEqual(prevValue, value);
}

/**
 * Memoize component props to prevent unnecessary re-renders
 */
export function useMemoizedProps<T extends object>(props: T): T {
  return useDeepMemo(() => props, Object.values(props));
}