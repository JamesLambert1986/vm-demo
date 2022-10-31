(function() {
    'use strict';
    window.addEventListener('load', function() {
        var selectExpand = document.querySelectorAll('.select-expand')
        var selectExpandFunc = Array.prototype.filter.call(selectExpand, function(selectExpand) {
            var selectExpandShow = function(e) {
                var index = selectExpand.selectedIndex;
                var target = selectExpand.getAttribute('data-target')
                var arrShowIf = selectExpand.getAttribute('data-show-if').split(',')
                if (target && arrShowIf) {
                    var targetEle = document.querySelector(target);
                    if (targetEle) {
                        var showTarget =  arrShowIf.indexOf(selectExpand.children[index].value) > -1
                        if (showTarget == true) {
                            if (!targetEle.classList.contains('target'))
                                targetEle.classList.add('target')
                        }
                        else
                            targetEle.className = targetEle.className.replace(/\btarget\b/g, '')    
                    }
                }
            }
            selectExpandShow()
            selectExpand.onchange = selectExpandShow
        })
    })
})()