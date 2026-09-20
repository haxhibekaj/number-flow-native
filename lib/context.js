"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowContext = void 0;
exports.useFlow = useFlow;
const react_1 = require("react");
exports.FlowContext = (0, react_1.createContext)(null);
function useFlow() {
    const value = (0, react_1.useContext)(exports.FlowContext);
    if (!value) {
        throw new Error('NumberFlow internals must be rendered inside <NumberFlow>');
    }
    return value;
}
//# sourceMappingURL=context.js.map