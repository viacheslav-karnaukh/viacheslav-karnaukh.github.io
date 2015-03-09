'use strict';

(function() {
    var sidebarAs = document.querySelector('#sidebar-wrapper').querySelectorAll('a');
    var sidebarNarrowAs = document.querySelector('#sidebar-wrapper-narrow').querySelectorAll('a');
    var projectNames = document.querySelectorAll('.project-name');
    var sidebarHrefs = [];

    [].forEach.call(sidebarAs, function(a) {
        sidebarHrefs.push(a.getAttribute('href'));
    });

    window.addEventListener('scroll', function(event) {
        [].forEach.call(projectNames, function(h1, i, arr) {
            if (h1.getBoundingClientRect().top < window.innerHeight * 0.25) {
                var activeSidebarMenu = sidebarHrefs.indexOf('#' + h1.parentNode.id);
                [].forEach.call(sidebarAs, function(a) {
                    a.parentNode.className = a.parentNode.className.replace(/\bactive-navigator\b/, '');
                });
                sidebarAs[activeSidebarMenu].parentNode.className = 'active-navigator';
                [].forEach.call(sidebarNarrowAs, function(a) {
                    a.parentNode.className = a.parentNode.className.replace(/\bactive-navigator\b/, '');
                });
                sidebarNarrowAs[activeSidebarMenu].parentNode.className = 'active-navigator';
            }
        });
    }, false);
})();