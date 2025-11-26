import Dbm from "dbm";
import crypto from "node:crypto";
import url from "node:url";

import DbmGraphApi from "../../index.js";
import Api from "./Api.js";
import UrlRequest from "./UrlRequest.js";

import fs from "node:fs";
import sharp from 'sharp';
import mime from 'mime';

export {Api};

export * as range from "./range/index.js";
export * as admin from "./admin/index.js";
export * as data from "./data/index.js";
export * as action from "./action/index.js";
export * as processAction from "./processAction/index.js";
export * as taskrunner from "./taskrunner/index.js";
export * as schema from "./schema/index.js";

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

    {
        let name = "includeDraft";
        let currentSelect = new DbmGraphApi.range.select.IncludeDraft();
        currentSelect.item.register(selectPrefix + name);
    }

    {
        let name = "objectRelationQuery";
        let currentSelect = new DbmGraphApi.range.select.ObjectRelationQuery();
        currentSelect.item.register(selectPrefix + name);
    }

    {
        let name = "globalObjectRelationQuery";
        let currentSelect = new DbmGraphApi.range.select.GlobalObjectRelationQuery();
        currentSelect.item.register(selectPrefix + name);
    }

    {
        let name = "withIdentifier";
        let currentSelect = new DbmGraphApi.range.select.WithIdentifier();
        currentSelect.item.register(selectPrefix + name);
    }
}



export {fullSelectSetup};

let registerEncoding = function(aName, aEncoder) {
    let encodePrefix = "graphApi/range/encode/";
    aEncoder.item.register(encodePrefix + aName);
    aEncoder.item.setValue("encodingType", aName);

    return aEncoder;
}

export {registerEncoding};

let registerEncodingClass = function(aEncoderClass) {
    return registerEncoding(aEncoderClass.DEFAULT_ENCODING_NAME, new aEncoderClass());
}

export {registerEncodingClass};

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

    {
        let name = "visibility";
        let currentEncode = new DbmGraphApi.range.encode.Visibility();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "relations";
        let currentEncode = new DbmGraphApi.range.encode.Relations();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "objectTypes";
        let currentEncode = new DbmGraphApi.range.encode.ObjectTypes();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "representingPage";
        let currentEncode = new DbmGraphApi.range.encode.RepresentingPage();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "pageRepresentation";
        let currentEncode = new DbmGraphApi.range.encode.PageRepresentation();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "admin_fields";
        let currentEncode = new DbmGraphApi.range.encode.admin.Fields();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "admin_user";
        let currentEncode = new DbmGraphApi.range.encode.admin.User();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    {
        let name = "helpSection";
        let currentEncode = new DbmGraphApi.range.encode.HelpSection();
        currentEncode.item.register(encodePrefix + name);
        currentEncode.item.setValue("encodingType", name);
    }

    registerEncoding("atLocation", new DbmGraphApi.range.encode.AtLocation());
    registerEncoding("location", new DbmGraphApi.range.encode.Location());
    registerEncoding("mainImage", new DbmGraphApi.range.encode.MainImage());
    registerEncoding("linkPreview", new DbmGraphApi.range.encode.LinkPreview());
    registerEncoding("publishDate", new DbmGraphApi.range.encode.PublishDate());

    registerEncoding("title_translations", new DbmGraphApi.range.encode.TranslatedTitle());
    registerEncoding("admin_fieldTranslations", new DbmGraphApi.range.encode.admin.FieldTranslations());

    registerEncoding("language", DbmGraphApi.range.encode.SingleRelation.create("language", "in:for:language", "type"));
    registerEncodingClass(DbmGraphApi.range.encode.TranslatedName);
    registerEncoding("translationGroup", new DbmGraphApi.range.encode.TranslationGroup());

    registerEncoding("menuLocation", new DbmGraphApi.range.encode.MenuLocation());
    registerEncoding("menu", new DbmGraphApi.range.encode.Menu());
    registerEncoding("menuItem", new DbmGraphApi.range.encode.MenuItem());
}

export {fullEncodeSetup};

export let registerDataFunction = function(aName, aDataFunction) {

    aDataFunction.item.register("graphApi/data/" + aName);
    aDataFunction.item.setValue("functionName", aName);

    return aDataFunction;
}

let fullDataSetup = function() {
    registerDataFunction("example", new DbmGraphApi.data.Example());

    registerDataFunction("breadcrumb", new DbmGraphApi.data.Breadcrumb());
    registerDataFunction("question", new DbmGraphApi.data.Question());

    registerDataFunction("admin/freeUrl", new DbmGraphApi.data.FreeUrl());
    registerDataFunction("admin/seoSummary", new DbmGraphApi.data.SeoSummary());
    registerDataFunction("admin/helpSectionSuggestions", new DbmGraphApi.data.HelpSectionSuggestions());
    registerDataFunction("admin/altText", new DbmGraphApi.data.AltText());

    registerDataFunction("server/status", new DbmGraphApi.data.server.Status());
}

export {fullDataSetup};

export let registerActionFunction = function(aName, aDataFunction) {

    aDataFunction.item.register("graphApi/action/" + aName);
    aDataFunction.item.setValue("functionName", aName);

    return aDataFunction;
}

let fullActionSetup = function() {
    registerActionFunction("example", new DbmGraphApi.action.Example());
    registerActionFunction("submitForm", new DbmGraphApi.action.SubmitForm());
    registerActionFunction("incomingWebhook", new DbmGraphApi.action.IncomingWebhook());
    registerActionFunction("cron/processActions", new DbmGraphApi.action.cron.ProcessActions());
    registerActionFunction("admin/addAndProcessAction", new DbmGraphApi.action.admin.AddAndProcessAction());
    registerActionFunction("admin/addUser", new DbmGraphApi.action.admin.AddUser());
    registerActionFunction("admin/user/setPassword", new DbmGraphApi.action.admin.SetPassword());

    registerActionFunction("admin/setup/setupWebsite", new DbmGraphApi.action.admin.setup.SetupWebsite());
    registerActionFunction("admin/setup/setupOrganization", new DbmGraphApi.action.admin.setup.SetupOrganization());

    registerActionFunction("development/restartServer", new DbmGraphApi.action.development.RestartServer());
    registerActionFunction("development/restartDatabaseConnection", new DbmGraphApi.action.development.RestartDatabaseConnection());

    registerActionFunction("development/reRenderPages", new DbmGraphApi.action.development.ReRenderPages());
}

export {fullActionSetup};

export let registerProcessActionFunction = function(aName, aDataFunction) {

    aDataFunction.item.register("graphApi/processAction/" + aName);
    aDataFunction.item.setValue("functionName", aName);

    return aDataFunction;
}

let fullProcessActionSetup = function() {
    registerProcessActionFunction("example", new DbmGraphApi.processAction.Example());

    registerProcessActionFunction("handleFormSubmission", new DbmGraphApi.processAction.HandleFormSubmission());

    registerProcessActionFunction("pageUpdates/updateCategoryListing", new DbmGraphApi.processAction.pageUpdates.UpdateCategoryListing());
    registerProcessActionFunction("pageUpdates/updateRenderedContent", new DbmGraphApi.processAction.pageUpdates.UpdateRenderedContent());
    registerProcessActionFunction("pageUpdates/clearCache", new DbmGraphApi.processAction.pageUpdates.ClearCloudflareCache());
}

export {fullProcessActionSetup};

let setupInternalTaskRunner = function() {
    Dbm.getInstance().repository.getItem("taskRunner").requireProperty("runners", []);

    let runner = new DbmGraphApi.taskrunner.InternalTaskRunner();
    runner.startAtStartup();

    let runners = [].concat(Dbm.getInstance().repository.getItem("taskRunner").runners);
    runners.push(runner);
    Dbm.getInstance().repository.getItem("taskRunner").runners = runners; 
    
}

export {setupInternalTaskRunner};


let fullSetup = function() {

    fullSelectSetup();
    fullEncodeSetup();
    fullDataSetup();
    fullActionSetup();
    fullProcessActionSetup();
    setupInternalTaskRunner();
    
    DbmGraphApi.admin.edit.fullSetup();
}

export {fullSetup};

export const setupEndpoints = function(aServer) {
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

    let getPublicSessionIdFomCookie = function(aCookies) {
        if(aCookies) {
            let cookies = aCookies.split(";");
            let currentArray = cookies;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                let [key, value] = currentArray[i].split("=");
                if(key === "dbm_session" || key === " dbm_session") {
                    return value;
                }
            }
        }
        
        return null;
    }

    let getUserFromPublicSessionId = async function(aPublicSessionId) {
        if(aPublicSessionId) {
            let userId = 1*aPublicSessionId.split(":")[1];
            let user = Dbm.getRepositoryItem("graphDatabase").controller.getUser(userId);

            let isValidSession = await user.verifySession(aPublicSessionId);
            if(isValidSession) {
                return user;
            }
        }

        return null;
    }

    let getUserFromCookie = async function(aCookies) {
        let publicSessionId = getPublicSessionIdFomCookie(aCookies);
        return await getUserFromPublicSessionId(publicSessionId);
    }

    aServer.get('/api/user/me', async function handler (aRequest, aReply) {
        let user = await getUserFromCookie(aRequest.headers.cookie);
        if(user) {
            return {success: true, data: {id: user.id}};
        }

        return {success: false, data: null};
    });

	aServer.post('/api/user/logout', async function handler (aRequest, aReply) {

        let publicSessionId = getPublicSessionIdFomCookie(aRequest.headers.cookie);
        let user = await getUserFromPublicSessionId(publicSessionId);

        if(user) {
            let sessionId = 1*publicSessionId.split(":")[0];
            await user.deleteSession(sessionId);
        }

        aReply.header("Set-Cookie", "dbm_session=; Path=/; Max-Age=0; HttpOnly;");
        return {success: true, data: null};
	});

	aServer.post('/api/user/renewSession', async function handler (aRequest, aReply) {
		let user = await getUserFromCookie(aRequest.headers.cookie);
        if(user) {
            //METODO: update session
		    //METODO: update cookie

            //METODO: return success
        }

		return {success: false, data: null};
	});
	
	aServer.get('/api/url', async function handler (aRequest, aReply) {
		//console.log(aRequest);
		
		let url = aRequest.query.url;
		
        if(url[url.length-1] !== "/") {
            url += "/";
        }
		
        //METODO: check visibility in database
		let request = new UrlRequest();
        request.setup(aRequest, aReply);

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
        request.setup(aRequest, aReply);

        await request.requestRange(selects, encodes, params);

        return request.getResponse();
    });

    aServer.get('/api/item/:id/:encodes', async function handler (aRequest, aReply) {
        
        let itemId = 1*aRequest.params.id;
        let encodes = aRequest.params.encodes.split(",");

        let request = new UrlRequest();
        request.setup(aRequest, aReply);

        await request.requestItem(itemId, encodes);

        return request.getResponse();
    });

    aServer.get('/api/data/*', async function handler (aRequest, aReply) {
        let params = {...aRequest.query};
        let request = new UrlRequest();
        request.setup(aRequest, aReply);

        let currentUrl = url.parse(aRequest.url);
        let functionName = currentUrl.pathname.substring("/api/data/".length);

        await request.requestData(functionName, params);

        return request.getResponse();
    });

    aServer.get('/api/action/*', async function handler (aRequest, aReply) {
        
        let params = {...aRequest.query};
        let request = new UrlRequest();
        request.setup(aRequest, aReply);

        let currentUrl = url.parse(aRequest.url);
        let functionName = currentUrl.pathname.substring("/api/action/".length);

        await request.performAction(functionName, params);

        return request.getResponse();
    });

    aServer.post('/api/action/*', async function handler (aRequest, aReply) {
        let params = {...aRequest.body};
        let request = new UrlRequest();
        request.setup(aRequest, aReply);

        let currentUrl = url.parse(aRequest.url);
        let functionName = currentUrl.pathname.substring("/api/action/".length);

        await request.performAction(functionName, params);

        return request.getResponse();
    });

    //METODO: setup raw data posts

    aServer.get('/api/webhook/*', async function handler (aRequest, aReply) {
        
        let params = {...aRequest.query};
        let request = new UrlRequest();
        request.setup(aRequest, aReply);

        let currentUrl = url.parse(aRequest.url);
        let webhookType = currentUrl.pathname.substring("/api/incomingWebhook/".length);

        await request.incomingWebhook(webhookType, params);

        return request.getResponse();
    });

    aServer.post('/api/webhook/*', async function handler (aRequest, aReply) {
        let params = {...aRequest.body};
        let request = new UrlRequest();
        request.setup(aRequest, aReply);

        let currentUrl = url.parse(aRequest.url);
        let webhookType = currentUrl.pathname.substring("/api/incomingWebhook/".length);

        await request.incomingWebhook(webhookType, params);

        return request.getResponse();
    });

    //METODO: setup edit

    aServer.get('/api/', async function handler (aRequest, aResponse) {
		return { version: Dbm.getInstance().repository.getItem("site").version };
	});

    aServer.get('/api/*', async function handler (aRequest, aResponse) {
        aResponse.code(404);
		return { success: false, error: "notFound", message: "Not found" };
	});
}

export const setupSite = function(aServer) {

    aServer.get('/cdn-cgi/image/:options/*', async function(request, reply) {
        //console.log("/cdn-cgi/image/");

        let publicDir = Dbm.getInstance().repository.getItem("site").publicDir;

		let nextPosition = request.url.indexOf('/', "/cdn-cgi/image/".length);
		let imageUrl = request.url.substring(nextPosition+1);

		let realPath;
		try {
			realPath = fs.realpathSync(publicDir + "/" + imageUrl);
            //console.log(realPath);
			if(realPath.indexOf(publicDir + "/") !== 0) {
				throw("Not in folder");
			}

			if(!fs.lstatSync(realPath).isFile()) {
				throw("Not a file");
			}
		}
		catch(theError) {
			reply.code(404);
			return;
		}
		
		let imageResize = sharp(realPath);
		
		let options = {
			background: {r: 0, g: 0, b: 0, alpha: 0}
		};
		let currentArray = request.params.options.split(",");
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let tempArray = currentArray[i].split("=");
			let name = tempArray[0];
			switch(name) {
				case "width":
				case "height":
					options[name] = 1*tempArray[1];
					break;
				default:
					options[name] = tempArray[1];
			}
			
		}

		imageResize.resize(options);
		
		let image = await imageResize.toBuffer();
		reply.header('Content-Type', mime.getType(realPath));
		reply.send(image);
	});

    aServer.get('/sitemap.xml', async function(request, reply) {

        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;
		
		reply.header("Content-Type", "application/xml; charset=utf-8");
		
		let response = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
		
		let pages = await database.getObjectsOfType("page");
		
		let fullUrl = request.protocol + "://" + request.hostname;
		if(request.port && request.port !== 80 && request.port !== 443) {
			fullUrl += ":" + request.port;
		}
		
		let currentArray = pages;
		let currentArrayLength = currentArray.length;
		for(let i = 0; i < currentArrayLength; i++) {
			let databaseObject = currentArray[i];
			let url = await databaseObject.getUrl();
			if(url) {
				let fields = await databaseObject.getFields();

                if(fields["seo/noIndex"]) {
                    continue;
                }
				
				response += '  <url>\n';
                let encodedUrl = url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
				response += '    <loc>' + fullUrl + encodedUrl + '</loc>\n';
				if(fields["lastModified"]) {
					response += '    <lastmod>' + fields["lastModified"] + '</lastmod>\n';
				}
				response += '  </url>\n';
			}
		}
		
		response += '</urlset>';
		
		return response;
	});

	aServer.get('/robots.txt', async function(request, reply) {
		reply.header("Content-Type", "text/plain; charset=utf-8");
		return "User-agent: *\nDisallow:"
	});

    aServer.get('/*', async function(request, reply) {
		let site = Dbm.getInstance().repository.getItem("site");
        let database = Dbm.getInstance().repository.getItem("graphDatabase").controller;

        let version = site.version;
		let assetsUri = site.assetsUri;
		let language = site.language;
		let siteName = site.name;
		let loader = "loader.js?version=" + site.version;
		if((process.env.NODE_ENV === "production" && request.query.forceLoad !== "unminified") || request.query.forceLoad === "minified") {
			loader = "loader.min.js?version=" + site.version;
		}

		let url = request.url;
		let index = url.indexOf("?");
		if(index >= 0) {
			url = url.substring(0, index);
		}
		if(url[url.length-1] !== "/") {
			url += "/";
		}
		
		let urlObject = await database.getObjectByUrl(url);
		let moduleName = site.moduleName;
		if(request.query.forceModule) {
			moduleName = request.query.forceModule;
		}

		if(!urlObject) {
			reply.code(404);
			reply.type('text/html');

			let returnString = `<!doctype html>
<html lang="${language}">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>Page not found - ${siteName}</title>`;

                {
                    let currentArray = site.preconnectUrls;
                    let currentArrayLength = currentArray.length;
                    for(let i = 0; i < currentArrayLength; i++) {
                        returnString += `<link rel="preconnect" href="${currentArray[i]}" crossorigin />`;
                    }
                }

                if(site.disableSearchEngines) {
                    returnString += `<meta name="robots" content="noindex, nofollow" />`;
                }

                {
                    let currentArray = site.injectCodeSnippets;
                    let currentArrayLength = currentArray.length;
                    for(let i = 0; i < currentArrayLength; i++) {
                        returnString += currentArray[i];
                    }
                }

				returnString += `<link rel="stylesheet" type="text/css" href="${assetsUri}css/main.css?version=${version}" />
				<meta name="viewport" content="initial-scale=1,user-scalable=yes" />
				<meta name="HandheldFriendly" content="true" />
				<link rel="icon" type="image/png" href="${assetsUri}img/favicon.png" />
				</head>
				<body>
				<div id="site"></div>
				<script>
				(function(d,b,m,j,s){
						d[m] = d[m] || {}; d[m][j] = d[m][j] || {_: [], create: function(element, moduleName, data) {return this._.push({element, moduleName, data});}, remove: function(id) {this._[id-1] = null;}};
						let e = b.createElement("script"); e.async = true; e.src = s; b.head.appendChild(e);
					})(window, document, "dbmstartup", "modules", "${assetsUri}js/${loader}");
				
					dbmstartup.modules.create(document.getElementById("site"), "${moduleName}", {});
				</script>
				</body>
				</html>
			`;

            return returnString;
		}

		reply.code(200);
		reply.type('text/html');

		let fields = await urlObject.getFields();
        let languageItem = await urlObject.singleObjectRelationQuery("in:for:language");
        if(languageItem) {
            language = await languageItem.getIdentifier();
        }

        let baseUrl = request.protocol + "://" + request.hostname;
		if(request.port && request.port !== 80 && request.port !== 443) {
			baseUrl += ":" + request.port;
		}

        let fullUrl = baseUrl + url;

        let robotsText;

        if(site.disableSearchEngines) {
            robotsText = "noindex, nofollow";
        }
        else {
            let robotsSettings = ["index", "follow"];
            if(fields["seo/noIndex"]) {
                robotsSettings[0] = "noindex";
            }
            if(fields["seo/noFollow"]) {
                robotsSettings[1] = "nofollow";
            }

            robotsText = robotsSettings.join(", ");
        }

		let returnString = `<!doctype html>
<html lang="${language}">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="initial-scale=1,user-scalable=yes" />
		<meta name="HandheldFriendly" content="true" />
        <title>${fields.title} - ${siteName}</title>` + "\n";
        if(fields['meta/description']) {
			returnString += `		<meta name="description" content="${fields['meta/description']}" />` + "\n";
		}
        returnString += `		<link rel="canonical" href="${fullUrl}" />`+ "\n";
        returnString += `		<meta name="robots" content="${robotsText}" />`+ "\n";

		{
            let currentArray = site.preconnectUrls;
            let currentArrayLength =currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                returnString += `		<link rel="preconnect" href="${currentArray[i]}" crossorigin />`+ "\n";
            }
        }

        if(fields["contentPreloadTags"]){
            let currentArray = fields["contentPreloadTags"];
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                returnString += "		" + currentArray[i] + "\n";
            }
        }

        

        

        

        let schemaGenrator = new DbmGraphApi.schema.JsonLdGenerator();
        schemaGenrator.baseUrl = baseUrl;
        let schemaMarkup = await schemaGenrator.getWebsiteEntites();
        schemaMarkup = schemaMarkup.concat(await schemaGenrator.getPageEntites(urlObject))
        let encodedMarkup = JSON.stringify(schemaMarkup, null, 2).split("\n").join("\n\t\t\t\t");

        returnString += `		<script type="application/ld+json">
			{
				"@context": "https://schema.org",
				"@graph": ${encodedMarkup}
			}
		</script>`+ "\n";
            
        

		returnString += `		<meta property="og:type" content="website" />
		<meta property="og:locale" content="${language}" />
		<meta property="og:site_name" content="${siteName}" />
		<meta property="og:title" content="${fields.title}" />`+ "\n";

		{
            let currentArray = site.injectCodeSnippets;
            let currentArrayLength = currentArray.length;
            for(let i = 0; i < currentArrayLength; i++) {
                returnString += "		" + currentArray[i] + "\n";
            }
        }

        if(process.env.INLINE_STYLE_SHEET == 1) {
            returnString += `		<style>`+ "\n";

            let assetsDir = Dbm.getInstance().repository.getItem("site").assetsDir;
            let cssContent = await fs.promises.readFile(assetsDir + "/css/main.css", 'utf8');

            returnString += cssContent;

            returnString += `		</style>`+ "\n";
        }
        else {
            returnString += `		<link rel="stylesheet" type="text/css" href="${assetsUri}css/main.css?version=${version}" />`+ "\n";
        }
		
		
		
		returnString += `		<link rel="icon" type="image/png" href="${baseUrl}${assetsUri}img/favicon.png" />`+ "\n";

		if(fields['meta/description']) {
			returnString += `		<meta property="og:description" content="${fields['meta/description']}" />`+ "\n";;
		}

		

		returnString += `		<meta property="og:url" content="${fullUrl}" />`+ "\n";

        if(fields["lastModified"]) {
            returnString += `		<meta property="article:modified_time" content="${fields["lastModified"]}" />`+ "\n";;
        }

        let image = await urlObject.singleObjectRelationQuery("in:isMainImageFor:image");
        if(image) {
            let imageFields = await image.getFields();

            if(imageFields["resizeUrl"]) {
                let imageUrl = imageFields["resizeUrl"];
                let scaleString = "width=1200,height=630,fit=cover,format=jpeg";
                imageUrl = imageUrl.split("{scale}").join(scaleString);

                returnString += `		<meta property="og:image" content="${imageUrl}" />`+ "\n";;
                returnString += `		<meta property="og:image:width" content="1200" />`+ "\n";;
                returnString += `		<meta property="og:image:height" content="630" />`+ "\n";;
                returnString += `		<meta property="og:image:type" content="image/jpeg" />`+ "\n";;
                returnString += `		<meta property="twitter:card" content="summary_large_image" />`+ "\n";;
            }
            else {
                let imageUrl = imageFields["url"];
                returnString += `		<meta property="og:image" content="${imageUrl}" />`+ "\n";;
                returnString += `		<meta property="twitter:card" content="summary_large_image" />`+ "\n";;
            }
        }

		/*
	    <meta property="article:publisher" content="https://sv-se.facebook.com/..." />
        */


        let renderedContent = "";
        
        if(fields["renderedPageContent"]) {
            renderedContent = fields["renderedPageContent"];
        }
        
        let renderedContentHolder = "";
        if(renderedContent) {
            renderedContentHolder = `<div id="preRenderContent">${renderedContent}</div>`;
        }

        let moduleData = {};
        //METODO: add page data
        let endodedModuleData = JSON.stringify(moduleData);

		returnString += `   </head>
	<body>
		<div id="site">
            ${renderedContentHolder}
        </div>
		<script>
		(function(d,b,m,j,s){
				d[m] = d[m] || {}; d[m][j] = d[m][j] || {_: [], create: function(element, moduleName, data) {return this._.push({element, moduleName, data});}, remove: function(id) {this._[id-1] = null;}};
				let e = b.createElement("script"); e.async = true; e.src = s; b.head.appendChild(e);
			})(window, document, "dbmstartup", "modules", "${assetsUri}js/${loader}");
		
			dbmstartup.modules.create(document.getElementById("site"), "${moduleName}", ${endodedModuleData});
		</script>
	</body>
</html>`;

		return returnString;
	});
}