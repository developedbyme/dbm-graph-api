import Dbm from "dbm";
import { exec } from 'node:child_process';
import { createHash } from 'node:crypto';

export default class RestartServer extends Dbm.core.BaseObject {
    _construct() {
        super._construct();

        this.item.requireProperty("salt", "]g[Qy-P?>KYEMf]Uf=:Hin5pA`oic6+s2wTn0&sqhdG)nFCZT)b[Osf5$w+0Z5a=");
        this.item.requireProperty("restartKey", "c62b65e5eca50e92eb6c0f0cb1a74fc4ac43e0352b0d944389dddd27a2c62a47");
    }

    async performAction(aData, aEncodeSession) {
        let returnObject = {};

        let key = aData["key"];

        let hash = createHash('sha256');
        hash.update(key + this.item.salt);
        let hashedKey = hash.digest('hex');

        if(hashedKey !== this.item.restartKey) {
            throw("Not allowed");
        }
        
        let processName = process.env.name;

        if(processName) {
            returnObject["processName"] = processName;

            setTimeout(function() {
                exec('pm2 restart ' + processName, (error, stdout, stderr) => {
                    if (error) {
                      console.warn(`Failed to restart: ${error.message}`);
                    }
              
                    if (stderr) {
                      console.warn(`PM2 stderr: ${stderr}`);
                    }
                });
            }, 200);
            
            returnObject["success"] = true;
            returnObject["message"] = "Trying to restart";
        }
        else {
            returnObject["success"] = false;
        }

        return returnObject;
    }
}