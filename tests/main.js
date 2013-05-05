/*global require, QUnit, _, utils */

require.config({
    baseUrl: "tests"
});

(function (qu) {
    //'use strict';
    
    qu.module("Simple types and typeof");

    qu.test("sample test", function () {

        function cualquiera() {
            var slice = Array.prototype.slice;
            var args = slice.call(arguments, 1);
            return args;
        }

        qu.deepEqual(cualquiera("una", "bobada", "cualquiera"), ["bobada", "cualquiera"], "He birlado slice a Array!");

        var sitio = {title: "CEPSA", domain: "www.cepsa.com"},
            sitios = [
                {title: "Google", domain: "www.google.com"},
                {title: "Wikipedia", domain: "es.wikipedia.org"},
                sitio
            ];

        var persona = {
            nombre: "Drácula",
            titulo: "Conde",
            direccion: {
                tipo: "Castillo",
                nombre: "Transilvania",
                numero: "s/n"
            },
            aficiones: [
                {descripcion: "Bebidas energéticas", esDeporte: false},
                {descripcion: "Vuelo sin motor", esDeporte: true}
            ]
        };

        qu.equal(sitios.length, 3);
    });

    qu.test("typeof test", function () {
        var a = "texto",
            b = 123.45,
            c = {},
            d = [12, 75, 9],
            e = null,
            f = true,
            g = new Date(),
            h = function () {
            },
            i = h();
        qu.equal(typeof a, "string");
        qu.equal(typeof b, "number");
        qu.equal(typeof c, "object");
        qu.equal(typeof d, "object");
        qu.equal(typeof e, "object");
        qu.equal(typeof f, "boolean");
        qu.equal(typeof g, "object");
        qu.equal(typeof h, "function");
        qu.equal(typeof i, "undefined");
    });

    qu.test("boolean type", function () {
        qu.equal(typeof true, "boolean", "typeof true is 'boolean'");
        qu.equal(typeof false, "boolean", "typeof false is 'boolean'");
    });

    qu.test("string type", function () {
        qu.equal(typeof "some text", "string", "typeof double quoted string is 'string'");
        qu.equal(typeof 'some text', "string", "typeof single quoted string is 'string'");
    });

    qu.test("number type", function () {
        qu.equal(typeof 123, "number", "typeof number literal is 'number'");

        qu.equal(1 / 0, Infinity, "division by zero is Infinty");
        qu.equal(typeof Infinity, "number", "typeof Infinity is 'number'");
        qu.equal(isNaN(Infinity), false, "isNaN(Infinity) is false");
        qu.equal(isFinite(Infinity), false, "isFinite(Infinity) is false");
    });

    qu.test("number detection", function () {
        qu.ok(utils.isNumber(123), "'integer' number is a number");
        qu.ok(utils.isNumber(123.456), "'floating point' number is a number");
        qu.ok(!utils.isNumber(NaN), "NaN is not a useful number");
        qu.ok(!utils.isNumber(Infinity), "Infinity is not a useful number");
        qu.ok(!utils.isNumber("123"), "a 'numeric' string is not a number");
    });

    qu.test("undefined", function () {
        qu.equal(typeof __Dont_think_this_could_exist__, "undefined", "typeof non-existent variable is 'undefined'");
        var obj = {};
        qu.equal(typeof obj.x, "undefined", "typeof non-existent member is 'undefined'");
    });

    qu.test("function", function () {
        var fn = function () {
        };
        qu.equal(typeof fn, "function", "typeof function is 'function'");
    });

    qu.test("object", function () {
        var obj = {}; // empty object
        qu.equal(typeof obj, "object", "typeof object is 'object'");
    });

    qu.test("null reference", function () {
        var obj = null;
        qu.equal(typeof obj, "object", "typeof null is 'object'");
        obj = {
            x: null
        };
        qu.equal(typeof obj.x, "object", "typeof null in a member is 'object'");
    });

    qu.test("Array reference", function () {
        var a = [];
        qu.equal(typeof a, "object", "typeof Array is 'object' (beware!)");
    });

    qu.module("Chapter 3. Objects");

    qu.test("property retrieval with [] operator", function () {
        var obj = {
            name: "Some test"
        };
        qu.equal(obj["name"], "Some test", "Existant property is retrieved");
        qu.equal(obj["timestamp"], undefined, "Trying to fetch non-existent property returns undefined");

        var dt = new Date();
        obj["timestamp"] = dt;
        qu.equal(obj["timestamp"], dt, "Added property is fetched");

        delete obj["timestamp"];
        qu.equal(obj["timestamp"], undefined, "Trying to fetch deleted property returns undefined");
    });

    qu.test("property retrieval with . operator", function () {
        var obj = {
            name: "Some test"
        };
        qu.equal(obj.name, "Some test", "Existant property is retrieved");
        qu.equal(obj.timestamp, undefined, "Trying to fetch non-existent property returns undefined");

        var dt = new Date();
        obj.timestamp = dt;
        qu.equal(obj.timestamp, dt, "Added property is fetched");

        delete obj.timestamp;
        qu.equal(obj.timestamp, undefined, "Trying to fetch deleted property returns undefined");
    });

    qu.test("fill in default values with || operator", function () {
        var obj = {};
        var value = obj.value || "default value";
        qu.equal(value, "default value", "default value expected");
    });

    qu.test("safe retrieval of nested property with && operator", function () {
        var obj = {
            nested: {
                value: "nested value"
            }
        };
        var value = obj.nested && obj.nested.value || "default value";
        qu.equal(value, "nested value", "value in nested property expected");

        delete obj.nested;
        value = obj.nested && obj.nested.value || "default value";
        qu.equal(value, "default value", "default value expected");

        //delete obj;
        obj = null;
        value = obj && obj.nested && obj.nested.value || "xx";
        qu.equal(value, "xx", "default value expected");
    });

    qu.test("objects are passed by reference", function () {
        var a = {},
            b = {},
            c = a;

        qu.notEqual(a, b, "objects a and b are equivalent but not equal");
        qu.equal(a, c, "objects a and c are the same");
    });

    qu.test("prototype", function () {
        var p = {
            status: "idle",
            get_status: function () {
                return this.status;
            }
        };

        qu.equal(p.constructor, Object, "the 'constructor' property of a literal object is Object");

        var ctl = Object.create(p);
        qu.equal(ctl.status, "idle", "read property from prototype");
        qu.equal(ctl.get_status(), "idle", "use method in prototype");

        ctl.status = "updated";
        qu.equal(ctl.status, "updated", "read updated property from object");
        qu.equal(ctl.get_status(), "updated", "method in prototype, but this === object");
    });

    qu.test("replacing the prototype of an object after creation has no effect on already created objects", function () {
        var Sample = utils.defineSample();

        var s1 = new Sample();
        var s2 = new Sample("s2");
        var n1 = s1.get_name();
        var n2 = s2.get_name();
        qu.equal(n1, "Anonymous", "value from prototype function expected");
        qu.equal(n2, "s2", "value from prototype function expected");

        Sample.prototype = {}; // empty object (without get_name() method)
        qu.equal(s2.get_name(), "s2", "replacing prototype has no effect on already created objects");
        var s3 = new Sample("s3");
        qu.throws(function () {
            var n3 = s3.get_name(); // get_name() method does not exist
        }, "replacing prototype changes subsequently created objects");
    });

    qu.test("hasOwnProperty() filters out prototype members", function () {
        var Sample = utils.defineSample();
        var s1 = new Sample("sample 1");
        qu.ok(s1.hasOwnProperty("name"), "property 'name' does not belong to the prototype");
        qu.ok(!s1.hasOwnProperty("get_name"), "member 'get_name' belongs to the prototype");

        s1.myProperty = "My name is " + s1.get_name();
        qu.ok(s1.hasOwnProperty("myProperty"), "property 'myProperty' does not belong to the prototype");
    });

    qu.test("enumerating members with for-in", function () {
        var a = [],
            p,
            obj,
            spec = {
                someFunction: function (o) {
                    return typeof o;
                },
                get_name: function () {
                    return this.name;
                }
            };

        obj = Object.create(spec);
        obj.name = "Alice";
        for (p in obj) {
            a.push(p);
        }
        a.sort();
        qu.deepEqual(a, ['get_name', 'name', 'someFunction'], "Enumeration with for-in gets members both in the object and the prototype");
    });

    qu.test("delete operator", function () {
        var obj = {
            name: "Alice"
        };
        delete obj.name;
        qu.equal(obj.name, undefined, "delete operator removes an object member");

        // WARNING: INTENTIONALLY DEFINED GLOBAL!
        if (!window._g) {
            _g = "Bad boy!";
            qu.equal(window._g, "Bad boy!", "Global variable defined...");
            delete _g;
            qu.equal(window._g, undefined, "... and removed by delete operator");
        }
    });

    qu.module("Chapter 4: Functions");

    qu.test("functions are objects", function () {
        var f = function () {
        };
        f.x = "Some value";
        qu.equal(f.x, "Some value", "A function can be augmented with properties");
    });

    qu.test("a function can return a function", function () {
        var porcentajeDe = function (total) {
            return function (n) {
                return n / total * 100;
            };
        };

        var porcentaje = porcentajeDe(200),
            mitad = porcentaje(100),
            cuarto = porcentaje(50);

        qu.equal(mitad, 50);
        qu.equal(cuarto, 25);
    });

    qu.test("functions have a prototype property", function () {
        var f = function () {
        };
        qu.ok(f.prototype, "All functions have a prototype property");
    });

    qu.test("the prototype's constructor property is the function", function () {
        var f = function () {
        };
        qu.strictEqual(f.prototype.constructor, f, "F === F.prototype.constructor");
    });

    qu.test("function literals can be anonymous or named", function () {
        var af = function () {
        }; // anonymous function
        qu.equal(typeof af, "function", "Anonymous function literal");

        var nf = function namedFunc() {
            return namedFunc;
        };
        qu.equal(typeof nf, "function", "Named function literal can be referenced by var");
        qu.equal(typeof nf(), "function", "Named function literal can reference itself recursively...");
        qu.ok(true, "...but nobody else can reference the named function literal by its name");
        // The next assertion is commented out because its behaviour is different across browsers:
        // the problem is trying to reference namedFunc.
        //qu.equal(typeof namedFunc, "function", "named function literal cannot be referenced directly by its name");

        function funcStatement() {
        }
        qu.equal(typeof funcStatement, "function", "Function statement");
    });

    qu.test("not using new with a Class-like function is A VERY BAD THING", function () {
        var SomeClass = function () {
            this.SC_text = "Some text";
            this.SC_num = 123;
            this.SC_flag = true;
            this.SC_now = new Date();
        };

        // Intentionally not using new !!
        var sc = SomeClass();
        qu.equal(sc, undefined, "The object does not get created...");
        qu.equal(window.SC_text, "Some text", "...and lots of globals may get created instead!");

        utils.safeDelete(window, "SC_text");
        utils.safeDelete(window, "SC_num");
        utils.safeDelete(window, "SC_flag");
        utils.safeDelete(window, "SC_now");
    });

    qu.test("constructor functions can be secured against globals creation", function () {
        var SomeClass = function (name) {
            if (!(this instanceof SomeClass)) {
                return new SomeClass(name);
            }
            this.name = name;
        };

        var sc = SomeClass("Without new");
        qu.notEqual(sc, undefined, "The object gets created...");
        qu.equal(sc.name, "Without new", "...even when new is not used!");
    });

    qu.test("unpassed arguments are set to undefined", function () {
        var fn = function (a, b, c) {
            return [a, b, c];
        };
        qu.deepEqual(fn(1, 2, 3), [1, 2, 3], "All arguments defined");
        qu.deepEqual(fn(4, 5), [4, 5, undefined], "Last argument is undefined");
    });

    qu.test("function invocation pattern", function () {
        var fn = function () {
            return this;
        };

        qu.strictEqual(fn(), window, "this === global object");

        var obj = {
            method: function () {
                return this;
            }
        };
        var method = obj.method;
        qu.strictEqual(method(), window, "this === global object");
    });

    qu.test("method invocation pattern", function () {
        var obj = {
            method: function () {
                return this;
            }
        };

        var m1 = obj.method,
            m2 = obj["method"],
            a = obj.method(),
            b = obj["method"](),
            c = (obj.method)(),
            d = (obj["method"])(),
            e = m1(),
            f = m2();

        qu.strictEqual(a, obj, "this === method owner");
        qu.strictEqual(b, obj, "this === method owner");
        qu.strictEqual(c, obj, "this === method owner");
        qu.strictEqual(d, obj, "this === method owner");
        qu.strictEqual(e, window, "this === global object");
        qu.strictEqual(f, window, "this === global object");
    });

    qu.test("constructor invocation pattern", function () {
        var SomeClass1 = function (text) {
            this.text = text;
        };

        var SomeClass2 = function (text) {
            this.text = text;
            return {
                text: "Valor fijo"
            };
        };

        var SomeClass3 = function (text) {
            this.text = text;
            return 123;
        };

        var s1 = new SomeClass1("Prueba 1");
        var s2 = new SomeClass2("Prueba 2");
        var s3 = new SomeClass3("Prueba 3");

        qu.equal(s1.text, "Prueba 1", "returned this automatically");
        qu.equal(s2.text, "Valor fijo", "returned a different object");
        qu.notEqual(s3, 123, "returned this as return value is not an object");
    });

    qu.test("apply invocation pattern", function () {
        var fn = function (p) {
            return [this, p];
        };

        var obj = {};

        var a = fn.apply(),
            b = fn.apply(null),
            c = fn.apply(null, ["hola"]),
            d = fn.apply(obj),
            e = fn.apply(obj, [123]);

        qu.deepEqual(a, [window, undefined], "no arguments passed to apply method (this === global object!)");
        qu.deepEqual(b, [window, undefined], "null passed to apply method (this === global object!)");
        qu.deepEqual(c, [window, "hola"], "idem, but this time with supplied parameter");
        qu.deepEqual(d, [obj, undefined], "this === passed object");
        qu.deepEqual(e, [obj, 123], "idem, but this time with supplied parameter");
    });

    qu.test("augmenting a type", function () {
        if (typeof Number.prototype.integer !== "function") {
            Number.prototype.integer = function () {
                return Math[this < 0 ? "ceil" : "floor"](this);
            };
        }
        qu.equal((2.4).integer(), Math.floor(2.4), "integer() applied to positive Number");
        qu.equal((-2.4).integer(), Math.ceil(-2.4), "integer() applied to negative Number");
    });

    qu.module("Chapter 6: Arrays");

    qu.test("length property", function () {
        var arr = ["primero", 12.3, true, [2, 4, 6], "último"],
            a = arr.length;

        delete arr[1];
        var b = arr.length;

        arr.splice(1, 2);
        var c = arr.length;

        qu.equal(a, 5, "length property is the max integer property name + 1");
        qu.equal(b, 5, "length property is unaffected by delete");
        qu.equal(c, 3, "the splice method changes the length property");
    });

    qu.test("isArray() method", function () {
        var obj = {};
        var date = new Date();
        var arr1 = [];
        var arr2 = new Array();

        qu.ok(!utils.isArray(obj), "Objects are not Arrays");
        qu.ok(!utils.isArray(date), "Dates are not Arrays");
        qu.ok(utils.isArray(arr1), "Literal arrays are Arrays");
        qu.ok(utils.isArray(arr2), "Constructed arrays are Arrays");
        qu.ok(!utils.isArray(arguments), "arguments is not an Array");
    });

    qu.module("Miscelaneous");

    qu.asyncTest("using an AMD module", function () {
        require(['sample'], function (sample) {
            var Sample = sample.createSample(),
                s = new Sample();
            qu.equal(s.get_name(), "Anonymous", "default property value expected");
            qu.start();
        });
    });

    function storageTest(storeName, store) {
        qu.ok(typeof store !== "undefined", "we've got " + storeName + " support!");
        if (store) {
            var tr = store.testrunner,
                n = 0;
            if (tr) {
                n = parseInt(tr, 10);
            }
            n += 1;
            store.testrunner = String(n);

            qu.ok(true, storeName + ".testrunner = " + n);
        }
    }

    qu.test("using sessionStorage", function () {
        storageTest("sessionStorage", sessionStorage);
    });

    qu.test("using localStorage", function () {
        storageTest("localStorage", localStorage);
    });

})(QUnit);