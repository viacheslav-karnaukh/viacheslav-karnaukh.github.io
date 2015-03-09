'use strict';

(function () {
    var ESC_KEYCODE = 27;
    var HAS_SUBMENU_CLASS = 'context-menu-has-submenu';

    // iterating nodes up the DOM tree
    function topWalker(node, testFunc, lastParent) {
        while (node && node !== lastParent) {
            if (testFunc(node)) {
                return node;
            }
            node = node.parentNode;
        }
    }
    function ContextMenu(nodeWithMenu, menuStructure) {
        this.root = nodeWithMenu;
        this.menu = this._buildMenuMarkup(menuStructure);
        this._initSubmenuBehaviour();
        document.body.appendChild(this.menu);
        this.root.addEventListener('contextmenu', this._onRootContextMenu.bind(this), false);
        document.documentElement.addEventListener('click', this._onGlobalClick.bind(this), false);
        document.documentElement.addEventListener('keyup', this._onESC.bind(this), false);
        if (!ContextMenu.menus) {
            ContextMenu.menus = [];
        }
        ContextMenu.menus.push(this);
    }
    // create menu markup based on menuStructure
    ContextMenu.prototype._buildMenuMarkup = function(structure) {
        var root = document.createElement('ul');
        root.className = 'context-menu';
        var menuItemNode;
        var submenuArrowNode;
        // every menu entry gets submenu or some action in case there is no submenu; action is a function for menu item from menu structure
        for (var i = 0; i < structure.length; i += 1) {
            menuItemNode = document.createElement('li');
            menuItemNode.innerText = structure[i].title;
            if (structure[i].submenu) {
                submenuArrowNode = document.createElement('span');
                submenuArrowNode.innerText = '▸';
                menuItemNode.className += HAS_SUBMENU_CLASS;
                menuItemNode.appendChild(this._buildMenuMarkup(structure[i].submenu));
                menuItemNode.appendChild(submenuArrowNode);
            } else { 
                menuItemNode.addEventListener('click', structure[i].action, false);
            }
            root.appendChild(menuItemNode);
        }
        return root;
    };

    ContextMenu.prototype._initSubmenuBehaviour = function() {
        
        var submenuHolders = this.menu.querySelectorAll('.' + HAS_SUBMENU_CLASS);
        [].forEach.call(submenuHolders, function(submenuHolder) {
            var submenuNode = submenuHolder.querySelector('ul');
            submenuHolder.addEventListener('mouseenter', function() {
                submenuNode.style.display = 'block';
            }, false);
            submenuHolder.addEventListener('mouseleave', function() {
                submenuNode.style.display = 'none';
            }, false);
        });
    };
    // _onGlobalClick and _onESC methods hide menu when clicking wherever in the document or pressing ESC button 
    ContextMenu.prototype._onGlobalClick = function(event) {
        var menu = this.menu;
        if (!topWalker(event.target, function(node) {
            return menu === node;
        })) {
            this.hide();
        }
    };
    ContextMenu.prototype._onESC = function(event) {
        if (event.keyCode === ESC_KEYCODE) {
            this.hide();
        }
    };
    // starts when clicking on node with menu, calculating the coordinates of mouse click and showing the menu
    ContextMenu.prototype._onRootContextMenu = function (event) {
        event.preventDefault();
        var x = event.clientX + window.scrollX;
        var y = event.clientY + window.scrollY;
        this.show(x, y);

    };
    //shows menu
    ContextMenu.prototype.show = function(left, top) {
        ContextMenu.menus.forEach(function(menuInstance) {
            menuInstance.hide();
        });
        this.menu.style.display = 'block';
        this.menu.style.left = left + 'px';
        this.menu.style.top = top + 'px';
    };
    //hides menu
    ContextMenu.prototype.hide = function() {
        this.menu.style.display = 'none';
    };
    window.ContextMenu = ContextMenu;
})();


//use this self-executing anonymous function to indicate node and menu example for it
//-------------------start---------------------------------
(function () {
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

            window.contextMenu1 = new ContextMenu(document.querySelector('.left'), menuExample1);
            window.contextMenu2 = new ContextMenu(document.querySelector('.right'), menuExample2);
        })();
//-------------------end---------------------------------