const express = require("express")
const app = express()
const path = require("path")

const data = require("./data")

app.use(express.urlencoded({ extended: false }))
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
    if (!filteredData) {
        return res.status(404).send("Data not found.")
    }
    return res.status(200).json(filteredData)
})

app.post("/api", (req, res) => {
    console.log("post", req.body, req.headers)
    data.push(req.body)
    res.status(200).send()
})

app.put("/api", (req, res) => {
    console.log("put request", req.body)
    res.send()
})

app.delete("/api", (req, res) => {

})

app.get("*", (req, res) => {
    res.status(404).send("Page not found.")
})


app.listen(8000, () => {
    console.log("Server is listening on port 8000...")
})