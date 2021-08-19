const express = require("express")
const app = express()

var data = require("./data")

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static("./public"))

app.get("/api", (req, res) => {
    res.status(200).json(data)
})

app.get("/api/search", (req, res) => {
    const query = req.query
    let filteredData = [...data]
    for (let item in query) {
        filteredData = filteredData.filter((data) => {
            return data[item].startsWith(query[item])
        })
    }
    if (filteredData.length === 0) {
        return res.status(404).send("Data not found.")
    }
    return res.status(200).json(filteredData)
})

app.post("/api", (req, res) => {
    console.log("post", req.body)
    let newEntry = req.body
    data.push(newEntry)
    res.status(200).send()
})

app.put("/api/:id", (req, res) => {
    console.log("put", req.params.id)
    const houseId = req.params.id
    data.forEach((element) => {
        if (element.houseId == houseId) {
            let index = data.indexOf(element)
            data[index] = req.body
        }
    })
    res.status(200).send()
})

app.delete("/api/:id", (req, res) => {
    console.log("delete", req.params.id)
    const houseId = req.params.id
    data = data.filter((element) => {
        return element.houseId !== houseId
    })
    res.status(200).send()
})

app.get("*", (req, res) => {
    res.status(404).send("Page not found.")
})


app.listen(8000, () => {
    console.log("Server is listening on port 8000...")
})