#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const fileOperationHelper_1 = require("./fileOperationHelper");
const pathsConstants_1 = require("./pathsConstants");
const android = require("./android");
const ios_1 = require("./ios");
const nodePath = require("path");
module.exports = (function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield modifyPackageJson();
        yield removeGradleModification();
        yield removePListModification();
    });
}());
function modifyPackageJson() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let pathToPackageJson = pathsConstants_1.default.getPackageJsonFile();
            let packageJson = yield fileOperationHelper_1.default.readTextFromFile(pathToPackageJson);
            let packageJsonParsed = JSON.parse(packageJson);
            if (packageJsonParsed.scripts != undefined && packageJsonParsed.scripts.instrumentCloudwise != undefined) {
                delete packageJsonParsed.scripts.instrumentCloudwise;
                yield fileOperationHelper_1.default.writeTextToFile(pathToPackageJson, JSON.stringify(packageJsonParsed));
                logger_1.default.logMessageSync("Modified package.json - Removed the instrumentCloudwise script!", logger_1.default.INFO);
            }
            yield removePatchMetroSourceMap();
        }
        catch (e) {
            logger_1.default.logMessageSync("Could not find package.json - please remove instrumentCloudwise script manually!", logger_1.default.WARNING);
        }
    });
}
function removePatchMetroSourceMap() {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.logMessageSync("Undo Patching SourceMap generation of Metro .. ", logger_1.default.INFO);
        try {
            let currentSourceMapPath = nodePath.join(pathsConstants_1.default.getMetroSouceMapPath(), "getSourceMapInfo.js");
            let origSourceMapPath = nodePath.join(pathsConstants_1.default.getMetroSouceMapPath(), "getSourceMapInfoOrig.js");
            yield fileOperationHelper_1.default.checkIfFileExists(origSourceMapPath);
            yield fileOperationHelper_1.default.deleteFile(currentSourceMapPath);
            yield fileOperationHelper_1.default.renameFile(origSourceMapPath, currentSourceMapPath);
            logger_1.default.logMessageSync("Removed patch for SourceMap generation of Metro!", logger_1.default.INFO);
        }
        catch (e) {
            logger_1.default.logMessageSync("Removing of patch for SourceMap generation failed!", logger_1.default.ERROR);
        }
    });
}
function removeGradleModification() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let path = yield fileOperationHelper_1.default.checkIfFileExists(nodePath.join(pathsConstants_1.default.getAndroidFolder(), "build.gradle"));
            android.instrumentAndroidPlatform(path, true);
        }
        catch (e) {
            logger_1.default.logMessageSync("Removal of Gradle modification didnt work!", logger_1.default.ERROR);
        }
    });
}
function removePListModification() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            ios_1.default.modifyPListFile(undefined, undefined, true);
        }
        catch (e) {
            logger_1.default.logMessageSync("Removal of PList modification didnt work!", logger_1.default.ERROR);
        }
    });
}
