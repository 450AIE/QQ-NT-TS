import net from 'net'
const client = new net.Socket()
client.setEncoding('utf8')
client.connect(50001, '192.168.1.204', () => {
    console.log('客户端连接')
    client.write('hello server')
})

client.on('data', (data) => {
    console.log('收到来自服务端的数据', data)
})