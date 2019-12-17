// 配置环境变量
const express = require('express'),
    app = express(),
    server = require('http').createServer(app), // 我根本不知道这一行什么意思
    io = require('socket.io')(server);
// 之所以express的服务器可以和node的服务器套用，是因为他们的前两个参数内容相同
const path = require('path');

// 打开客户端获取静态数据的权限
// app.use 在根层级安装中间件，第一个参数path会匹配所有它和它的子孙路由，默认为“/”
app.use(express.static(__dirname));

let id = 1,
    textList = []; //分配id 记录信息
textList.his = 0;
io.on('connection', (socket) => { // socket相关监听都要放在这个回调里
    socket.emit('loaded', id);
    console.log(`A user load in the meeting room id:${id}`);
    io.emit('msg', [{ id: 0, text: `Welcome! user${id}` }]);
    id++;
    socket.on('msg', (data) => {
        textList.push(data);
    })
    setInterval(() => {
        if (textList.length > textList.his) {
            io.emit('msg', textList.slice(textList.his));
            textList.his = textList.length;
        }
    }, 500);
})

// 传递文档
let absolutePath = path.join(__dirname, 'index.html');
app.get('/', (req, res) => {
    res.sendFile(absolutePath);
});

// 开始监听
server.listen(8080, () => {
    console.log('Example app listening on port 8080!');
})

// 全局中间件函数
// app.use('/',
//         (req, res, next) => {
//             console.log(`${req.method} ${req.path} - ${req.ip}`);
//             next();
//         }
// )
// 传递数据
// app.get('/json',(req,res) => {
//     // 啊！！！ 就是因为json的脚本里多了一个空格！害得老子花了两天时间来查为什么数据不匹配
//     if (process.env.MESSAGE_STYLE === 'uppercase') {
//         res.json({"message": "HELLO JSON"});
//     } else {
//         res.json({"message": "hello json"});
//     }
//     // 我以为next(); is not defind 是因为在之前响应已经被返回了，其实是因为参数里没有定义，不过也不会触发
// });
// // 路由操作
// app.get('/user/:id', function(req, res) {
//     res.send('user ' + req.params.id);
// });