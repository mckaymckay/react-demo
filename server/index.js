import express from "express";
import path from "path";
import compression from "compression";


const PORT = 3002;
const app = express();

// 服务器http压缩
app.use(compression())

// app.use(path.join(path.__dirname, "dist"));

app.get("/", (req, res) => {
    res.render("index.html");
});

// 示例任务列表数据
const taskList = [
    { id: 1, title: '吃饭', completed: false },
    { id: 2, title: '睡觉', completed: false },
    { id: 3, title: '写代码', completed: true },
];

app.get('/fetchTaskList', (req, res) => {
    res.json({
        code: 0,
        data: taskList,
        msg: 'success'
    })
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
