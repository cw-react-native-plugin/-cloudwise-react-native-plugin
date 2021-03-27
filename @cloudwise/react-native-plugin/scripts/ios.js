#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const fileOperationHelper_1 = require("./fileOperationHelper");
const pathsConstants_1 = require("./pathsConstants");
const plist = require("plist");
const nodePath = require("path");
exports.default = {
    modifyPListFile: modifyPListFile,
    findPListFile: findPListFile
};
function modifyPListFile(pathToPList, iosConfig, removeOnly) {
    if (pathToPList === undefined) {
        pathToPList = findPListFile();
    }
    else {
        if (!pathToPList.endsWith(".plist")) {
            throw new Error("Can't find .plist file. plist path must also include the plist file!");
        }
        try {
            fileOperationHelper_1.default.checkIfFileExistsSync(pathToPList);
        }
        catch (e) {
            throw new Error("Could not read plist file: " + pathToPList);
        }
    }
    let parsedPList = parsePList(pathToPList);
    let configProps = iosConfig === null || iosConfig === void 0 ? void 0 : iosConfig.config;
    if (removeOnly) {
        removePListConfig(pathToPList);
    }
    else {
        if (iosConfig && configProps) {
            if (hasDuplicateProperties(configProps)) {
                throw new Error("Duplicate properties found! Please remove duplicates and try again.");
            }
            if (isAutoStartEnabled(configProps)) {
                if (checkForBeaconUrlAndAppId(configProps)) {
                    createNewPListIfRequired(parsedPList, configProps, pathToPList);
                }
                else {
                    throw new Error("The cloudwise.config.js file does not contain DTXBeaconURL or DTXApplicationID properties. If you want to auto-start the iOS agent, please add these two properties at minimum as they are required. If you are using a manual startup of the iOS agent, please add just the DTXAutoStart property (no other properties are needed and none will be considered) with the value set to false.");
                }
            }
            else {
                if (checkForBeaconUrlAndAppId(configProps)) {
                    throw new Error("The cloudwise.config.js file contains DTXBeaconURL and or DTXApplicationID properties while DTXAutoStart is set to false. Any properties that you add to the cloudwise.config.js file will not be used if DTXAutoStart is set to false. If you want to manually start the iOS agent, please only add the DTXAutoStart property and set the value to false.");
                }
                else {
                    createNewPListIfRequired(parsedPList, configProps, pathToPList);
                }
            }
        }
        else {
            throw new Error("Can't write configuration of iOS agent because it is missing!");
        }
    }
}
function removePListConfig(file) {
    let pListContent = fileOperationHelper_1.default.readTextFromFileSync(file);
    let pListObj = plist.parse(pListContent);
    let pListObjCopy = Object.assign({}, pListObj);
    for (let property in pListObj) {
        if (property.startsWith("DTX")) {
            delete pListObjCopy[property];
        }
    }
    fileOperationHelper_1.default.writeTextToFileSync(file, plist.build(pListObjCopy));
    logger_1.default.logMessageSync("Removed old configuration in plist file: " + file, logger_1.default.INFO);
}
function addAgentConfigToPListFile(file, config) {
    let pListContent = fileOperationHelper_1.default.readTextFromFileSync(file);
    let newPListContent = "<plist><dict>" + config + "</dict></plist>";
    fileOperationHelper_1.default.writeTextToFileSync(file, plist.build(Object.assign(Object.assign({}, plist.parse(pListContent)), plist.parse(newPListContent))));
    logger_1.default.logMessageSync("Updated configuration in plist file: " + file, logger_1.default.INFO);
}
function findPListFile() {
    let appJson = fileOperationHelper_1.default.readTextFromFileSync(pathsConstants_1.default.getAppJsonFile());
    let appJsonObj = JSON.parse(appJson);
    let appName;
    if (appJsonObj.expo !== undefined) {
        appName = appJsonObj.expo.name;
    }
    else if (appJsonObj.name !== undefined) {
        appName = appJsonObj.name;
    }
    else {
        throw new Error("Name of the application is unknown. Check your app.json file!");
    }
    let pListPaths = [];
    pListPaths.push(nodePath.join(pathsConstants_1.default.getIOSFolder(), appName, "Info.plist"));
    pListPaths.push(nodePath.join(pathsConstants_1.default.getIOSFolder(), appName, "Supporting", "Info.plist"));
    for (let i = 0; i < pListPaths.length; i++) {
        try {
            fileOperationHelper_1.default.checkIfFileExistsSync(pListPaths[i]);
            return pListPaths[i];
        }
        catch (e) {
        }
    }
    throw new Error("Can't find .plist file in iOS Folder! Try to use plist= custom argument. See documentation for help!");
}
function parsePList(file) {
    let pListContent = fileOperationHelper_1.default.readTextFromFileSync(file);
    let pListObj = plist.parse(pListContent);
    return pListObj = Object.assign({}, pListObj);
}
function isAutoStartEnabled(config) {
    if (config && config.indexOf("<key>DTXAutoStart</key>") === -1) {
        return true;
    }
    let configObj = "<plist><dict>" + config + "</dict></plist>";
    let configObjCopy = plist.parse(configObj);
    let configKeys = Object.keys(configObjCopy);
    let configValues = Object.values(configObjCopy);
    for (let key in configKeys) {
        if (configKeys[key] === "DTXAutoStart" && configValues[key]) {
            return true;
        }
    }
    return false;
}
function checkForBeaconUrlAndAppId(config) {
    return config != null && config.indexOf("DTXApplicationID") >= 0 && config.indexOf("DTXBeaconURL") >= 0;
}
function isPropertyCountEqual(parsedPList, config) {
    let configObj = "<plist><dict>" + config + "</dict></plist>";
    let configObjCopy = plist.parse(configObj);
    return Object.keys(parsedPList).filter(pListDtxKeys => pListDtxKeys.startsWith("DTX")).length === Object.keys(configObjCopy).filter(configDtxKeys => configDtxKeys.startsWith("DTX")).length;
}
function areConfigsEqual(parsedPList, configObj) {
    let pListKeys = Object.keys(parsedPList);
    for (let property of pListKeys) {
        let plistProperty = parsedPList[property];
        let configProperty = configObj[property];
        let objectProperties = isPropertyAnObject(plistProperty) && isPropertyAnObject(configProperty);
        if (objectProperties && !areConfigsEqual(plistProperty, configProperty) ||
            !objectProperties && plistProperty !== configProperty) {
            return false;
        }
    }
    return true;
}
function comparePListAndConfig(pListObj, config) {
    let configObj = "<plist><dict>" + config + "</dict></plist>";
    let configObjCopy = plist.parse(configObj);
    removeNonDTXProperties(pListObj);
    removeNonDTXProperties(configObjCopy);
    return areConfigsEqual(pListObj, configObjCopy);
}
function isPropertyAnObject(propertyObject) {
    return propertyObject != null && typeof propertyObject === 'object';
}
function removeNonDTXProperties(propertiesObject) {
    let updatedObject = propertiesObject;
    for (let property in propertiesObject) {
        if (!property.startsWith("DTX")) {
            delete updatedObject[property];
        }
    }
    return updatedObject;
}
function hasDuplicateProperties(config) {
    let configArr = config.split("\n");
    let newConfigArr = configArr.filter(configDtxKeys => configDtxKeys.startsWith("<key>DTX"));
    return !newConfigArr.every(property => newConfigArr.indexOf(property) === newConfigArr.lastIndexOf(property));
}
function createNewPListIfRequired(parsedPList, configProps, pathToPList) {
    if (isPropertyCountEqual(parsedPList, configProps) && comparePListAndConfig(parsedPList, configProps)) {
        logger_1.default.logMessageSync("Not generating a new plist as the current plist and cloudwise.config.js iOS properties are identical!", logger_1.default.INFO);
    }
    else {
        logger_1.default.logMessageSync("Generating a new plist as the current plist and cloudwise.config.js iOS properties do not match!", logger_1.default.INFO);
        removePListConfig(pathToPList);
        addAgentConfigToPListFile(pathToPList, configProps);
    }
}
