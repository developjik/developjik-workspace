import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Hook to track element visibility using Intersection Observer API
 * @param options - Intersection Observer options
 * @returns [ref, entry, isIntersecting]
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLDivElement>, IntersectionObserverEntry | null, boolean] {
  const elementRef = useRef<HTMLDivElement>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;

  const frozen = freezeOnceVisible && isIntersecting;

  useEffect(() => {
    const element = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !element) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        if (freezeOnceVisible && entry.isIntersecting) {
          observer.unobserve(element);
        }
      },
      observerParams
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, frozen, freezeOnceVisible]);

  return [elementRef, entry, isIntersecting];
}

/**
 * Hook for lazy loading components when they come into view
 * @param options - Intersection Observer options
 * @returns [ref, isVisible]
 */
export function useLazyLoad(
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLDivElement>, boolean] {
  const [ref, , isIntersecting] = useIntersectionObserver({
    ...options,
    freezeOnceVisible: true,
  });

  return [ref, isIntersecting];
}