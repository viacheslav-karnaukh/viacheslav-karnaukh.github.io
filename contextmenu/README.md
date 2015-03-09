# [Custom Contextmenu](http://viacheslav-karnaukh.github.io/contextmenu)

![Context menu example](../img/contextmenu.png)

Contextmenu is used on chosen node instead of the default contextmenu of the browser. It uses titles and actions predefined by the user in the template. There could be any level of submenu nesting and quantity of titles. It is also available to place different contextmenus on the same page in separete nodes. The example of usage goes below.

```javascript
var menuExample1 = [{
    title: 'File',
    action: function () {console.log('open file')}
}, {
    title: 'Edit',
    action: function () {console.log('edit content')}
}, {
    title: 'More stuff',
    submenu: [{
        title: 'Send by email',
        action: function () {console.log('emailed')}
    }, {
        title: 'Send via skype',
        action: function () {console.log('skyped')}
    }]
}];

var menuExample2 = [{
    title: 'Open file',
    action: function () {console.log('open file')}
}, {
    title: 'Edit file',
    action: function () {console.log('edit file')}
}
];

var contextMenu1 = new ContextMenu(document.querySelector('.left'), menuExample1);
var contextMenu2 = new ContextMenu(document.querySelector('.right'), menuExample2);
```