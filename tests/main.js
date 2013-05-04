requirejs.config({
    baseUrl:"tests"
});

module("Simple types and typeof");

test("sample test", function () {

    function cualquiera() {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 1);
        return args;
    }

    deepEqual(cualquiera("una", "bobada", "cualquiera"), ["bobada", "cualquiera"], "He birlado slice a Array!");

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

    equal(sitios.length, 3);
});

test("typeof test", function () {
    var a = "texto",
        b = 123.45,
        c = {},
        d = [12, 75, 9],
        e = null,
        f = true,
        g = new Date(),
        h = function () {},
        i = h();
    equal(typeof a, "string");
    equal(typeof b, "number");
    equal(typeof c, "object");
    equal(typeof d, "object");
    equal(typeof e, "object");
    equal(typeof f, "boolean");
    equal(typeof g, "object");
    equal(typeof h, "function");
    equal(typeof i, "undefined");
});
test("boolean type", function () {
    equal(typeof true, "boolean", "typeof true is 'boolean'");
    equal(typeof false, "boolean", "typeof false is 'boolean'");
});
test("string type", function () {
    equal(typeof "some text", "string", "typeof double quoted string is 'string'");
    equal(typeof 'some text', "string", "typeof single quoted string is 'string'");
});
test("number type", function () {
    equal(typeof 123, "number", "typeof number literal is 'number'");

    equal(1 / 0, Infinity, "division by zero is Infinty");
    equal(typeof Infinity, "number", "typeof Infinity is 'number'");
    equal(isNaN(Infinity), false, "isNaN(Infinity) is false");
    equal(isFinite(Infinity), false, "isFinite(Infinity) is false");
});
test("number detection", function () {
    ok(utils.isNumber(123), "'integer' number is a number");
    ok(utils.isNumber(123.456), "'floating point' number is a number");
    ok(!utils.isNumber(NaN), "NaN is not a useful number");
    ok(!utils.isNumber(Infinity), "Infinity is not a useful number");
    ok(!utils.isNumber("123"), "a 'numeric' string is not a number");
});
test("undefined", function () {
    equal(typeof __Dont_think_this_could_exist__, "undefined", "typeof non-existent variable is 'undefined'");
    var obj = {};
    equal(typeof obj.x, "undefined", "typeof non-existent member is 'undefined'");
});
test("function", function () {
    var fn = function () {
    };
    equal(typeof fn, "function", "typeof function is 'function'");
});
test("object", function () {
    var obj = {}; // empty object
    equal(typeof obj, "object", "typeof object is 'object'");
});
test("null reference", function () {
    var obj = null;
    equal(typeof obj, "object", "typeof null is 'object'");
    obj = {
        x:null
    };
    equal(typeof obj.x, "object", "typeof null in a member is 'object'");
});
test("Array reference", function () {
    var a = [];
    equal(typeof a, "object", "typeof Array is 'object' (beware!)");
});

module("Chapter 3. Objects");

test("property retrieval with [] operator", function () {
    var obj = {
        name:"Some test"
    };
    equal(obj["name"], "Some test", "Existant property is retrieved");
    equal(obj["timestamp"], undefined, "Trying to fetch non-existent property returns undefined");

    var dt = new Date();
    obj["timestamp"] = dt;
    equal(obj["timestamp"], dt, "Added property is fetched");

    delete obj["timestamp"];
    equal(obj["timestamp"], undefined, "Trying to fetch deleted property returns undefined");
});
test("property retrieval with . operator", function () {
    var obj = {
        name:"Some test"
    };
    equal(obj.name, "Some test", "Existant property is retrieved");
    equal(obj.timestamp, undefined, "Trying to fetch non-existent property returns undefined");

    var dt = new Date();
    obj.timestamp = dt;
    equal(obj.timestamp, dt, "Added property is fetched");

    delete obj.timestamp;
    equal(obj.timestamp, undefined, "Trying to fetch deleted property returns undefined");
});
test("fill in default values with || operator", function () {
    var obj = {};
    var value = obj.value || "default value";
    equal(value, "default value", "default value expected");
});
test("safe retrieval of nested property with && operator", function () {
    var obj = {
        nested:{
            value:"nested value"
        }
    };
    var value = obj.nested && obj.nested.value || "default value";
    equal(value, "nested value", "value in nested property expected");

    delete obj.nested;
    value = obj.nested && obj.nested.value || "default value";
    equal(value, "default value", "default value expected");

    delete obj;
    value = obj && obj.nested && obj.nested.value || "xx";
    equal(value, "xx", "default value expected");
});
test("objects are passed by reference", function () {
    var a = {},
        b = {},
        c = a;

    notEqual(a, b, "objects a and b are equivalent but not equal");
    equal(a, c, "objects a and c are the same");
});
test("prototype", function () {
    var p = {
        status:"idle",
        get_status:function () {
            return this.status;
        }
    };

    equal(p.constructor, Object, "the 'constructor' property of a literal object is Object");

    var ctl = Object.create(p);
    equal(ctl.status, "idle", "read property from prototype");
    equal(ctl.get_status(), "idle", "use method in prototype");

    ctl.status = "updated";
    equal(ctl.status, "updated", "read updated property from object");
    equal(ctl.get_status(), "updated", "method in prototype, but this === object");
});
test("replacing the prototype of an object after creation has no effect on already created objects", function () {
    var Sample = utils.defineSample();

    var s1 = new Sample();
    var s2 = new Sample("s2");
    var n1 = s1.get_name();
    var n2 = s2.get_name();
    equal(n1, "Anonymous", "value from prototype function expected");
    equal(n2, "s2", "value from prototype function expected");

    Sample.prototype = {}; // empty object (without get_name() method)
    equal(s2.get_name(), "s2", "replacing prototype has no effect on already created objects");
    var s3 = new Sample("s3");
    throws(function () {
        var n3 = s3.get_name(); // get_name() method does not exist
    }, "replacing prototype changes subsequently created objects");
});
test("hasOwnProperty() filters out prototype members", function () {
    var Sample = utils.defineSample();
    var s1 = new Sample("sample 1");
    ok(s1.hasOwnProperty("name"), "property 'name' does not belong to the prototype");
    ok(!s1.hasOwnProperty("get_name"), "member 'get_name' belongs to the prototype");

    s1.myProperty = "My name is " + s1.get_name();
    ok(s1.hasOwnProperty("myProperty"), "property 'myProperty' does not belong to the prototype");
});
test("enumerating members with for-in", function () {
    var a = [],
        p,
        obj,
        spec = {
            someFunction:function (o) {
                return typeof o;
            },
            get_name:function () {
                return this.name;
            }
        };

    obj = Object.create(spec);
    obj.name = "Alice";
    for (p in obj) {
        a.push(p);
    }
    a.sort();
    deepEqual(a, ['get_name', 'name', 'someFunction'], "Enumeration with for-in gets members both in the object and the prototype");
});
test("delete operator", function () {
    var obj = {
        name:"Alice"
    };
    delete obj.name;
    equal(obj.name, undefined, "delete operator removes an object member");

    // WARNING: INTENTIONALLY DEFINED GLOBAL!
    if (!window._g) {
        _g = "Bad boy!";
        equal(window._g, "Bad boy!", "Global variable defined...");
        delete _g;
        equal(window._g, undefined, "... and removed by delete operator");
    }
});

module("Chapter 4: Functions");

test("functions are objects", function () {
    var f = function () {
    };
    f.x = "Some value";
    equal(f.x, "Some value", "A function can be augmented with properties");
});
test("a function can return a function", function () {
    var porcentajeDe = function (total) {
        return function (n) {
            return n / total * 100;
        };
    };

    var porcentaje = porcentajeDe(200),
        mitad = porcentaje(100),
        cuarto = porcentaje(50);

    equal(mitad, 50);
    equal(cuarto, 25);
});
test("functions have a prototype property", function () {
    var f = function () {
    };
    ok(f.prototype, "All functions have a prototype property");
});
test("the prototype's constructor property is the function", function () {
    var f = function () {
    };
    strictEqual(f.prototype.constructor, f, "F === F.prototype.constructor");
});
test("function literals can be anonymous or named", function () {
    var af = function () {
    }; // anonymous function
    equal(typeof af, "function", "Anonymous function literal");

    var nf = function namedFunc() {
        return namedFunc;
    };
    equal(typeof nf, "function", "Named function literal can be referenced by var");
    equal(typeof nf(), "function", "Named function literal can reference itself recursively...");
    ok(true, "...but nobody else can reference the named function literal by its name");
    // The next assertion is commented out because its behaviour is different across browsers:
    // the problem is trying to reference namedFunc.
    //equal(typeof namedFunc, "function", "named function literal cannot be referenced directly by its name");

    function funcStatement() {
    };
    equal(typeof funcStatement, "function", "Function statement");
});
test("not using new with a Class-like function is A VERY BAD THING", function () {
    var SomeClass = function () {
        this.SC_text = "Some text";
        this.SC_num = 123;
        this.SC_flag = true;
        this.SC_now = new Date();
    };

    // Intentionally not using new !!
    var sc = SomeClass();
    equal(sc, undefined, "The object does not get created...");
    equal(window.SC_text, "Some text", "...and lots of globals may get created instead!");

    utils.safeDelete(window, "SC_text");
    utils.safeDelete(window, "SC_num");
    utils.safeDelete(window, "SC_flag");
    utils.safeDelete(window, "SC_now");
});
test("constructor functions can be secured against globals creation", function () {
    var SomeClass = function (name) {
        if (!(this instanceof SomeClass)) {
            return new SomeClass(name);
        }
        this.name = name;
    }

    var sc = SomeClass("Without new");
    notEqual(sc, undefined, "The object gets created...");
    equal(sc.name, "Without new", "...even when new is not used!");
});
test("unpassed arguments are set to undefined", function () {
    var fn = function (a, b, c) {
        return [a, b, c];
    };
    deepEqual(fn(1, 2, 3), [1, 2, 3], "All arguments defined");
    deepEqual(fn(4, 5), [4, 5, undefined], "Last argument is undefined");
});
test("function invocation pattern", function () {
    var fn = function () {
        return this;
    };

    strictEqual(fn(), window, "this === global object");

    var obj = {
        method:function () {
            return this;
        }
    };
    var method = obj.method;
    strictEqual(method(), window, "this === global object");
});
test("method invocation pattern", function () {
    var obj = {
        method:function () {
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

    strictEqual(a, obj, "this === method owner");
    strictEqual(b, obj, "this === method owner");
    strictEqual(c, obj, "this === method owner");
    strictEqual(d, obj, "this === method owner");
    strictEqual(e, window, "this === global object");
    strictEqual(f, window, "this === global object");
});
test("constructor invocation pattern", function () {
    var SomeClass1 = function (text) {
        this.text = text;
    };

    var SomeClass2 = function (text) {
        this.text = text;
        return {
            text:"Valor fijo"
        };
    };

    var SomeClass3 = function (text) {
        this.text = text;
        return 123;
    };

    var s1 = new SomeClass1("Prueba 1");
    var s2 = new SomeClass2("Prueba 2");
    var s3 = new SomeClass3("Prueba 3");

    equal(s1.text, "Prueba 1", "returned this automatically");
    equal(s2.text, "Valor fijo", "returned a different object");
    notEqual(s3, 123, "returned this as return value is not an object");
});
test("apply invocation pattern", function () {
    var fn = function (p) {
        return [this, p];
    };

    var obj = {};

    var a = fn.apply(),
        b = fn.apply(null),
        c = fn.apply(null, ["hola"]),
        d = fn.apply(obj),
        e = fn.apply(obj, [123]);

    deepEqual(a, [window, undefined], "no arguments passed to apply method (this === global object!)");
    deepEqual(b, [window, undefined], "null passed to apply method (this === global object!)");
    deepEqual(c, [window, "hola"], "idem, but this time with supplied parameter");
    deepEqual(d, [obj, undefined], "this === passed object");
    deepEqual(e, [obj, 123], "idem, but this time with supplied parameter");
});
test("augmenting a type", function () {
    if (typeof Number.prototype.integer !== "function") {
        Number.prototype.integer = function () {
            return Math[this < 0? "ceil" : "floor"](this);
        };
    }
    equal((2.4).integer(), Math.floor(2.4), "integer() applied to positive Number");
    equal((-2.4).integer(), Math.ceil(-2.4), "integer() applied to negative Number");
});

module("Chapter 6: Arrays");
test("length property", function () {
    var arr = ["primero", 12.3, true, [2, 4, 6], "último"],
        a = arr.length;

    delete arr[1];
    var b = arr.length;

    arr.splice(1, 2);
    var c = arr.length;

    equal(a, 5, "length property is the max integer property name + 1");
    equal(b, 5, "length property is unaffected by delete");
    equal(c, 3, "the splice method changes the length property");
});
test("isArray() method", function () {
    var obj = {};
    var date = new Date();
    var arr1 = [];
    var arr2 = new Array();

    ok(!utils.isArray(obj), "Objects are not Arrays");
    ok(!utils.isArray(date), "Dates are not Arrays");
    ok(utils.isArray(arr1), "Literal arrays are Arrays");
    ok(utils.isArray(arr2), "Constructed arrays are Arrays");
    ok(!utils.isArray(arguments), "arguments is not an Array");
});

module("Miscelaneous");
asyncTest("using an AMD module", function () {
    require(['sample'], function (sample) {
        var Sample = sample.createSample(),
            s = new Sample();
        equal(s.get_name(), "Anonymous", "default property value expected");
        start();
    });
});
(function () {
    function storageTest(storeName, store) {
        ok(typeof store !== "undefined", "we've got " + storeName + " support!");
        if (store) {
            var tr = store.testrunner,
                n = 0;
            if (tr) {
                n = parseInt(tr, 10);
            }
            n += 1;
            store.testrunner = String(n);

            ok(true, storeName + ".testrunner = " + n);
        }
    }

    test("using sessionStorage", function () {
        storageTest("sessionStorage", sessionStorage);
    });

    test("using localStorage", function () {
        storageTest("localStorage", localStorage);
    });
})();
