import Dbm from "dbm";
import { exec } from 'node:child_process';
import { createHash } from 'node:crypto';

export default class ReRenderPages extends Dbm.core.BaseObject {
    _construct() {
        super._construct();
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let database = Dbm.getRepositoryItem("graphDatabase").controller;
        
        let pages = await database.getObjectsOfType("page");
        let currentArray = pages;
        let currentArrayLength = currentArray.length;
        for(let i = 0; i < currentArrayLength; i++) {
            let page = currentArray[i];

            await database.addActionToProcess("pageUpdates/updateRenderedContent", [page]);
        }

        return returnObject;
    }
}