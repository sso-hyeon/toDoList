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
    let tr = document.createElement("tr");
    let input = document.createElement("input");
    let icon = document.createElement("i");
    let span = document.createElement("span");
    let writeVal = document.createTextNode(text);

    listName.append(tr);
    for (let i = 0; i < 3; i++) {
        let td = document.createElement("td");
        tr.append(td);
    }

    let trItem = tr.querySelectorAll("td");
    trItem[0].append(input);
    trItem[1].append(icon, span, input.cloneNode(false), icon.cloneNode(false));
    trItem[2].append(icon.cloneNode(false));

    let tdItem = tr.querySelectorAll("i");
    tdItem[0].classList = "far fa-check-circle done";
    tdItem[1].classList = "fas fa-pen edit";
    tdItem[2].classList = "fas fa-times delete";

    let inputItem = tr.querySelectorAll("input");
    inputItem[0].setAttribute("type", "checkbox");
    inputItem[1].setAttribute("placeholder", "수정할 내용을 입력해주세요.");
    inputItem[1].classList = "d-none editBox";

    span.className = "text";
    span.append(writeVal);

    if (listName === doneItem) {
        tr.classList.add("bgColor");
        tdItem[0].classList.add("doneColor");
        span.classList.add("doneList");
    }
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

// dark mode
function darkMode() {
    document.querySelector("body").classList.toggle("dark");
    document.querySelector("h1").classList.toggle("dark");
    document.querySelectorAll(".select-section div span").forEach(ele => {
        ele.classList.toggle("dark");
    });
    write.classList.toggle("dark");
    document.querySelectorAll("table").forEach(ele => {
        ele.classList.toggle("dark");
    });
    document.querySelectorAll("td").forEach(ele => {
        ele.classList.toggle("dark");
    });
}
