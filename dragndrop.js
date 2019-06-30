function dragable(section) {
    var dragEl, last;

    function _onDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (e.target.nodeName == "LABEL") {
            document.getElementById(e.target.getAttribute("for")).checked = true;
        }
    }

    function _onDragEnd(evt) {
        evt.preventDefault();
    }

    section.addEventListener('dragstart', function (e) {
        dragEl = e.target;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text', "nothing");

        section.addEventListener('dragover', _onDragOver, false);
        section.addEventListener('dragend', _onDragEnd, false);
    });

    section.addEventListener('drop', function(e) {
        e.preventDefault();
        if(e.target.nodeName == "DIV") {
            //swap inline grid- row / column definitions
            var gridColumn = dragEl.style.gridColumn;
            var gridRow = dragEl.style.gridRow;
            dragEl.style.gridColumn = e.target.style.gridColumn;
            dragEl.style.gridRow = e.target.style.gridRow;
            e.target.style.gridColumn = gridColumn;
            e.target.style.gridRow = gridRow;
            // swap html implicit positions
            var next = dragEl.nextSibling;
            var parent = dragEl.parentElement;
            e.target.parentElement.insertBefore(dragEl, e.target.nextSibling);
            parent.insertBefore(e.target, next);
        }
    });
}

dragable(document.getElementById('keypad'));
