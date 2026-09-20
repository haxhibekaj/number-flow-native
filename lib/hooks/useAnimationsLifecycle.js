"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAnimationsLifecycle = useAnimationsLifecycle;
const react_1 = require("react");
/**
 * Emits a single start event when animations begin and a single finish event
 * once no update has arrived for `duration` ms, mirroring NumberFlow's
 * `animationsstart` / `animationsfinish` events.
 */
function useAnimationsLifecycle({ duration, onAnimationsStart, onAnimationsFinish, }) {
    const callbacks = (0, react_1.useRef)({ onAnimationsStart, onAnimationsFinish });
    (0, react_1.useEffect)(() => {
        callbacks.current = { onAnimationsStart, onAnimationsFinish };
    }, [onAnimationsStart, onAnimationsFinish]);
    const timer = (0, react_1.useRef)(null);
    const finish = (0, react_1.useCallback)(() => {
        timer.current = null;
        callbacks.current.onAnimationsFinish?.();
    }, []);
    const notifyUpdate = (0, react_1.useCallback)(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        else {
            callbacks.current.onAnimationsStart?.();
        }
        timer.current = setTimeout(finish, duration);
    }, [duration, finish]);
    const finishNow = (0, react_1.useCallback)(() => {
        if (!timer.current)
            return;
        clearTimeout(timer.current);
        finish();
    }, [finish]);
    (0, react_1.useEffect)(() => () => {
        if (timer.current)
            clearTimeout(timer.current);
    }, []);
    return (0, react_1.useMemo)(() => ({ notifyUpdate, finishNow }), [notifyUpdate, finishNow]);
}
//# sourceMappingURL=useAnimationsLifecycle.js.map