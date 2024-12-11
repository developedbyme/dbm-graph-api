import { WebSocketServer } from 'ws';
import Dbm from "dbm";

import WebSocketConnection from "./WebSocketConnection.js";

export default class Api extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this._server = null;
        this._webSocketServer = null;

        this.item.setValue("controller", this);
        this.item.setValue("connections", []);

        this._callback_connectionBound = this._callback_connection.bind(this);
    }

    setup(aServer, aPath = "/ws/") {

        this._webSocketServer = new WebSocketServer({"server": aServer, "path": aPath});

        this._webSocketServer.on('connection', this._callback_connectionBound);

        return this;
    }

    _callback_connection(aWebSocket, aRequest) {
        let newWebSocketConnection = new WebSocketConnection();

        newWebSocketConnection.item.setValue("api", this.item);

        newWebSocketConnection.setWebSocket(aWebSocket);
        newWebSocketConnection.addListeners();

        let connections = [].concat(this.item.connections);
        connections.push(newWebSocketConnection.item);
        this.item.setValue("connections", connections);

        let hasUserCookie = false;
        if(aRequest.headers.cookie) {
            let cookies = aRequest.headers.cookie.split(";");
            let currentArray = cookies;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let [key, value] = currentArray[i].split("=");
                if(key === "dbm_session" || key === " dbm_session") {
                    let userId = 1*value.split(":")[1];
                    let user = Dbm.getInstance().repository.getItem("graphDatabase").controller.getUser(userId);
    
                    user.verifySession(value).then(function(aIsValidSession) {
                        //console.log("verifySession", aIsValidSession);
    
                        if(aIsValidSession) {
                            newWebSocketConnection.setInitialUser(userId);
                        }
                        else {
                            newWebSocketConnection.setInitialUser(0);
                        }
                        
                    });
                    hasUserCookie = true;
                    break;
                }
            }
        }
        
        if(!hasUserCookie) {
            newWebSocketConnection.setInitialUser(0);
        }
    }
	
	connectionClosed(aConnection) {
		//console.log("connectionClosed");
		let connections = [].concat(this.item.connections);
		let index = connections.indexOf(aConnection.item);
		if(index >= 0) {
			connections.splice(index, 1);
		}
		
		this.item.setValue("connections", connections);
	}
}