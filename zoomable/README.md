# [Image Zoomer](http://viacheslav-karnaukh.github.io/zoomable)

![Image Zoomer example](../img/zoomable.png)

This widget shows big image when clicking on small one, shading all the page. The big image is always centered vertically and horizontally even after page scrolling or resizing. To close big image click `cross` on it or press `ESC` key. The example of initialization:

```javascript
makeZoomable($('.gallery-1'));
makeZoomable($('.gallery-2'));
```