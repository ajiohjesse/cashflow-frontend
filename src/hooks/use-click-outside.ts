import { RefObject, useEffect } from "react";

type ClickEvent = MouseEvent | TouchEvent;

const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: ClickEvent) => void,
  exceptionsRefs?: RefObject<HTMLElement>[],
  exceptionIds?: string[],
) => {
  useEffect(() => {
    const listener = (event: ClickEvent) => {
      const element = ref.current;

      if (!element || element.contains(event.target as Node)) {
        return;
      }

      //except some dom elements from this hook
      let isException = false;

      exceptionsRefs?.some((exceptionRef) => {
        if (exceptionRef.current?.contains(event.target as Node)) {
          isException = true;
        }
        return exceptionRef;
      });

      if (isException) return;

      exceptionIds?.some((id) => {
        const domNode = document.getElementById(id);
        if (domNode && domNode.contains(event.target as Node)) {
          isException = true;
        }
        return id;
      });

      if (isException) return;

      // Call the handler only if the click is outside of the element passed.
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, exceptionsRefs]); // Reload only if ref or handler changes
};

export default useClickOutside;
