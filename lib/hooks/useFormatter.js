"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatter = useFormatter;
const react_1 = require("react");
// Intl.NumberFormat instances are expensive to build, so they are cached by
// their serialized options, exactly as the web version does.
const formatterCache = new Map();
const getCachedFormatter = (key, locales, format) => {
    const cached = formatterCache.get(key);
    if (cached)
        return cached;
    const created = new Intl.NumberFormat(locales, format);
    formatterCache.set(key, created);
    return created;
};
function useFormatter(locales, format) {
    const key = JSON.stringify([locales ?? null, format ?? null]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key captures locales and format
    return (0, react_1.useMemo)(() => getCachedFormatter(key, locales, format), [key]);
}
//# sourceMappingURL=useFormatter.js.map