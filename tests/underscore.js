
(function () {

    var someNumbers = function () {
        return [2, 4.6, 6.8, 7, 9, 1.2, 0 , 4.1, 1.0];
    };

    function strToInt(s) {
        return parseInt(s, 10);
    }

    function multTupla(tupla) {
        return tupla[0] * tupla[1];
    }

    function sumar(a, b) {
        return a + b;
    }

    function isbn(code) {
        var numeros = _.map(_.toArray(code).reverse(), strToInt),
            sumandos = _.map(numeros, function (n, index) {return n * (index + 1);}),
            total = _.reduce(sumandos, sumar, 0),
            resto = total % 11;
        return resto === 0;
    }

    function isbn2(code) {
        var numeros = _.map(_.toArray(code).reverse(), strToInt),
            factores = _.zip(numeros, _.range(1, numeros.length + 1)),
            sumandos = _.map(factores, multTupla),
            total = _.reduce(sumandos, sumar, 0),
            resto = total % 11;
        return resto === 0;
    }

    function isbn0(code) {
        return _.reduce(_.map(_.map(_.toArray(code).reverse(), strToInt), function (n, index) {return n * (index + 1);}), sumar, 0) % 11 === 0;
    }

    function isbnImperat(code) {
        var i,
            n,
            pos = 1,
            acum = 0,
            resto;
        for (i = code.length - 1; i >= 0; i -= 1) {
            n = parseInt(code.charAt(i), 10);
            acum += n * (pos++);
        }
        resto = acum % 11;
        return resto === 0;
    }

    module("Arrays");

    test("_.first(array[, n=1])", function () {
        var nums = someNumbers();
        equal(_.first(nums), 2, "expected first element of the array");
        deepEqual(_.first(nums, 3), [2, 4.6, 6.8], "expected array with the first 3 elements of the array");
    });

    test("_.rest(array[, n=1])", function () {
        var nums = [1, 2, 3],
            rest1 = _.rest(nums),
            rest2 = _.rest(nums, 2);
        deepEqual(rest1, [2, 3], "n = 1");
        deepEqual(rest2, [3], "n = 2");
    });

    test("_.difference(array1, array2)", function () {
        var nums = someNumbers(),
            withdecimals = [1.2, 1.0, 4.6, 6.8, 4.1],
            diff = _.difference(nums, withdecimals);
        diff.sort();
        deepEqual(diff, [0, 2, 7, 9]);
    });

    module("Collections");

    test("_.map(coll, mapper, thisArg)", function () {
        var collection = [
                {title: "CEPSA", url: "http://www.cepsa.com/", search: false},
                {title: "Google", url: "http://www.google.es/", search: true},
                {title: "Yahoo", url: "http://es.yahoo.com/", search: false},
                {title: "Wikipedia", url: "http://es.wikipedia.org/", search: true}
            ],
            result;

        function campos(nombres) {
            return function (obj) {
                var r = {},
                    i;
                for (i = 0; i < nombres.length; i++) {
                    r[nombres[i]] = obj[nombres[i]];
                }
                return r;
            }
        }

        result = _(collection)
            .filter(function (item) {return item.search;})
            .map(campos(["title", "url"])).value();

        equal(result.length, 2, "filter() returned 2 records");
        deepEqual(result[1], {title: "Wikipedia", url: "http://es.wikipedia.org/"}, "map applied the mapping function");

    });

    module("Combinations");

    test("isbn checker function", function () {
        equal(isbn0("0131774115"), true, "0131774115 is a valid ISBN");
        equal(isbn0("0977716614"), false, "0977716614 is not a valid ISBN");
        equal(isbn2("1934356190"), true, "1934356190 is a valid ISBN");

        equal(isbnImperat("0131774115"), true, "0131774115 is a valid ISBN");
        equal(isbnImperat("0977716614"), false, "0977716614 is not a valid ISBN");
        equal(isbnImperat("1934356190"), true, "1934356190 is a valid ISBN");
    });
}());