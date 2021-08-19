
class TableContent {
    constructor() {
        this.table = document.getElementById("baseTable")
        this.storage = window.sessionStorage
        this.searchInput = document.getElementById("search")
        this.addListeners()
        this.reload()
    }

    print(data = []) {
        let newTable = document.createElement("tbody")
        newTable.id = "baseTable"
        if (data.length == 0) {
            let row = newTable.insertRow()
            let cell = row.insertCell()
            cell.colSpan = this.table.parentElement.rows[0].cells.length
            cell.innerHTML = "Nebyly nalezeny žádné pořady."
        } else {
            let sortField = this.storage.getItem("sortField")
            let sortReverse = this.storage.getItem("sortReverse")
            if (sortField) {
                this.sortData(data, sortField)
            }
            if (sortReverse === "true") {
                data.reverse()
            }

            for (let entry of data) {
                let row = newTable.insertRow()

                row.addEventListener("click", (e) => {
                    if (e.target.nodeName !== "BUTTON") {
                        this.highlight(row, entry.houseId)
                    }
                })

                let highlight = this.storage.getItem("highlight")
                if (highlight === null) {
                    this.storage.setItem("highlight", "")
                    highlight = ""
                }
                if (highlight.includes(entry.houseId)) {
                    this.highlight(row, entry.houseId)
                }

                row.insertCell().innerHTML = entry.houseId
                row.insertCell().innerHTML = entry.idec
                row.insertCell().innerHTML = entry.nazevPoradu
                row.insertCell().innerHTML = entry.nazevEpizody
                row.insertCell().innerHTML = entry.dur

                let date = new Date(entry.datumVys)
                row.insertCell().innerHTML = date.toLocaleDateString()

                let statusCell = row.insertCell()
                let status = entry.status
                statusCell.classList.add(status)
                switch (status) {
                    case "koprCeka":
                        statusCell.innerHTML = "Čeká na KOPR"
                        break
                    case "koprOk":
                        statusCell.innerHTML = "KOPR OK"
                        break
                    case "koprProvys":
                        statusCell.innerHTML = "KOPR OK - Čeká na ProVys"
                        break
                    case "koprNg_vys":
                        statusCell.innerHTML = "NG-Vysílatelné"
                        break
                    case "koprNg_nevys":
                        statusCell.innerHTML = "NEVYSÍLATELNÉ"
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
                    if (confirm(`Opravdu chcete smazat ${entry.houseId}`)) {
                        fetch(`/api/${entry.houseId}`, {method: "DELETE"})
                            .then((response) => {
                                if (response.ok == true && response.status == 200) {
                                    this.reload()
                                }
                            })
                    }
                })
                editCell.appendChild(delBtn)
            }
        }
        this.table.parentNode.replaceChild(newTable, this.table)
        this.table = newTable
    }

    highlight (element, houseId) {
        let highlight = this.storage.getItem("highlight")
        if (element.classList.contains("highlight")) {
            element.classList.remove("highlight")
            highlight = highlight.replace(houseId, "")
            this.storage.setItem("highlight", highlight)
        }
        else {
            element.classList.add("highlight")
            if (!highlight.includes(houseId)) {
                highlight += houseId
                this.storage.setItem("highlight", highlight)
            }
        }
    }

    search(query) {
        let url = ""
        if (!query || query === "all") {
            url = `/api`
        }
        else {
            url = `/api/search?${query}`
        }
        
        fetch(url).then(response => {
            if (response.ok && response.status === 200) {
                return response.json()
            }
            else {
                this.print()
            }
        }).then(data => {
            if (data) {
                this.print(data)
            }
        })
        this.storage.setItem("filter", query)
        this.setActive(query)
    }

    addListeners() {
        this.searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                if (this.searchInput.value) {
                    let query = "houseId=" + this.searchInput.value
                    table.search(query)
                }
                else {
                    table.search("all")
                }
            }
        })

        let filters = document.getElementById("filters").children
        for (let li of filters) {
            li.addEventListener("click", () => {
                this.search(li.id)
            })
        }

        let headers = document.getElementsByTagName("th")
        for (let header of headers) {
            if (header.id) {
                header.addEventListener("click", () => {
                    let sortFieldId = this.storage.getItem("sortField")
                    if (sortFieldId !== header.id && sortFieldId) {
                        let sortField = document.getElementById(sortFieldId)
                        sortField.classList.remove("ascending")
                        sortField.classList.remove("descending")
                    }
                    
                    if (header.classList.contains("ascending")) {
                        header.classList.remove("ascending")
                        header.classList.add("descending")
                        this.storage.setItem("sortField", header.id)
                        this.storage.setItem("sortReverse", "true")
                    }
                    else if (header.classList.contains("descending")) {
                        header.classList.remove("descending")
                        this.storage.setItem("sortField", "")
                        this.storage.setItem("sortReverse", "false")
                    }
                    else {
                        header.classList.add("ascending")
                        this.storage.setItem("sortField", header.id)
                        this.storage.setItem("sortReverse", "false")
                    }
                    this.reload()
                })
            }
        }
        let sortFieldId = this.storage.getItem("sortField")
        if (sortFieldId) {
            let sortField = document.getElementById(sortFieldId)
            let sortReverse = this.storage.getItem("sortReverse")
            if (sortReverse === "false") {
                sortField.classList.add("ascending")
            }
            else {
                sortField.classList.add("descending")
            }
        }
    }

    setActive(elementId) {
        let actives = document.getElementsByClassName("active")
        for (let li of actives) {
            li.classList.remove("active")
        }
        this.searchInput.value = ""
        
        if (elementId.startsWith("status") || elementId === "all") {
            let activeElement = document.getElementById(elementId)
            activeElement.classList.add("active")
        }
        else if (elementId.startsWith("houseId")) {
            elementId = elementId.split("=")[1]
            this.searchInput.value = elementId
        }
    }

    reload() {
        let filter = this.storage.getItem("filter")
        if (filter === null || filter == "undefined") {
            filter = "all"
        }
        this.search(filter)
    }

    sortData(array, field) {
        switch (field) {
            case "idec":
                function sortByIdec(a, b, index) {
                    if (index == a.length || index == b.length) {
                        return 0
                    }
    
                    let aNum = parseInt(a[index])
                    let bNum = parseInt(b[index])
                    let result = aNum - bNum
    
                    if (result == 0) {
                        return sortByIdec(a, b, index + 1)
                    }
                    else {
                        return result
                    }
                }
    
                array = array.sort((a, b) => {
                    a = a.idec.split("/")
                    b = b.idec.split("/")
                    return sortByIdec(a, b, 0)
                })
                break
            case "datumVys":
                array = array.sort((a, b) => {
                    let aDate = new Date(a.datumVys)
                    let bDate = new Date(b.datumVys)
                    if (aDate < bDate) {
                        return -1
                    }
                    else if (aDate > bDate) {
                        return 1
                    }
                    else {
                        return 0
                    }
                })
                break
            case "status":
                let statusEnum = {
                    "koprCeka": 1,
                    "koprOk": 2,
                    "koprProvys": 3,
                    "koprNg_vys": 4,
                    "koprNg_nevys": 5
                }
                array = array.sort((a, b) => {
                    return statusEnum[a.status] - statusEnum[b.status]
                })
                break
            default:
                array = array.sort((a, b) => {
                    a = a[field].toUpperCase()
                    b = b[field].toUpperCase()
                    return a.localeCompare(b)
                })
                break
        }
        return array
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
    setInterval(() => table.reload(), 300000)
})