for (var i = 0; i < 10; ++i) {
    for (var j = 0; j < 10; ++j) {
        var x = [];
        for (var k = 0; k < 10; ++k) {
            x.push({i:i, j:j, k:k});
            db.numbers.insert(x);
        }

    }
}