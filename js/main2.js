"use strict";
const write = document.querySelector("#write");
const addListBtn = document.querySelector("#plus");
const listItem = document.querySelector("#list_item");
const doneItem = document.querySelector("#done_list_item");
const selAllBtn = document.querySelector("#selectAll");
const selDeleteBtn = document.querySelector("#deleteBtn");
const selDoneBtn = document.querySelector("#selDoneBtn");

let cb; //체크박스

window.addEventListener("load", function () {
    loadList();
});

//리스트 불러오기
function loadList() {
    let list = JSON.parse(localStorage.getItem("list"));
    let done = JSON.parse(localStorage.getItem("done"));

    if (!list || !done) return;

    storageList(list, listItem);
    storageList(done, doneItem);
}

function storageList(obj, listName) {
    obj.forEach(function (text) {
        createList(text, listName);
    });
}

//리스트 추가
function addList() {
    if (!write.value || write.value.trim() === "") {
        alert("작성된 내용이 없습니다.\n내용을 작성해주세요.");
        write.value = "";
    } else {
        createList(write.value, listItem);
        setList();
        write.value = "";
    }
}

//createElement 사용하기
function createList(text, listName) {
    let listSet = listElement();
    let item = new DocumentFragment();
    item.appendChild(createElAndTxt({ tag: "tr" }));

    let itemTr = item.firstElementChild;
    for (let i = 0; i < 3; i++) {
        itemTr.appendChild(listSet.td.cloneNode(false));
    }

    let tdSet = ["check", "text", "delete"];
    tdSet.forEach(function (ele, i) {
        createEle(itemTr, i, ele);
    });

    itemTr.querySelector(".text").innerText = text;

    listName.appendChild(item);

    if (listName === doneItem) {
        itemTr.classList.add("bgColor");
        itemTr.querySelector(".fa-check-circle").classList.add("doneColor");
        itemTr.querySelector(".text").classList.add("doneList");
    }
}

function listElement() {
    let td = createElAndTxt({
        tag: "td"
    });
    let checkbox = createElAndTxt({
        tag: "input",
        type: "checkbox"
    });
    let editText = createElAndTxt({
        tag: "input",
        type: "text",
        placeholder: "수정할 내용을 입력해주세요.",
        class: "d-none editBox"
    });
    let checkIcon = createElAndTxt({
        tag: "i",
        class: "far fa-check-circle done"
    });
    let editIcon = createElAndTxt({
        tag: "i",
        class: "fas fa-pen edit"
    });
    let deleteIcon = createElAndTxt({
        tag: "i",
        class: "fas fa-times delete"
    });
    let textBox = createElAndTxt({
        tag: "span",
        class: "text"
    });

    return {
        td: td,
        checkbox: checkbox,
        editText: editText,
        checkIcon: checkIcon,
        editIcon: editIcon,
        deleteIcon: deleteIcon,
        textBox: textBox
    };
}

function createElAndTxt(data) {
    let result = null;

    if (data.tag) {
        result = document.createElement(data.tag);
    }

    if (result && data.placeholder) {
        result.placeholder = data.placeholder;
    }

    if (result && data.class) {
        result.className = data.class;
    }

    if (result && data.type) {
        result.type = data.type;
    }

    return result;
}

function createEle(itemTr, i, list) {
    let fragment = new DocumentFragment();
    let tdIndex = itemTr.querySelectorAll("td")[i];
    let listSet = listElement();

    switch (list) {
        case "check":
            var list = [listSet.checkbox];
            break;
        case "text":
            var list = [listSet.checkIcon, listSet.textBox, listSet.editText, listSet.editIcon];
            break;
        case "delete":
            var list = [listSet.deleteIcon];
            break;
        default:
            break;
    }
    list.forEach(function (ele) {
        fragment.appendChild(ele);
    });

    tdIndex.appendChild(fragment);
}

//리스트 localStorage 저장
function setList() {
    let list = [];
    let done = [];

    document.querySelectorAll(".text").forEach(function (text) {
        if (!text) return;
        text.parentElement.parentElement.parentElement === listItem
            ? list.push(text.innerText)
            : done.push(text.innerText);
    });

    localStorage.setItem("list", JSON.stringify(list));
    localStorage.setItem("done", JSON.stringify(done));
}

//각 리스트 삭제
function deleteList(obj) {
    if (confirm("내용을 삭제하시겠습니까?")) {
        let doList = obj.parentElement.parentElement;
        doList.parentElement === listItem ? listItem.removeChild(doList) : doneItem.removeChild(doList);
        setList();
    }
}

//하나라도 선택 해제시 전체 선택박스 해제
function unSelAll() {
    cb = document.querySelectorAll('input[type="checkbox"]');
    for (let i = 0; i < cb.length; i++) {
        const cbsChecked = cb[i].checked;
        if (cbsChecked == false) {
            selAllBtn.checked = false;
            break;
        }
    }
}

//리스트 완료처리
function doneList(obj) {
    const doList = obj.parentElement.parentElement;

    doList.classList.toggle("bgColor");
    doList.querySelector(".text").classList.toggle("doneList");
    obj.classList.toggle("doneColor");

    obj.classList.contains("doneColor") ? doneItem.appendChild(doList) : listItem.prepend(doList);

    setList();
}

//리스트 수정
function clickEditBtn(obj) {
    let editTxtBox = obj.parentElement.querySelector(".editBox");
    obj.classList = "fas fa-check";
    editTxtBox.classList.remove("d-none");
    editTxtBox.value = "";
    editTxtBox.focus();
}

function editList(obj) {
    let writeText = obj.previousSibling.value;
    hideEditBox(obj);
    if (!writeText || writeText.trim() === "") {
        alert("작성된 내용이 없습니다.");
    } else {
        obj.parentElement.querySelector(".text").innerText = writeText;
        setList();
    }
}

function hideEditBox(obj) {
    let editTxtBox = obj.parentElement.querySelector(".editBox");
    editTxtBox.classList.add("d-none");
    obj.classList = "fas fa-pen edit";
}

//전체 선택
function selAll() {
    cb = document.querySelectorAll('input[type="checkbox"]');
    cb.forEach(checkbox => {
        checkbox.checked = selAllBtn.checked;
    });
}

//선택된 리스트 완료처리
function selDone() {
    cb = document.querySelectorAll('input[type="checkbox"]');
    cb.forEach(function (check) {
        if (!check.checked) return;
        let checkedList = check.parentElement.parentElement;
        if (checkedList.parentElement === document.querySelector("tbody")) {
            checkedList.classList.add("bgColor");
            checkedList.querySelector(".done").classList.add("doneColor");
            checkedList.querySelector(".text").classList.add("doneList");
            doneItem.appendChild(checkedList);
        }
        check.checked = false;
    });
    setList();
}

//선택된 리스트 삭제하기
function checkListDelete(resultItem) {
    for (let i = 0; i < resultItem.rows.length; i++) {
        cb = resultItem.rows[i].cells[0].firstChild.checked;

        if (cb) {
            resultItem.deleteRow(i);
            i--;
        }
    }
}

function selDelete() {
    if (confirm("선택된 목록을 삭제하시겠습니까?")) {
        checkListDelete(listItem);
        checkListDelete(doneItem);
        selAllBtn.checked = false;
        setList();
    }
}

console.log("%c TO DO LIST", `color: white; font-size: 20px; font-family: 'Noto Sans KR', sans-serif;`);
