import Dbm from "dbm";
import crypto from "node:crypto";
import url from "node:url";

import DbmGraphApi from "../../index.js";
import Api from "./Api.js";
import UrlRequest from "./UrlRequest.js";

export {Api};

export * as range from "./range/index.js";
export * as admin from "./admin/index.js";
export * as data from "./data/index.js";
export * as action from "./action/index.js";
export * as processAction from "./processAction/index.js";

let fullSelectSetup = function() {
    let selectPrefix = "graphApi/range/select/";
    {
        let name = "idSelection";
        let currentSelect = new DbmGraphApi.range.select.IdSelection();
        currentSelect.item.register(selectPrefix + name);
    }

    {
        let name = "byObjectType";
        let currentSelect = new DbmGraphApi.range.select.ByObjectType();
        currentSelect.item.register(selectPrefix + name);
    }

    {
        let name = "includePrivate";
        let currentSelect = new DbmGraphApi.range.select.IncludePrivate();
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
        let name = "url";
        let currentEncode = new DbmGraphApi.range.encode.Url();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "urlRequest";
        let currentEncode = new DbmGraphApi.range.encode.UrlRequest();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "breadcrumb";
        let currentEncode = new DbmGraphApi.range.encode.Breadcrumb();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "navigationName";
        let currentEncode = new DbmGraphApi.range.encode.NavigationName();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "type";
        let currentEncode = new DbmGraphApi.range.encode.Type();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "image";
        let currentEncode = new DbmGraphApi.range.encode.Image();
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
    registerDataFunction("admin/freeUrl", new DbmGraphApi.data.FreeUrl());
    registerDataFunction("admin/seoSummary", new DbmGraphApi.data.SeoSummary());
    registerDataFunction("admin/altText", new DbmGraphApi.data.AltText());
}

export {fullDataSetup};

export let registerActionFunction = function(aName, aDataFunction) {

    aDataFunction.item.register("graphApi/action/" + aName);
    aDataFunction.item.setValue("functionName", aName);

    return aDataFunction;
}

let fullActionSetup = function() {
    registerActionFunction("example", new DbmGraphApi.action.Example());
    registerActionFunction("incomingWebhook", new DbmGraphApi.action.IncomingWebhook());
    registerActionFunction("cron/processActions", new DbmGraphApi.action.cron.ProcessActions());
}

export {fullActionSetup};

export let registerProcessActionFunction = function(aName, aDataFunction) {

    aDataFunction.item.register("graphApi/processAction/" + aName);
    aDataFunction.item.setValue("functionName", aName);

    return aDataFunction;
}

let fullProcessActionSetup = function() {
    registerProcessActionFunction("example", new DbmGraphApi.processAction.Example());
}

export {fullProcessActionSetup};

let fullSetup = function() {

    fullSelectSetup();
    fullEncodeSetup();
    fullDataSetup();
    fullActionSetup();
    fullProcessActionSetup()
    
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
	
	aServer.get('/api/url', async function handler (aRequest, aReply) {
		//console.log(aRequest);
		
		let url = aRequest.query.url;
		
        if(url[url.length-1] !== "/") {
            url += "/";
        }
		
		console.log(url);
        //METODO: check visibility in database
		let request = new UrlRequest();

		await request.requestUrl(url);
		
		return request.getResponse();
	});

    aServer.get('/api/range/:selects/:encodes', async function handler (aRequest, aReply) {

        let params = {...aRequest.query};
        let selectIds = aRequest.params.selects.split(",");
        let selects = new Array(selectIds.length);
        let encodes = aRequest.params.encodes.split(",");

        {
            let currentArray = selectIds;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                selects[i] = {...params, type: currentArray[i]};
            }
        }

        let request = new UrlRequest();

        await request.requestRange(selects, encodes, params);

        return request.getResponse();
    });

    aServer.get('/api/item/:id/:encodes', async function handler (aRequest, aReply) {
        
        let itemId = 1*aRequest.params.id;
        let encodes = aRequest.params.encodes.split(",");

        let request = new UrlRequest();

        await request.requestItem(itemId, encodes);

        return request.getResponse();
    });

    aServer.get('/api/data/*', async function handler (aRequest, aReply) {
        let params = {...aRequest.query};
        let request = new UrlRequest();

        let currentUrl = url.parse(aRequest.url);
        let functionName = currentUrl.pathname.substring("/api/data/".length);

        await request.requestData(functionName, params);

        return request.getResponse();
    });

    aServer.get('/api/action/*', async function handler (aRequest, aReply) {
        
        let params = {...aRequest.query};
        let request = new UrlRequest();

        let currentUrl = url.parse(aRequest.url);
        let functionName = currentUrl.pathname.substring("/api/action/".length);

        await request.performAction(functionName, params);

        return request.getResponse();
    });

    aServer.post('/api/action/*', async function handler (aRequest, aReply) {
        let params = {...aRequest.body};
        let request = new UrlRequest();

        let currentUrl = url.parse(aRequest.url);
        let functionName = currentUrl.pathname.substring("/api/action/".length);

        await request.performAction(functionName, params);

        return request.getResponse();
    });

    //METODO: setup raw data posts

    //METODO: setup edit

    aServer.get('/api/', async function handler (aRequest, aResponse) {
		return { version: Dbm.getInstance().repository.getItem("site").version };
	});

    aServer.get('/api/*', async function handler (aRequest, aResponse) {
        aResponse.code(404);
		return { success: false, error: "notFound", message: "Not found" };
	});
}

export {setupEndpoints};