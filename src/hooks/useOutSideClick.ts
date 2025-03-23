import { useEffect } from "react";

export default function useOutSideClick(
  ref: React.RefObject<HTMLElement>,
  exceptionId: string,
  callback: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const dropdown = document.getElementById(exceptionId);

      if (
        ref.current &&
        !ref.current.contains(target) &&
        !dropdown?.contains(target)
      ) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback, exceptionId]);
}
