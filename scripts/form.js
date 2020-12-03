var breakCount = 0;

function addBreak() {
    let table = document.getElementById("formTable");
    
    let newRow = table.insertRow(-1);
    newRow.className = "break";
    
    let header = document.createElement("th");
    breakCount += 1;
    header.innerHTML = breakCount;
    newRow.appendChild(header);

    let inCell = newRow.insertCell(1);
    let inInput = document.createElement("input");
    inInput.setAttribute("id", "break " + breakCount + " in");
    inInput.onblur = function() {formatTc(this)};
    inCell.appendChild(inInput);

    let outCell = newRow.insertCell(2);
    let outInput = document.createElement("input");
    outInput.setAttribute("id", "break " + breakCount + " out");
    outInput.onblur = function() {formatTc(this)};
    outCell.appendChild(outInput);
}

function deleteBreak() {
    let table = document.getElementById("formTable")
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

function commentCheck(checkBox, parentCell) {
    if (checkBox.checked) {
        let textArea = document.createElement("textarea");
        textArea.setAttribute("id", "komentarText");
        textArea.setAttribute("rows", "5");
        parentCell.appendChild(textArea);
    } else {
        let textArea = document.getElementById("komentarText");
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