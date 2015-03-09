'use strict';

function makeZoomable(node) {

    var blur = $('.blur');
    var bigImgWrapper = $('.big-img');
    var zoomedImg = $('.big-img img');
    var closeBtn = $('.close-button');
    var viewport = $(window);
    var ESC = 27;
    var shiftRight;

    function showZoomed(img) {
        blur.show();
        zoomedImg.attr('src', img.src.replace('small', 'large'));
        bigImgWrapper.slideDown('fast', positionCloseBtn);
        
    }

    function positionCloseBtn() {
        closeBtn.fadeIn();
        shiftRight = (zoomedImg.parent().width() - zoomedImg.width()) / 2;
        closeBtn.css('right', shiftRight);
    }

    function closeImg() {
        blur.hide();
        bigImgWrapper.hide();
    }

    node.on('click', 'img', function() {
        showZoomed(this);
    });
    closeBtn.on('click', function() {
        closeBtn.hide();
        closeImg();
    });

    viewport.keyup(function(event) {
        if (event.which !== ESC) return;
        closeImg();
    });
    viewport.resize(positionCloseBtn);
}