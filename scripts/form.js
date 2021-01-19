var breakCount = 0;

function addBreak() {
    let breakTable = document.getElementById("breakTable");

    let newRow = breakTable.insertRow();
    newRow.className = "breakTable";
    
    let header = document.createElement("th");
    breakCount += 1;
    header.className = "breakTable"
    header.innerHTML = breakCount;
    newRow.appendChild(header);

    let inCell = newRow.insertCell();
    let inInput = document.createElement("input");
    inCell.className = "breakTable breakMiddle"
    inInput.setAttribute("id", "break " + breakCount + " in");
    inInput.onblur = function() {formatTc(this)};
    inCell.appendChild(inInput);

    let outCell = newRow.insertCell();
    let outInput = document.createElement("input");
    outCell.className = "breakTable"
    outInput.setAttribute("id", "break " + breakCount + " out");
    outInput.onblur = function() {formatTc(this)};
    outCell.appendChild(outInput);
}

function deleteBreak() {
    let table = document.getElementById("breakTable")
    if (breakCount > 0) {
        table.deleteRow(-1);
        breakCount -= 1;
    }
}

function formatTc(element) {
    let tc = element.value;
    tc = tc.replace(/:|\.|\s|\D/g, "")
    if (tc.length <= 8 && tc != "") {
        tc = "0".repeat(8 - tc.length) + tc;
        element.value = tc.slice(0, 2) + ":" + tc.slice(2, 4) + ":" + tc.slice(4, 6) + ":" + tc.slice(6);
    } else if (tc == "") {
        element.value = "";
    } else {
        element.value = "Chybný TC";
    }
}

function commentCheck(checkBox) {
    if (checkBox.checked) {
        let parentCell = checkBox.parentNode
        let textArea = document.createElement("textarea");
        textArea.setAttribute("id", "komentarText");
        textArea.setAttribute("rows", "5");
        parentCell.appendChild(textArea);
    } else {
        let textArea = document.getElementById("komentarText");
        if (textArea) {
            if (textArea.value == "") {
                textArea.remove();
            } else {
                if (confirm("Poznámky nebudou uloženy.\nChcete pokračovat?")) {
                    textArea.remove();
                } else {
                    checkBox.checked = true;
                }
            }
        }
    }
}

function koprSelection(select) {
    let parentCell = select.parentNode
    let option = select.value
    parentCell.className = option;
    if (option == "koprNg_vys" || option == "koprNg_nevys") {
        if (!document.getElementById("koprText")) {
            let textArea = document.createElement("textarea");
            textArea.setAttribute("id", "koprText");
            textArea.setAttribute("rows", "5");
            parentCell.appendChild(textArea);
        }
    } else {
        let textArea = document.getElementById("koprText");
        if (textArea){
            if (textArea.value == "") {
                textArea.remove();
            } else {
                if (confirm("Poznámky nebudou uloženy.\nChcete pokračovat?")) {
                    textArea.remove();
                } 
            }
        }
    }
}