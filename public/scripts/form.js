import Timecode from "./smpte-timecode.js"

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
        inInput.className = "tc"
        inInput.name = `break_${breakCounter}_in`
        inInput.id = `break_${breakCounter}_in`
        inInput.addEventListener("blur", () => formatTc(inInput))
        inInput.addEventListener("blur", () => fillBreakOut(inInput))
        inCell.appendChild(inInput)

        let outCell = newRow.insertCell()
        let outInput = document.createElement("input")
        outCell.className = "breakTable"
        outInput.className = "tc"
        outInput.name = `break_${breakCounter}_out`
        outInput.id = `break_${breakCounter}_out`
        outInput.addEventListener("blur", () => formatTc(outInput))
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
    element.classList.remove("invalid")
    if (tc) {
        tc = tc.replace(/:|\.|\s|\D/g, "")
    }
    if (tc.length <= 8 && tc != "") {
        tc = "0".repeat(8 - tc.length) + tc
        tc = tc.slice(0, 2) + ":" + tc.slice(2, 4) + ":" + tc.slice(4, 6) + ":" + tc.slice(6)
    }
    try {
        tc = new Timecode(tc, 25)
        element.value = tc.toString()
    } catch (error) {
        element.classList.add("invalid")
    }
}

function formatIdec(element) {
    let idec = element.value
    element.classList.remove("invalid")
    if (idec) {
        idec = idec.replace(/\/|\s|\D/g, "")
    }
    if (10 <= idec.length && idec.length <= 14) {
        idec = idec + "0".repeat(14 - idec.length)
        element.value = `${idec.slice(0, 2)}/${idec.slice(2, 5)}/${idec.slice(5, 10)}/${idec.slice(10)}`
    } else {
        element.classList.add("invalid")
    }
}

function isFilled (element) {
    element.classList.remove("invalid")
    if (!element.value) {
        element.classList.add("invalid")
    }
}

function commentCheck(checkBox) {
    if (checkBox.checked) {
        let parentCell = checkBox.parentNode
        let textArea = document.createElement("textarea")
        textArea.name = "komentarText"
        textArea.id = "komentarText"
        textArea.rows = 5
        textArea.addEventListener("blur", () => isFilled(textArea))
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
            textArea.addEventListener("blur", () => isFilled(textArea))
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
    if (!data) {
        alert(`Pořad s House ID: ${houseId} nebyl nalezen.`)
        window.localStorage.setItem("refresh", "true")
        window.close()
        return
    }
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
            element.dispatchEvent(new Event("click"))
            continue
        }
        element.value = data[key]
        element.dispatchEvent(new Event("change"))
    }
    addBreak(Object.keys(breaks).length / 2)
    for (let key in breaks) {
        let element = document.getElementById(key)
        element.value = data[key]
    }
}

function fillBreakOut (inInput) {
    let id = inInput.id.replace("in", "out")
    let outCell = document.getElementById(id)
    if (outCell.value) {
        return
    }
    let tcIn
    try {
        tcIn = new Timecode(inInput.value, 25)
    } catch (error) {
        inInput.classList.add("invalid")
        return
    }
    tcIn.add("00:00:00:01")
    outCell.value = tcIn.toString()
    outCell.dispatchEvent(new Event("blur"))
}

function checkDuration() {
    let inInput = document.getElementById("in")
    let outInput = document.getElementById("out")
    let warnDur = document.getElementById("warnDur")

    warnDur.innerText = ""
    inInput.classList.remove("invalid")
    outInput.classList.remove("invalid")

    if (inInput.value && outInput.value) {
        try {
            let tcIn = new Timecode(inInput.value, 25)
            let tcOut = new Timecode(outInput.value, 25)
            tcOut.subtract(tcIn)
        } catch (error) {
            if (error == "Error: Negative timecodes not supported") {
                warnDur.innerText = "Stopáž pořadu je negativní."
            }
            inInput.classList.add("invalid")
            outInput.classList.add("invalid")
            return
        }
    }
}

function addListeners() {
    let elements = document.getElementById("form").elements
    for (let element of elements) {
        if (element.name == "nazevEpizody" || element.name == "pp" || element.type == "submit") {
            continue
        }
        else if (element.classList.contains("tc")) {
            element.addEventListener("blur", () => formatTc(element))
            if (element.id === "in" || element.id === "out") {
                element.addEventListener("blur", checkDuration)
            }
        }
        else if (element.name == "idec") {
            element.addEventListener("blur", () => formatIdec(element))
        }
        else if (element.name == "komentar") {
            element.addEventListener("click", () => commentCheck(element))
        }
        else if (element.name == "status") {
            element.addEventListener("change", () => koprSelection(element))
        }
        else if (element.type == "button") {
            if (element.id == "plusBreak") {
                element.addEventListener("click", () => addBreak())
            }
            else {
                element.addEventListener("click", () => deleteBreak())
            }
        }
        else {
            element.addEventListener("blur", () => isFilled(element))
        }
    }
}

const query = window.location.search
const houseId = new URLSearchParams(query).get("houseId")
const warning = document.getElementById("warning")

addListeners()
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


document.addEventListener("submit", (event) => {
    event.preventDefault()
    let valid = true
    warning.innerText = ""
    for (let element of event.target.elements) {
        element.classList.remove("invalid")
        element.dispatchEvent(new Event("blur"))
        if (element.classList.contains("invalid")) {
            warning.innerText = "Některá pole nejsou správně vyplněna."
            valid = false
        }
    }
    if (valid) {
        let formData = new FormData(event.target)
        let data = {}
        for (let item of formData) {
            data[item[0]] = item[1]
        }

        let tcIn = new Timecode(data["in"], 25)
        let tcOut = new Timecode(data["out"], 25)
        let dur = tcOut.subtract(tcIn)
        dur.add(1)
        data["dur"] = dur.toString()


        let url = "/api"
        let reqMethod = "POST"
        if (query) {
            url += `/${houseId}`
            reqMethod = "PUT"
        }
        fetch(url, {
            method: reqMethod,
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.ok && response.status == 200) {
                window.localStorage.setItem("refresh", "true")
                window.close()
            }

        })
    }
})