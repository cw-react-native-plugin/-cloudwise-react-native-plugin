#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_js_1 = require("./logger.js");
const config = require("./config.js");
const android = require("./android.js");
const fileOperationHelper_js_1 = require("./fileOperationHelper.js");
const pathsConstants_js_1 = require("./pathsConstants.js");
const ios_js_1 = require("./ios.js");
const nodePath = require("path");
const CONFIG_GRADLE_FILE = "gradle";
const CONFIG_PLIST_FILE = "plist";
const CONFIG_FILE = "config";
module.exports = (function () {
    logger_js_1.default.logMessageSync("Starting instrumentation of React Native application ..", logger_js_1.default.INFO);
    showVersionOfPlugin();
    let pathToConfig = pathsConstants_js_1.default.getConfigFilePath();
    let pathToGradle = pathsConstants_js_1.default.getAndroidGradleFile(pathsConstants_js_1.default.getAndroidFolder());
    let androidAvailable = true;
    let pathToPList = undefined;
    let iosAvailable = true;
    var argv = parseCommandLine(process.argv.slice(2));
    if (argv.config !== undefined) {
        pathToConfig = argv.config;
    }
    if (argv.gradle !== undefined) {
        pathToGradle = nodePath.resolve(argv.gradle);
        androidAvailable = isPlatformAvailable(pathToGradle, "Android");
    }
    else {
        androidAvailable = isPlatformAvailable(pathsConstants_js_1.default.getAndroidFolder(), "Android");
    }
    if (argv.plist !== undefined) {
        pathToPList = nodePath.resolve(argv.plist);
        iosAvailable = isPlatformAvailable(pathToPList, "iOS");
    }
    else {
        iosAvailable = isPlatformAvailable(pathsConstants_js_1.default.getIOSFolder(), "iOS");
    }
    pathToConfig = nodePath.resolve(pathToConfig);
    pathToGradle = nodePath.resolve(pathToGradle);
    if (iosAvailable || androidAvailable) {
        try {
            logger_js_1.default.logMessageSync("Trying to read configuration file: " + pathToConfig, logger_js_1.default.INFO);
            let configAgent = config.readConfig(pathToConfig);
            if (androidAvailable) {
                try {
                    logger_js_1.default.logMessageSync("Starting Android Instrumentation with Cloudwise!", logger_js_1.default.INFO);
                    android.instrumentAndroidPlatform(pathToGradle, false);
                    android.writeGradleConfig(configAgent.android);
                }
                catch (e) {
                    logger_js_1.default.logMessageSync(e.message, logger_js_1.default.ERROR);
                }
                finally {
                    logger_js_1.default.logMessageSync("Finished Android Instrumentation with Cloudwise!", logger_js_1.default.INFO);
                }
            }
            if (iosAvailable) {
                try {
                    logger_js_1.default.logMessageSync("Starting iOS Instrumentation with Cloudwise!", logger_js_1.default.INFO);
                    ios_js_1.default.modifyPListFile(pathToPList, configAgent.ios, false);
                }
                catch (e) {
                    logger_js_1.default.logMessageSync(e.message, logger_js_1.default.ERROR);
                }
                finally {
                    logger_js_1.default.logMessageSync("Finished iOS Instrumentation with Cloudwise!", logger_js_1.default.INFO);
                }
            }
            patchMetroSourceMap();
        }
        catch (e) {
            logger_js_1.default.logMessageSync(e, logger_js_1.default.ERROR);
        }
    }
    else {
        logger_js_1.default.logMessageSync("Both Android and iOS Folder are not available - Skip instrumentation.", logger_js_1.default.WARNING);
    }
    logger_js_1.default.logMessageSync("Finished instrumentation of React Native application ..", logger_js_1.default.INFO);
    logger_js_1.default.closeLogFile();
}());
function patchMetroSourceMap() {
    logger_js_1.default.logMessageSync("Patching SourceMap generation of Metro .. ", logger_js_1.default.INFO);
    let origSourceMapPath = nodePath.join(pathsConstants_js_1.default.getMetroSouceMapPath(), "getSourceMapInfoOrig.js");
    try {
        fileOperationHelper_js_1.default.checkIfFileExistsSync(origSourceMapPath);
        logger_js_1.default.logMessageSync("Patching of SourceMap already happened!", logger_js_1.default.INFO);
    }
    catch (e) {
        try {
            let currentSourceMapPath = nodePath.join(pathsConstants_js_1.default.getMetroSouceMapPath(), "getSourceMapInfo.js");
            fileOperationHelper_js_1.default.checkIfFileExistsSync(currentSourceMapPath);
            fileOperationHelper_js_1.default.renameFileSync(currentSourceMapPath, origSourceMapPath);
            fileOperationHelper_js_1.default.copyFileSync(pathsConstants_js_1.default.getOurSourceMapFile(), currentSourceMapPath);
            logger_js_1.default.logMessageSync("Patching of SourceMap successful!", logger_js_1.default.INFO);
        }
        catch (e) {
            logger_js_1.default.logMessageSync("Patching of SourceMap generation failed!", logger_js_1.default.ERROR);
        }
    }
}
function showVersionOfPlugin() {
    try {
        let packageJsonContent = fileOperationHelper_js_1.default.readTextFromFileSync(pathsConstants_js_1.default.getInternalPackageJsonFile());
        let packageJsonContentObj = JSON.parse(packageJsonContent);
        logger_js_1.default.logMessageSync("Cloudwise React Native Plugin - Version " + packageJsonContentObj.version, logger_js_1.default.INFO);
    }
    catch (e) {
        logger_js_1.default.logMessageSync("Cloudwise React Native Plugin - Version NOT READABLE", logger_js_1.default.WARNING);
    }
}
function parseCommandLine(inputArgs) {
    let parsedArgs = {};
    inputArgs.forEach(function (entry) {
        let parts = entry.split("=");
        if (parts.length == 2) {
            switch (parts[0]) {
                case CONFIG_GRADLE_FILE:
                    parsedArgs.gradle = parts[1];
                    break;
                case CONFIG_FILE:
                    parsedArgs.config = parts[1];
                    break;
                case CONFIG_PLIST_FILE:
                    parsedArgs.plist = parts[1];
                    break;
            }
        }
    });
    return parsedArgs;
}
function isPlatformAvailable(path, platform) {
    try {
        fileOperationHelper_js_1.default.checkIfFileExistsSync(path);
        return true;
    }
    catch (e) {
        logger_js_1.default.logMessageSync(`${platform} Location doesn't exist - Skip ${platform} instrumentation and configuration.`, logger_js_1.default.WARNING);
        return false;
    }
}
