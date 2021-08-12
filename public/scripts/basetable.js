
class TableContent {
    constructor() {
        this.table = document.getElementById("baseTable")
        this.storage = window.sessionStorage
        this.filters = document.getElementById("filters").children
        this.searchInput = document.getElementById("search")
        this.addListeners()
        this.reload()
    }

    print(data) {
        let newTable = document.createElement("tbody")
        newTable.setAttribute("id", "baseTable")
        if (data.length == 0) {
            let row = newTable.insertRow()
            let cell = row.insertCell()
            cell.colSpan = this.table.parentElement.rows[0].cells.length
            cell.innerHTML = "Nebyly nalezeny žádné pořady."
        } else {
            for (let entry of data) {
                let row = newTable.insertRow()

                row.addEventListener("click", (e) => {
                    if (e.target.nodeName !== "BUTTON") {
                        this.highlight(row)
                    }
                })

                row.insertCell().innerHTML = entry.houseId
                row.insertCell().innerHTML = entry.idec
                row.insertCell().innerHTML = entry.nazevPoradu
                row.insertCell().innerHTML = entry.nazevEpizody
                row.insertCell().innerHTML = entry.dur

                let date = new Date(entry.datumVys)
                row.insertCell().innerHTML = date.toLocaleDateString()

                let statusCell = row.insertCell()
                let status = entry.status
                switch (status) {
                    case "koprCeka":
                        statusCell.innerHTML = "Čeká na KOPR"
                        break
                    case "koprOk":
                        statusCell.innerHTML = "KOPR OK"
                        statusCell.className = status
                        break
                    case "koprProvys":
                        statusCell.innerHTML = "KOPR OK - Čeká na ProVys"
                        statusCell.className = status
                        break
                    case "koprNg_vys":
                        statusCell.innerHTML = "NG-Vysílatelné"
                        statusCell.className = status
                        break
                    case "koprNg_nevys":
                        statusCell.innerHTML = "NEVYSÍLATELNÉ"
                        statusCell.className = status
                        break
                }
                let editCell = row.insertCell()
                let editBtn = document.createElement("button")
                editBtn.innerHTML = "Edit"
                editBtn.addEventListener("click", () => {
                    window.open(`/form.html?houseId=${entry.houseId}`, "_blank")
                })
                editCell.appendChild(editBtn)

                let delBtn = document.createElement("button")
                delBtn.innerHTML = "Delete"
                delBtn.addEventListener ("click", () => {
                    fetch(`/api/${entry.houseId}`, {method: "DELETE"})
                        .then((response) => {
                            if (response.ok == true && response.status == 200) {
                                location.reload()
                            }
                        })
                })
                editCell.appendChild(delBtn)
            }
        }
        this.table.parentNode.replaceChild(newTable, this.table)
        this.table = newTable
    }

    highlight (element) {
        if (element.className === "highlight") {
            element.className = ""
        }
        else {
            element.className = "highlight"
        }
    }

    search(query) {
        const xhttp = new XMLHttpRequest()  //change to fetch

        xhttp.onload = () => {
            let dataString = xhttp.response
            let data = JSON.parse(dataString)
            this.print(data)
            this.storage.setItem("filter", query)
            this.setActive(query)
        }

        if (!query || query === "all") {
            xhttp.open("GET", `/api/search`)
        }
        else {
            xhttp.open("GET", `/api/search?${query}`)
        }
        xhttp.send()
    }

    addListeners() {
        this.searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                let query = "houseId=" + this.searchInput.value
                table.search(query)
                this.searchInput.value = ""
            }
        })
        for (let li of this.filters) {
            li.addEventListener("click", () => {
                this.search(li.getAttribute("name"))
            })
        }
    }

    setActive(eleName) {
        for (let li of this.filters) {
            li.className = li.className.replace(" active", "")
        }
        if (eleName.startsWith("status") || eleName === "all") {
            let activeElement = document.getElementsByName(eleName)[0]
            activeElement.className = activeElement.className + " active"
        }
    }

    reload() {
        let filter = this.storage.getItem("filter")
        if (filter === null) {
            filter = "all"
        }
        if (filter !== "undefined") {
            this.search(filter)
        }
        else {
            this.search()
        }
    }
}

const table = new TableContent()

window.addEventListener("storage", () => {
    const refresh = window.localStorage.getItem("refresh")
    if (refresh === "true") {
        table.reload()
    }
    window.localStorage.removeItem("refresh")
})

window.addEventListener("DOMContentLoaded", () => {
    setInterval(() => table.reload(), 60000)
})