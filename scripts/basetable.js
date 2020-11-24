let data = [{
        "houseId": "818856A",
        "idec": "20/102/00007/0277",
        "nazevPoradu": "Nebezpečné vztahy",
        "nazevEpizody": "Z ruky do huby_1407",
        "dur": "00:39:55:19",
        "status": "waiting"
    },
    {
        "houseId": "818873A",
        "idec": "20/102/00009/0147",
        "nazevPoradu": "Jak to dopadlo",
        "nazevEpizody": "Iluze rodiny_543",
        "dur": "00:39:10:18",
        "status": "ok"
    },
    {
        "houseId": "818831A",
        "idec": "20/103/00002/0258",
        "nazevPoradu": "Moje zprávy",
        "nazevEpizody": "23.11.2020",
        "dur": "00:08:46:13",
        "status": "ng-vys"
    },
    {
        "houseId": "818861A",
        "idec": "20/102/00009/0143",
        "nazevPoradu": "Jak to dopadlo",
        "nazevEpizody": "Jen jsem chtěl víc_539",
        "dur": "00:39:03:21",
        "status": "ng-nevys"
    },
    {
        "houseId": "818832A",
        "idec": "20/103/00001/0172",
        "nazevPoradu": "Jasně a stručně",
        "nazevEpizody": "23.11.2020",
        "dur": "00:08:03:20",
        "status": "waiting"
    }
]

let table = document.getElementById("table");
for (entry of data) {    
    let row = table.insertRow(-1);
    row.insertCell(0).innerHTML = entry.houseId;
    row.insertCell(1).innerHTML = entry.idec;
    row.insertCell(2).innerHTML = entry.nazevPoradu;
    row.insertCell(3).innerHTML = entry.nazevEpizody;
    row.insertCell(4).innerHTML = entry.dur;

    let statusCell = row.insertCell(5);
    if (entry.status == "waiting") {
        statusCell.innerHTML = "Čeká na KOPR";
    } else if (entry.status == "ok") {
        statusCell.innerHTML = "KOPR OK";
        statusCell.style.backgroundColor = "green";
    } else if (entry.status == "ng-vys") {
        statusCell.innerHTML = "NG-Vysílatelné";
        statusCell.style.backgroundColor = "yellow";
    } else if (entry.status == "ng-nevys") {
        statusCell.innerHTML = "NEVYSÍLATELNÉ";
        statusCell.style.backgroundColor = "red";
    }   
}