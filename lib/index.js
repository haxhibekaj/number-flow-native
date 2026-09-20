"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_OPACITY_TIMING = exports.DEFAULT_TRANSFORM_TIMING = exports.DEFAULT_LINEAR_POINTS = exports.linearEasing = exports.getDigitDelta = exports.formatToData = exports.useCanAnimate = exports.continuous = exports.NumberFlow = exports.default = void 0;
var NumberFlow_1 = require("./components/NumberFlow");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return __importDefault(NumberFlow_1).default; } });
var NumberFlow_2 = require("./components/NumberFlow");
Object.defineProperty(exports, "NumberFlow", { enumerable: true, get: function () { return __importDefault(NumberFlow_2).default; } });
var plugins_1 = require("./plugins");
Object.defineProperty(exports, "continuous", { enumerable: true, get: function () { return plugins_1.continuous; } });
var useCanAnimate_1 = require("./hooks/useCanAnimate");
Object.defineProperty(exports, "useCanAnimate", { enumerable: true, get: function () { return useCanAnimate_1.useCanAnimate; } });
var formatter_1 = require("./formatter");
Object.defineProperty(exports, "formatToData", { enumerable: true, get: function () { return formatter_1.formatToData; } });
var delta_1 = require("./delta");
Object.defineProperty(exports, "getDigitDelta", { enumerable: true, get: function () { return delta_1.getDigitDelta; } });
var easing_1 = require("./easing");
Object.defineProperty(exports, "linearEasing", { enumerable: true, get: function () { return easing_1.linearEasing; } });
Object.defineProperty(exports, "DEFAULT_LINEAR_POINTS", { enumerable: true, get: function () { return easing_1.DEFAULT_LINEAR_POINTS; } });
Object.defineProperty(exports, "DEFAULT_TRANSFORM_TIMING", { enumerable: true, get: function () { return easing_1.DEFAULT_TRANSFORM_TIMING; } });
Object.defineProperty(exports, "DEFAULT_OPACITY_TIMING", { enumerable: true, get: function () { return easing_1.DEFAULT_OPACITY_TIMING; } });
//# sourceMappingURL=index.js.map