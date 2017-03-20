# dumplings


dumplings 是基于阿里开源node框架 [egg](https://eggjs.org/) 开发，运行环境依赖于`node 6.0.0` 以上版本。

如果 你本地装有`Xcode 7.0.0`以上版本，配合`Thera`使用我们将提供iOS模拟器预览支持。


### Development

```shell
$ npm install
$ PORT=7000 node index.js
$ open http://localhost:7000/
```


### Trouble Shooter

* 所提供的预览服务依赖网络连通环境，请确保预览设备和服务在同一个局域网下
* 使用`PORT=your_port_number node index.js` 指定端口运行，避免应用启动端口冲突
* 若发生ip地址变更(切换了无线网络开关，重新分配了局域网ip),需要重新扫码完成预览客户端和服务端的绑定

