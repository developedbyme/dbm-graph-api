import Dbm from "dbm";
import crypto from "node:crypto";

import DbmGraphApi from "../../index.js";
import Api from "./Api.js";

export {Api};

export * as range from "./range/index.js";
export * as admin from "./admin/index.js";
export * as data from "./data/index.js";

let fullSelectSetup = function() {
    let selectPrefix = "graphApi/range/select/";
    {
        let name = "idSelection";
        let currentSelect = new DbmGraphApi.range.select.IdSelection();
        currentSelect.item.register(selectPrefix + name);
    }
}

export {fullSelectSetup};

let fullEncodeSetup = function() {
    let encodePrefix = "graphApi/range/encode/";
    {
        let name = "example";
        let currentEncode = new DbmGraphApi.range.encode.Example();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "identifier";
        let currentEncode = new DbmGraphApi.range.encode.Identifier();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "name";
        let currentEncode = new DbmGraphApi.range.encode.Name();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "content";
        let currentEncode = new DbmGraphApi.range.encode.Content();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "title";
        let currentEncode = new DbmGraphApi.range.encode.Title();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "urlRequest";
        let currentEncode = new DbmGraphApi.range.encode.UrlRequest();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }
}

export {fullEncodeSetup};

export let registerDataFunction = function(aName, aDataFunction) {

    aDataFunction.item.register("graphApi/data/" + aName);
    aDataFunction.item.setValue("functionName", aName);

    return aDataFunction;
}

let fullDataSetup = function() {
    registerDataFunction("example", new DbmGraphApi.data.Example());
}

export {fullDataSetup};

let fullSetup = function() {

    fullSelectSetup();
    fullEncodeSetup();
    fullDataSetup();
    
    DbmGraphApi.admin.edit.fullSetup();
}

export {fullSetup};

let setupEndpoints = function(aServer) {
    aServer.post('/api/user/login', async function handler (aRequest, aReply) {

		let username = aRequest.body['username'];

		let user = await Dbm.getInstance().repository.getItem("graphDatabase").controller.getUserByUsername(username);

		if(!user) {
			//METODO: get user by email
		}

		if(!user) {
			return { success: false, error: "noUserFound", message: "No user found"};
		}

		let isCorrectPassword = await user.verifyPassword(aRequest.body['password']);

		if(isCorrectPassword) {
			let sessionId = await user.createSession();

            let tempArray = sessionId.split(":");
            let sessionDatabaseId = 1*tempArray[0];
			let expiresTime = 1*tempArray[2];
			let expiresDate = (new Date(expiresTime)).toUTCString();

			aReply.header("Set-Cookie", "dbm_session=" +sessionId + "; Path=/; Expires=" + expiresDate + "; HttpOnly;");

            let wsToken = crypto.randomBytes(32).toString('base64');
            let expiryLength = 60;
            let hashedWsToken = await user.generateSignedSessionToken(sessionDatabaseId, (new Date()).valueOf()+expiryLength*1000, wsToken, sessionId)

			return { success: true, data: {id: user.id, "wsToken": hashedWsToken}};
		}

		return { success: false, error: "incorrect", message: "Incorrect details"};
	});

    aServer.get('/api/user/me', async function handler (aRequest, aReply) {
        let cookies = aRequest.headers.cookie ? aRequest.headers.cookie.split(";") : [];
        let currentArray = cookies;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let [key, value] = currentArray[i].split("=");
            if(key === "dbm_session" || key === " dbm_session") {
                let userId = 1*value.split(":")[1];
                let user = Dbm.getInstance().repository.getItem("graphDatabase").controller.getUser(userId);

                let isValidSession = await user.verifySession(value);
                if(isValidSession) {
                    return {success: true, data: {id: userId}};
                }
            }
        }

        return {success: false, data: null};
    });

	aServer.post('/api/user/logout', async function handler (aRequest, aReply) {
		console.log(aRequest.body);

		//METODO: clear session from database
		//METODO: clear cookie
	});

	aServer.post('/api/user/renewSession', async function handler (aRequest, aReply) {
		console.log(aRequest.body);

		//METODO: clear session from database
		//METODO: clear cookie
	});

    //METODO: setup ranges
    //METODO: setup edit
    //METODO: setup data
    //METODO: setup actions
    //METODO: setup cron

    aServer.get('/api/', async function handler (aRequest, aResponse) {
		return { version: Dbm.getInstance().repository.getItem("site").version };
	});

    aServer.get('/api/*', async function handler (aRequest, aResponse) {
        aResponse.code(404);
		return { success: false, error: "notFound", message: "Not found" };
	});
}

export {setupEndpoints};