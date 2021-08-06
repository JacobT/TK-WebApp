var breakCounter = 0

function addBreak(count=1) {
    for (let i = 1; i <= count; i++) {
        let breakTable = document.getElementById("breakTable")

        let newRow = breakTable.insertRow()
        newRow.className = "breakTable"
        
        let header = document.createElement("th")
        breakCounter += 1
        header.className = "breakTable"
        header.innerHTML = breakCounter
        newRow.appendChild(header)

        let inCell = newRow.insertCell()
        let inInput = document.createElement("input")
        inCell.className = "breakTable breakMiddle"
        inInput.name = `break_${breakCounter}_in`
        inInput.id = `break_${breakCounter}_in`
        inInput.onblur = () => {formatTc(inInput)}
        inCell.appendChild(inInput)

        let outCell = newRow.insertCell()
        let outInput = document.createElement("input")
        outCell.className = "breakTable"
        outInput.name = `break_${breakCounter}_out`
        outInput.id = `break_${breakCounter}_out`
        outInput.onblur = () => {formatTc(outInput)}
        outCell.appendChild(outInput)
    }
}

function deleteBreak() {
    let table = document.getElementById("breakTable")
    if (breakCounter > 0) {
        table.deleteRow(-1)
        breakCounter -= 1
    }
}

function formatTc(element) {
    let tc = element.value
    element.className = ""
    if (tc) {
        tc = tc.replace(/:|\.|\s|\D/g, "")
    }
    if (tc.length <= 8 && tc != "") {
        tc = "0".repeat(8 - tc.length) + tc
        element.value = tc.slice(0, 2) + ":" + tc.slice(2, 4) + ":" + tc.slice(4, 6) + ":" + tc.slice(6)
    } else {
        element.className = "invalid"
    }
}

function formatIdec(element) {
    let idec = element.value
    element.className = ""
    if (idec) {
        idec = idec.replace(/\/|\s|\D/g, "")
    }
    if (10 <= idec.length && idec.length <= 14) {
        idec = idec + "0".repeat(14 - idec.length)
        element.value = `${idec.slice(0, 2)}/${idec.slice(2, 5)}/${idec.slice(5, 10)}/${idec.slice(10)}`
    } else {
        element.className = "invalid"
    }
}

function isFilled (element) {
    element.className = ""
    if (!element.value) {
        element.className = "invalid"
    }
}

function commentCheck(checkBox) {
    if (checkBox.checked) {
        let parentCell = checkBox.parentNode
        let textArea = document.createElement("textarea")
        textArea.name = "komentarText"
        textArea.id = "komentarText"
        textArea.rows = 5
        textArea.onblur = () => {isFilled(textArea)}
        parentCell.appendChild(textArea)
    } else {
        let textArea = document.getElementById("komentarText")
        if (textArea) {
            if (textArea.value == "") {
                textArea.remove()
            } else {
                if (confirm("Poznámky nebudou uloženy.\nChcete pokračovat?")) {
                    textArea.remove()
                } else {
                    checkBox.checked = true
                }
            }
        }
    }
}

function koprSelection(select) {
    let parentCell = select.parentNode
    let option = select.value
    if (option == "koprNg_vys" || option == "koprNg_nevys") {
        if (!document.getElementById("koprText")) {
            let textArea = document.createElement("textarea")
            textArea.name = "koprText"
            textArea.id = "koprText"
            textArea.rows = 5
            textArea.onblur = () => {isFilled(textArea)}
            parentCell.appendChild(textArea)
        }
    } else {
        let textArea = document.getElementById("koprText")
        if (textArea){
            if (textArea.value == "") {
                textArea.remove()
            } else {
                if (confirm("Poznámky nebudou uloženy.\nChcete pokračovat?")) {
                    textArea.remove()
                } else {
                    select.value = select.prev
                }
            }
        }
    }
    select.prev = select.value
    parentCell.className = select.value
}

function fillForm (data) {
    let breaks = {}
    for (let key in data) {
        if (key.startsWith("break_")) {
            breaks[key] = data[key]
            continue
        }
        let element = document.getElementById(key)
        if (!element) {
            continue
        }
        if (element.type == "checkbox") {
            element.checked = true
            if (element.onclick) {element.onclick()}
            continue
        }
        element.value = data[key]
        if (element.onchange) {element.onchange()}
    }
    addBreak(Object.keys(breaks).length / 2)
    for (let key in breaks) {
        let element = document.getElementById(key)
        element.value = data[key]
    }
}

document.addEventListener("submit", (event) => {
    let valid = true
    let warning = document.getElementById("warning")
    warning.innerHTML = ""
    for (let element of event.target.elements) {
        element.className = ""
        if (element.onblur) {
            element.onblur()
            if (element.className === "invalid") {
                warning.innerHTML = "Některá pole nejsou vyplněna."
                valid = false
            }
        }
    }
    if (!valid) {
        event.preventDefault()
    } else {
        event.preventDefault()
        let data = new FormData(event.target)
        let dataJson = {}
        for (let pair of data) {
            dataJson[pair[0]] = pair[1]
        }
        fetch("/api", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(test)
        })
    }
})

const query = window.location.search

if (query) {
    fetch(`/api/search${query}`)
        .then(response => {
            return response.json()
        })
        .then(data => {
            fillForm(data[0])
        })
}

let select = document.getElementById("status")
select.prev = select.value
