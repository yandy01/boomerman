export function on(element, eventType, handler) {
    element.addEventListener(eventType, handler);
    return () => element.removeEventListener(eventType, handler);
}
