/**
 * Sample AMD module
 */
define(function () {
    var module = {};

    var createSample = function () {
        var Sample = function (name) {
            this.name = name;
        };
        Sample.prototype.get_name = function () {
            return this.name || "Anonymous";
        };
        return Sample;
    };
    module.createSample = createSample;

    return module;
});
