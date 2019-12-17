const text = document.getElementById('text'),
    send = document.getElementById('send'),
    list = document.getElementById('list'),
    wrap = document.querySelector('#wrap'),
    lis = document.getElementsByTagName('li'),
    control = document.querySelector('#control');
let listHeight = 15,
    id;

let socket = io(); // 建立链接
socket.on('loaded', (data) => {
        id = data;
    })
    // event 信息发送
send.onclick = function() {
        if (text.value) {
            // webSocket
            socket.emit('msg', { id: id, text: text.value }); //向服务器发送消息
            text.value = '';
        } else {
            alert('内容不能为空！')
        }
    }
    // 信息接收和界面渲染
socket.on('msg', function(data) { // 监听服务端的消息“msg”
    for (const i of data) {
        if (i.id === id) {
            list.innerHTML += ('<li style="text-align: right;">' + i.text + '<img src="image/monster2.png"/>' + '</li>');
            render();
        } else {
            list.innerHTML += ('<li><img src="image/monster.png"/>' + i.text + '</li>');
            render();
        }
    }
});

function render(params) {
    listHeight = 15;
    for (let index = 0; index < lis.length; index++) {
        let h = Number(window.getComputedStyle(lis[index]).height.slice(0, -2));
        listHeight += (h + 10);
    }
    if (
        (document.documentElement.clientHeight - Number(window.getComputedStyle(control).height.slice(0, -2))) < listHeight) {
        wrap.style.height = listHeight + Number(window.getComputedStyle(control).height.slice(0, -2)) + 10 + 'px';
    }
}