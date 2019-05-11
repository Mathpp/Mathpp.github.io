Math.fround = (function (array) {
    return function(x) {
        return array[0] = x, array[0];
    };
})(Float32Array(1));