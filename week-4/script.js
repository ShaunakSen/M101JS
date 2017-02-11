for (var i = 0; i < 100; ++i) {
    for (var j = 0; j < 100; ++j) {
        var x = [];
        for (var k = 0; k < 100; ++k) {
            x.push({a: i, b: j, c: k, _id: (100 * 100 * i + 100 * j + 100 * k)})
        }
        db.example.insert(x);
    }
}