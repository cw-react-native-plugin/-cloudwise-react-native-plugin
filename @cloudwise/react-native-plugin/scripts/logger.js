#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileOperationHelper_1 = require("./fileOperationHelper");
const pathsConstants_1 = require("./pathsConstants");
const config_1 = require("./config");
const fs = require("fs");
const nodePath = require("path");
const ERROR = 0;
const INFO = 1;
const WARNING = 2;
exports.default = {
    ERROR: ERROR,
    INFO: INFO,
    WARNING: WARNING,
    closeLogFile: closeLogFile,
    logMessageSync: logMessageSync,
    logErrorSync: logErrorSync
};
function closeLogFile() {
    if (process.env.SILENT == "true") {
        return;
    }
    return fileOperationHelper_1.default.checkIfFileExists(pathsConstants_1.default.getCurrentLogPath())
        .then((_file) => {
        return new Promise(function (resolve, reject) {
            let logFileName = currentDate().split(":").join("-") + ".txt";
            fs.rename(_file, nodePath.join(pathsConstants_1.default.getLogPath(), logFileName), (err) => {
                if (err) {
                    reject("Renaming of the log file failed!");
                }
                resolve(nodePath.join(pathsConstants_1.default.getLogPath(), logFileName));
            });
        });
    })
        .catch(errorHandling);
}
function logErrorSync(_message) {
    let config = config_1.readConfig(pathsConstants_1.default.getConfigFilePath());
    if (config.react !== undefined && config.react.debug) {
        logMessageSync(_message, ERROR, true);
    }
}
function logMessageSync(_message, _logLevel, _onlyConsole = false) {
    if (process.env.SILENT == "true") {
        return;
    }
    try {
        fs.mkdirSync(pathsConstants_1.default.getLogPath());
    }
    catch (e) {
    }
    let logString;
    if (_logLevel == INFO) {
        logString = "#INFO  ";
    }
    else if (_logLevel == WARNING) {
        logString = "#WARN  ";
    }
    else if (_logLevel == ERROR) {
        logString = "#ERROR ";
    }
    else {
        logString = "#NONE  ";
    }
    let outputString = logString + "[" + currentDate() + "]: " + _message;
    console.log(outputString);
    if (!_onlyConsole) {
        fs.appendFileSync(pathsConstants_1.default.getCurrentLogPath(), outputString + "\r\n");
    }
}
function errorHandling(_message) {
    console.log(_message);
}
function currentDate() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -5);
    return localISOTime.replace("T", " ");
}
