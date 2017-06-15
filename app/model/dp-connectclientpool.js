/**
 * Created by guomiaoyou on 2016/11/14.
 */
'use strict'

var EventedArray = require('array-events'); // https://github.com/khrome/array-events/blob/master/array-events.js

let connectClientPool = module.exports = {};

let createConnectClient = function (req) {
    return {
        'headers': req.httpRequest.headers,
        'connect': req.accept(null, req.origin),
    };
}

const MESSAGE_VALUE_SERVER = 'preview-server';
const ON_CLIENTPOOL_SIZECHANGE = 'poolSize-change';

connectClientPool.clients = new EventedArray();
connectClientPool._oreomessage = '';
connectClientPool.theraConnect;
connectClientPool.activeClient; // Currently active client who can post message to console panel and be debugged.


connectClientPool.clients.on('change', (params) => {
    let type = params.type;
    if (type === 'add' || type === 'alter' || type === 'remove') {
        let headers = [];
        connectClientPool.clients.forEach(function (element) {
            headers.push(element.headers);
        })
        let msg = {
            data: headers,
            message: ON_CLIENTPOOL_SIZECHANGE,
        }

        console.log(msg);
        connectClientPool.sendTheraMessage(msg);
    }
})

connectClientPool.addNewClient = function (req) {
    var headers = req.httpRequest.headers;
    if (req.httpRequest.headers.from === 'thera' || (headers['user-agent'] || '').indexOf('Atom') >= 0) {

        this.theraConnect = req.accept(null, req.origin);
        this.theraConnect.on('message', this.handleTheraMessage.bind(this));

    } else {
        var newClient = createConnectClient(req);
        this.clients.push(newClient);
        console.log('Accepted a new connection. Pool size = ' + this.size());

        // Choose one client to be activated.
        this.selectActiveDevice(null, newClient);
        // update new template
        newClient.connect.sendUTF(this._oreomessage);
        // Push debugger server address to newly connected client.
        if (this.theraConnect && this.theraConnect.debugServer) {
            console.log('Tell newly connected client the debug-server address.', this.theraConnect.debugServer);
            newClient.connect.sendUTF(this.theraConnect.debugServer);
        }
        newClient.connect.on('message', this.onClientMessage.bind(this, newClient));
        newClient.connect.on('close', this.onClientDisconnected.bind(this, newClient));
    }
}

connectClientPool.onClientMessage = function (client, message) {
  // output client console log to /tmp/previewconsloe.log
  // Only active client can transmit message to Thera.
    if (this.activeClient === client) {
        this.sendTheraMessage(message.utf8Data);
    }
    try {
    // Remember shakeHandsMessage to identify device which is consistent with debug-server.
        var jsonMsg = JSON.parse(message.utf8Data);
        if (jsonMsg && jsonMsg.message === 'registerDevice') {
            client.device = jsonMsg.data.params;
        }
    } catch (ignored) {
      //
    }
}

connectClientPool.onClientDisconnected = function (client, reason) {
    this.checkClientlive();
    console.log('Client disconnected. reason = ' + reason, ' Pool size =', this.size());
  // Notify thera the activating connection has shut down.
    if (this.activeClient === client) {
        var message = {
            message: MESSAGE_VALUE_SERVER,
            data: {
                connection: {
                    size: this.size(),
                    status: 'closed',
                },
            },
        }
        this.sendTheraMessage(message);

    // Normal procedure: When debug-server receives the disconnection, it will notify dumpling
    // to select a new active client. Some old apps that have not implemented the debugger protocol
    // may cause this.activeClient invalid. So we just select a client as the active one for now.
        this.activeClient = this.clients.length > 0 ? this.clients[0] : null;
    }
}

connectClientPool.handleTheraMessage = function (message) {
    if (message.type === 'utf8') {
      try {
        var textMsg = message.utf8Data;
        var jsonMsg = JSON.parse(textMsg);
        var data = jsonMsg.data;
        if (jsonMsg.message === 'debugger') {
          this.handleDebuggerMessage(jsonMsg, textMsg);
        } else if (jsonMsg.message === 'inspector') {
          this.handleInspectorMessage(jsonMsg, textMsg);
        } else if (jsonMsg.message === 'oreo') {
          this.handleOreoMessage(jsonMsg, textMsg);
        } else {
          console.log('Unknown message. ' + textMsg);
          this.handleUnkownMessage(jsonMsg, textMsg);
        }
      } catch (e) {
        console.error(e);
      }
    }
}

connectClientPool.handleUnkownMessage = function(jsonMsg, textMsg) {
  // Just send it away.
  this.sendAllClientMessage(textMsg);
}

connectClientPool.handleOreoMessage = function(jsonMsg, textMsg) {
    this._oreomessage = textMsg;  // Cache for later usage.
    this.sendAllClientMessage(textMsg);
}

connectClientPool.handleInspectorMessage = function(jsonMsg, textMsg) {
  if (this.activeClient) {
    // Send to activated connected client.
    this.activeClient.connect.sendUTF(textMsg);
  }
}

connectClientPool.handleDebuggerMessage = function(jsonMsg, textMsg) {

  if (jsonMsg && jsonMsg.message === 'debugger' && data && data.debugger && data.debugger.serverAddress) {
    // Broadcast debug-server address to all connected clients.
    console.log('Thera push debug-server address: ', textMsg);
    this.theraConnect.debugServer = textMsg;
    this.sendAllClientMessage([textMsg]);

  } else if (jsonMsg && jsonMsg.message === 'debugger' && data && data.debugger && data.debugger.device) {
    console.log('Thera command activate target device: ', textMsg);
    this.selectActiveDevice(data.debugger.device, null);
  }
}

connectClientPool.selectActiveDevice = function (device, newClient) {
    if (newClient) {
        if (this.size() === 1) {   // This is the only client.
            this.activeClient = newClient;
        }
    } else if (device) {        // Choose a matched client
        var matched = false;
        for (var i = 0; i < this.clients.length; i++) {
            var client = this.clients[i];
            if (client.device) {
                if (device.name === client.device.name) {
                    this.activeClient = client;
                    console.log('Change active device', device);
                    matched = true;
                    break;
                }
            }
        }
        if (!matched) { // The first one in the array will be the active device.
            this.activeClient = this.clients.length > 0 ? this.clients[0] : null;
        }
    }
}

connectClientPool.isEmpty = function () {
    this.checkClientlive();
    return this.clients.length < 1;
}

connectClientPool.size = function () {
    this.checkClientlive();
    return this.clients.length;
}

connectClientPool.allClientHeaders = function () {
    let headers = [];
    this.checkClientlive();

    this.clients.forEach(function (element) {
        headers.push(element.headers);
    })

    return headers;
}

connectClientPool.sendAllClientMessage = function (message) {
    this.checkClientlive();
    this.clients.forEach(function (client) {
        client.connect.sendUTF(message);
    });
}

connectClientPool.sendWeexLogs = function (logs) {
    if (this.theraConnect) {
        this.theraConnect.sendUTF(logs);
    }
}


connectClientPool.sendTheraMessage = function (message) {
    if (this.theraConnect && this.theraConnect.state === 'open') {
        if (!(typeof message === 'string')) {
            message = JSON.stringify(message);
        }
        this.theraConnect.sendUTF(message);
    }
}

// @Deprecate
connectClientPool.sendTransformSuccessNotify = function (weexLogs) {
    if (this.theraConnect) {
        let message = JSON.stringify({ 'message': 'transformSuccessNotify', 'data': { 'logs': weexLogs } })
        this.theraConnect.sendUTF(message);
    }
}

// @Deprecate
connectClientPool.sendTransformFailedNotify = function (err) {
    if (this.theraConnect) {
        let message = JSON.stringify({ 'message': 'transformFailedNotify', 'data': { 'error': err } })
        this.theraConnect.sendUTF(message)
    }
}

/**
 *
    const STATE_OPEN = 'open'; // Connected, fully-open, ready to send and receive frames
    const STATE_PEER_REQUESTED_CLOSE = 'peer_requested_close';// Received a close frame from the remote peer
    const STATE_ENDING = 'ending';// Sent close frame to remote peer.  No further data can be sent.
    const STATE_CLOSED = 'closed';// Connection is fully closed.  No further data can be sent or received.

    检查 WebSocket connect双供通道是否有效，失效通道将会被踢出连接池
 */
connectClientPool.checkClientlive = function () {
    for (let i = this.clients.length - 1; i > -1; --i) {
        if (this.clients[i].connect.state !== 'open') {
            this.clients.splice(i, 1);
        }
    }
}
