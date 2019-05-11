function sortable(section, onUpdate) {
    var dragEl, last;

    for(var i = 0; i < section.children.length; ++i) {
        section.children[i].draggable = true;
    }

    function _onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        var target = e.target;
        if (target /* && target != last */ && target.draggable) {
            try {
                if(target === last) {
                    var tmp = dragEl.nextSibling;
                    section.insertBefore(dragEl, last.nextSibling);
                    section.insertBefore(last, tmp);
                    last = null;
                } else {
                    if(last != null/*  && dragEl !== last */) {
                        var tmp = dragEl.nextSibling;
                        section.insertBefore(dragEl, last.nextSibling);
                        section.insertBefore(last, tmp);
                    }
                    if(target !== dragEl) {
                        var tmp = dragEl.nextSibling;
                        section.insertBefore(dragEl, target.nextSibling);
                        section.insertBefore(target, tmp);
                    }
                    last = target;
                }
                
            } catch (e) {
                console.log(e);
            }
        }
    }

    function _onDragEnd(evt) {
        evt.preventDefault();
        last = null;
        dragEl.classList.remove('ghost');
        section.removeEventListener('dragover', _onDragOver, false);
        section.removeEventListener('dragend', _onDragEnd, false);
    }

    section.addEventListener('dragstart', function (e) {
        dragEl = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text', "nothing");

        section.addEventListener('dragover', _onDragOver, false);
        section.addEventListener('dragend', _onDragEnd, false);

        setTimeout(function () {
            dragEl.classList.add('ghost');
        }, 0)

    });

    section.addEventListener('drop', function(e) {
        e.preventDefault();
    });
}

sortable(document.getElementById('ngrid'));
