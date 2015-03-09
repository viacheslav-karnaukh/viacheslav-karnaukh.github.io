# [Stopwatch](http://viacheslav-karnaukh.github.io/stopwatch)

![Stopwatch example](../img/stopwatch.png)

Stopwatch widget has `Start/Stop`, `Reset` and `Lap` buttons as well as keyboard shortcuts `S`, `R` and `L` accordingly. All the placed stopwatches to the page work independently. In case there are several stopwathes on the page keyboard shortcuts work as follows: only one stopwatch can be controlled via keyboard at a time - the stopwatch which is currently hovered over or the latest stopwatch hovered over.

It is possible to place no more than one stopwatch to any of nodes. The example of placing three independently working stopwatches in `.node`, `.node2` and `.node3`:

```javascript
new Timer(document.querySelector('.node'));
new Timer(document.querySelector('.node2'));
new Timer(document.querySelector('.node3'));
```