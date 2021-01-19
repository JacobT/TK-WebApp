let data = [{
        "houseId": "818856A",
        "idec": "20/102/00007/0277",
        "nazevPoradu": "Nebezpečné vztahy",
        "nazevEpizody": "Z ruky do huby_1407",
        "dur": "00:39:55:19",
        "status": "koprCeka"
    },
    {
        "houseId": "818873A",
        "idec": "20/102/00009/0147",
        "nazevPoradu": "Jak to dopadlo",
        "nazevEpizody": "Iluze rodiny_543",
        "dur": "00:39:10:18",
        "status": "koprOk"
    },
    {
        "houseId": "819058A",
        "idec": "21/103/00001/0011",
        "nazevPoradu": "Jasně a stručně",
        "nazevEpizody": "18.1.2021",
        "dur": "00:08:31:13",
        "status": "koprOk_provys"
    },
    {
        "houseId": "818831A",
        "idec": "20/103/00002/0258",
        "nazevPoradu": "Moje zprávy",
        "nazevEpizody": "23.11.2020",
        "dur": "00:08:46:13",
        "status": "koprNg_vys"
    },
    {
        "houseId": "818861A",
        "idec": "20/102/00009/0143",
        "nazevPoradu": "Jak to dopadlo",
        "nazevEpizody": "Jen jsem chtěl víc_539",
        "dur": "00:39:03:21",
        "status": "koprNg_nevys"
    },
    {
        "houseId": "818832A",
        "idec": "20/103/00001/0172",
        "nazevPoradu": "Jasně a stručně",
        "nazevEpizody": "23.11.2020",
        "dur": "00:08:03:20",
        "status": "koprCeka"
    },
]

class TableContent {
    constructor(data) {
        this.data = data;
        this.table = document.getElementById("baseTable");
        this.print(this.data);
    }

    print(data) {
        let newTable = document.createElement("tbody");
        newTable.setAttribute("id", "baseTable");
        for (let entry of data) {
            let row = newTable.insertRow();
            row.insertCell().innerHTML = entry.houseId;
            row.insertCell().innerHTML = entry.idec;
            row.insertCell().innerHTML = entry.nazevPoradu;
            row.insertCell().innerHTML = entry.nazevEpizody;
            row.insertCell().innerHTML = entry.dur;

            let statusCell = row.insertCell();
            let status = entry.status
            switch (status) {
                case "koprCeka":
                    statusCell.innerHTML = "Čeká na KOPR";
                    break;
                case "koprOk":
                    statusCell.innerHTML = "KOPR OK";
                    statusCell.className = status;
                    break;
                case "koprOk_provys":
                    statusCell.innerHTML = "KOPR OK - Čeká na ProVys";
                    statusCell.className = status;
                    break;
                case "koprNg_vys":
                    statusCell.innerHTML = "NG-Vysílatelné";
                    statusCell.className = status;
                    break;
                case "koprNg_nevys":
                    statusCell.innerHTML = "NEVYSÍLATELNÉ";
                    statusCell.className = status;
                    break;
            }
        }
        this.table.parentNode.replaceChild(newTable, this.table);
        this.table = newTable;
    }

    filterByStatus(status) {
        let filteredData = [];
        for (let entry of this.data) {
            if (entry.status == status) {
                filteredData.push(entry);
            }
        }
        this.print(filteredData);
    }
}

let table = new TableContent(data);