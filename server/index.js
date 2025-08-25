import express from "express";
import path from "path";
import compression from "compression";
import { taskList, imageList } from './data.js'


const PORT = 3002;
const app = express();

// 服务器http压缩
app.use(compression())

// app.use(path.join(path.__dirname, "dist"));

app.get("/", (req, res) => {
    res.render("index.html");
});

app.get('/fetchTaskList', (req, res) => {
    res.json({
        code: 0,
        data: taskList,
        msg: 'success'
    })
})

app.get('/fetchImageList', (req, res) => {
    res.json({
        code: 0,
        data: imageList,
        msg: 'success'
    })
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
