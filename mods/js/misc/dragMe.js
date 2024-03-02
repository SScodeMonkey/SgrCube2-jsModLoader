//dragElement(document.getElementById("mydiv"));

var drag = {
    posOld: { x: 0, y: 0 },
    posNew: { x: 0, y: 0 },

    dragging: false,
    node: null,
    allNodes: []
};
drag.Start = function (e, node) {
    e.preventDefault();
    //grab node
    drag.node = node
    drag.allNodes.push(node)
    drag.dragging = true;

    //upgrade mouse coordinates
    drag.posOld.x = e.clientX
    drag.posOld.y = e.clientY

    //create event listeners
    $(document).mousemove(e => drag.move(e));
    $(document).mouseup(e => drag.end(e));
}
drag.move = function (e) {
    if (drag.dragging) {
        e.preventDefault();
        // calculate the new cursor position:
        drag.posNew.x = drag.posOld.x - e.clientX
        drag.posNew.y = drag.posOld.y - e.clientY

        drag.posOld.x = e.clientX
        drag.posOld.y = e.clientY

        // set the element's new position:
        $(drag.node).css({
            'left': $(drag.node)[0].offsetLeft - drag.posNew.x,
            'top': $(drag.node)[0].offsetTop - drag.posNew.y,
        })
    }
}
drag.end = function (e) {
    if (drag.dragging) {
        drag.dragging = false
        document.removeEventListener("mouseup", drag.end)
        document.removeEventListener("mousemove", drag.move)
    }
}
drag.init = function (node, params) { //make sure parentNode has a display of either absolute or fixed
    /*  params = {
            dragElement: dom,
            left: number/string, //original left
            top: number/string, //original top
        }
    */

    if (params.hasOwnProperty("dragElement"))
        $(params.dragElement).mousedown(e => drag.Start(e, node))
    else if ($(node).find('.dragMe')[0])
        $(node).find('.dragMe').mousedown(e => drag.Start(e, node))
    else
        $(node).mousedown(e => drag.Start(e, parentNode))

    $(node).append(`<a class="reset_pos">⟳</a>`)

    let x = params.hasOwnProperty("left") ? params.left : "auto",
        y = params.hasOwnProperty("top") ? params.top : "auto";

    $(node).find('.reset_pos').click(e => {
        $(node).css({
            'left': x,
            'top': y
        })
    })
    makeTooltip($(node).find('.reset_pos'), "Reset position")
}