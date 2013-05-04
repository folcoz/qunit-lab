/**
 * Utilities for the tests
 */

// Object.create(prototype) definition
if (typeof Object.create !== "function") {
    Object.create = function (o) {
        var F = function () {
        };
        F.prototype = o;
        return new F();
    };
}

var utils = (function () {
    var log = function (text) {
            if (window && window.console && window.console.log) {
                window.console.log(text);
            }
        },
        defineSample = function () {
            var Sample = function (name) {
                this.name = name;
            };
            Sample.prototype.get_name = function () {
                return this.name || "Anonymous";
            };
            return Sample;
        },
        // inside try ... catch to cope with IE bug!
        safeDelete = function (obj, propname) {
            if (obj && obj[propname]) {
                try {
                    delete obj[propname];
                }
                catch (e) {
                    obj[propname] = undefined;
                    log(e);
                    if (obj === window) {
                        log("Most likely this is a bug in IE when deleting a dynamic property on the 'window' global object");
                    }
                }
            }
        },
        isNumber = function (value) {
            return typeof value === "number" && isFinite(value);
        },
        isArray = function (a) {
            var toStr = Object.prototype.toString;
            return toStr.apply(a) === "[object Array]";
        },
        u = {
            log: log,
            defineSample: defineSample,
            safeDelete: safeDelete,
            isNumber: isNumber,
            isArray: isArray
        };
    return u;
}());
