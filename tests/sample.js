/*global define */

/**
 * Sample AMD module
 */
define(function () {
    'use strict';

    var module = {};

    module.createSample = function () {
        var Sample = function (name) {
            this.name = name;
        };
        Sample.prototype.get_name = function () {
            return this.name || "Anonymous";
        };
        return Sample;
    };

    return module;
});
