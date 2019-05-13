function dragable(section) {
    var dragEl, last;

    // for(var i = 0; i < section.children.length; ++i) {
    //     section.children[i].draggable = true;
    // }

    function _onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (e.target.nodeName == "LABEL") {
            document.getElementById(e.target.getAttribute("for")).checked = true;
        } 
        // var target = e.target;
        // if (target /* && target != last */ && target.draggable) {
        //     try {
        //         if(target === last) {
        //             var tmp = dragEl.nextSibling;
        //             section.insertBefore(dragEl, last.nextSibling);
        //             section.insertBefore(last, tmp);
        //             last = null;
        //         } else {
        //             if(last != null/*  && dragEl !== last */) {
        //                 var tmp = dragEl.nextSibling;
        //                 section.insertBefore(dragEl, last.nextSibling);
        //                 section.insertBefore(last, tmp);
        //             }
        //             if(target !== dragEl) {
        //                 var tmp = dragEl.nextSibling;
        //                 section.insertBefore(dragEl, target.nextSibling);
        //                 section.insertBefore(target, tmp);
        //             }
        //             last = target;
        //         }
                
        //     } catch (e) {
        //         console.log(e);
        //     }
        // }
    }

    function _onDragEnd(evt) {
        evt.preventDefault();
        // last = null;
        // dragEl.classList.remove('ghost');
        // section.removeEventListener('dragover', _onDragOver, false);
        // section.removeEventListener('dragend', _onDragEnd, false);
    }

    section.addEventListener('dragstart', function (e) {
        dragEl = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text', "nothing");

        section.addEventListener('dragover', _onDragOver, false);
        section.addEventListener('dragend', _onDragEnd, false);

        // setTimeout(function () {
        //     dragEl.classList.add('ghost');
        // }, 0)

    });

    section.addEventListener('drop', function(e) {
        e.preventDefault();
        if(e.target.nodeName == "DIV" && e.target.draggable && e.target.parentElement == dragEl.parentElement) {
            var gridColumn = dragEl.style.gridColumn;
            var gridRow = dragEl.style.gridRow;
            dragEl.style.gridColumn = e.target.style.gridColumn;
            dragEl.style.gridRow = e.target.style.gridRow;
            e.target.style.gridColumn = gridColumn;
            e.target.style.gridRow = gridRow;
        } else if(e.target.nodeName == "DIV" && !e.target.draggable) {
            // if(e.target.parentElement == dragEl.parentElement) {
                var next = dragEl.nextSibling;
                var parent = dragEl.parentElement;
                e.target.parentElement.insertBefore(dragEl, e.target.nextSibling);
                parent.insertBefore(e.target, next);
            // } else {
            //     // e.target.parentElement.removeChild(e.target);
            // }
            // dragEl.style.gridColumn = ((8 * (e.pageX - e.target.offsetLeft) / e.target.offsetWidth) << 0) + 1;
            // dragEl.style.gridRow = ((5 * (e.pageY - e.target.offsetTop) / e.target.offsetHeight) << 0) + 1;
            // e.target.appendChild(dragEl);
        }
    });
}

dragable(document.getElementById('keypad'));