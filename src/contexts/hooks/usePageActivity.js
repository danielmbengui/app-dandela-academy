import { useEffect, useRef, useState } from "react";

/**
 * Hook générique pour suivre l'activité de la page.
 *
 * - isVisible: true/false en fonction de document.visibilityState
 * - onVisible: callback quand la page redevient visible
 * - onHidden: callback quand la page devient cachée (autre onglet, minimisée, etc.)
 * - onBeforeUnload: callback juste avant de quitter la page (reload, close, navigation)
 */
export function usePageActivity({
  onVisible,
  onHidden,
  onBeforeUnload,
} = {}) {
  const [isVisible, setIsVisible] = useState(
    typeof document !== "undefined"
      ? document.visibilityState === "visible"
      : true
  );

  // on garde les callbacks dans des refs pour éviter de recréer les listeners
  const onVisibleRef = useRef(onVisible);
  const onHiddenRef = useRef(onHidden);
  const onBeforeUnloadRef = useRef(onBeforeUnload);

  useEffect(() => {
    onVisibleRef.current = onVisible;
  }, [onVisible]);

  useEffect(() => {
    onHiddenRef.current = onHidden;
  }, [onHidden]);

  useEffect(() => {
    onBeforeUnloadRef.current = onBeforeUnload;
  }, [onBeforeUnload]);

  useEffect(() => {
    function handleVisibilityChange() {
      const visible = document.visibilityState === "visible";
      setIsVisible(visible);

      if (visible) {
        // l'utilisateur revient sur la page
        if (onVisibleRef.current) {
          onVisibleRef.current();
        }
      } else {
        // l'utilisateur quitte visuellement la page (autre onglet, fenêtre min…)
        if (onHiddenRef.current) {
          onHiddenRef.current();
        }
      }
    }

    function handleBeforeUnload(event) {
      if (onBeforeUnloadRef.current) {
        onBeforeUnloadRef.current();
      }
      // Si tu veux afficher un message de confirmation (pas toujours garanti)
      // event.preventDefault();
      // event.returnValue = "";
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return { isVisible };
}
