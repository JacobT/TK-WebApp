var breakCount = 0;

function addBreak() {
    let table = document.getElementById("form");
    
    let newRow = table.insertRow(-1);
    newRow.className = "break";
    
    let header = document.createElement("th");
    breakCount += 1;
    header.innerHTML = breakCount;
    newRow.appendChild(header);

    let inCell = newRow.insertCell(1);
    let inInput = document.createElement("input");
    inInput.setAttribute("id", "break " + breakCount + " in");
    inInput.onblur = function() {formatTc(this.id)};
    inCell.appendChild(inInput);

    let outCell = newRow.insertCell(2);
    let outInput = document.createElement("input");
    outInput.setAttribute("id", "break " + breakCount + " out");
    outInput.onblur = function() {formatTc(this.id)};
    outCell.appendChild(outInput);
}

function deleteBreak() {
    let table = document.getElementById("formTable")
    if (breakCount > 0) {
        table.deleteRow(-1);
        breakCount -= 1;
    }
}

function formatTc(id) {
    let element = document.getElementById(id);
    let tc = element.value;
    if (tc.length <= 8) {
        tc = "0".repeat(8 - tc.length) + tc;
        element.value = tc.slice(0, 2) + ":" + tc.slice(2, 4) + ":" + tc.slice(4, 6) + ":" + tc.slice(6);
    } else {
        element.value = "Chybný TC";
    }
}