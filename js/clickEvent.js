"use strict";
const enterBtn = document.querySelector("#enter-button");
const selectDeleteBtn = document.querySelector("#select-delete-button");
const selectDoneBtn = document.querySelector("#select-done-button");
const switchBtn = document.querySelector(".switch");

// clickEvent
var clickEvent = (function () {
    if ("ontouchstart" in document.documentElement === true) {
        return "touchstart";
    } else {
        return "click";
    }
})();

document.addEventListener("click", function (e) {
    if (e.target === selectDeleteBtn) selDelete();
    if (e.target === selectDoneBtn) selDone();
    if (e.target === enterBtn) addList();
    if (e.target === selectAllBtn) selAll();
    if (e.target.matches(".delete")) deleteList(e.target);
    if (e.target.matches(".status-icon")) doneList(e.target);
    if (e.target.type === "checkbox") unSelAll();
    if (e.target.matches(".fa-pen")) {
        clickEditBtn(e.target);
    } else if (e.target.matches(".fa-check")) {
        editList(e.target);
    }
});

// enter로 작성하기
document.addEventListener("keyup", function (e) {
    if (window.event.keyCode === 13) {
        if (e.target.matches(".editBox")) editList(e.target.nextSibling);
        if (e.target === write) addList();
    }
    if (window.event.keyCode === 27) {
        if (e.target.matches(".editBox")) hideEditBox(e.target.nextSibling);
    }
});

switchBtn.addEventListener("click", changeDarkMode);
