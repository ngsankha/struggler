$.post('/api/rants', function(data) {
    var reviews = data.reviews;
    for (var i = 0; i < reviews.length; i++) {
        var dom = '<div id="rev' + i + '">' +
                  reviews[i].text + '</div>';
        $('#rants').append(dom);
    }
}, 'json');