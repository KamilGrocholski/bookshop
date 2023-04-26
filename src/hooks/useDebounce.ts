import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delayInMs: number = 200): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delayInMs);

    return () => {
      clearTimeout(timeoutId);
    };
  });

  return debouncedValue;
}
