"use strict";

// clickEvent
var clickEvent = (function () {
    if ("ontouchstart" in document.documentElement === true) {
        return "touchstart";
    } else {
        return "click";
    }
})();

document.addEventListener("click", function (e) {
    if (e.target === selDeleteBtn) selDelete();
    if (e.target === selDoneBtn) selDone();
    if (e.target === addListBtn) addList();
    if (e.target === selAllBtn) selAll();
    if (e.target.classList.contains("delete")) deleteList(e.target);
    if (e.target.classList.contains("done")) doneList(e.target);
    if (e.target.type === "checkbox") unSelAll();
    if (e.target.classList.contains("fa-pen")) {
        clickEditBtn(e.target);
    } else if (e.target.classList.contains("fa-check")) {
        editList(e.target);
    }
});

// enter로 작성하기
document.addEventListener("keyup", function (e) {
    if (window.event.keyCode === 13) {
        if (e.target.classList.contains("editBox")) editList(e.target.nextSibling);
        if (e.target === write) addList();
    }
    if (window.event.keyCode === 27) {
        if (e.target.classList.contains("editBox")) hideEditBox(e.target.nextSibling);
    }
});
