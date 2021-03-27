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
const config = require("./config");
const nodePath = require("path");
module.exports = (function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield modifyPackageJson();
        yield config.checkConfiguration();
    });
}());
function modifyPackageJson() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let pathToPackageJson = pathsConstants_1.default.getPackageJsonFile();
            let packageJson = yield fileOperationHelper_1.default.readTextFromFile(pathToPackageJson);
            let packageJsonParsed = JSON.parse(packageJson);
            let instrumentCloudwiseValue = "node " + nodePath.relative(pathsConstants_1.default.getApplicationPath(), nodePath.join(__dirname, "instrument.js"));
            if (packageJsonParsed.scripts == undefined) {
                packageJsonParsed.scripts = {};
            }
            if (packageJsonParsed.scripts.instrumentCloudwise === instrumentCloudwiseValue) {
                logger_1.default.logMessageSync("No need to modify the package.json as it already includes the instrumentCloudwise script!", logger_1.default.INFO);
            }
            else {
                packageJsonParsed.scripts.instrumentCloudwise = instrumentCloudwiseValue;
                yield fileOperationHelper_1.default.writeTextToFile(pathToPackageJson, JSON.stringify(packageJsonParsed, null, "\t"));
                logger_1.default.logMessageSync("Modified package.json - You are now able to call npm run instrumentCloudwise!", logger_1.default.INFO);
            }
        }
        catch (e) {
            logger_1.default.logMessageSync("Could not find package.json - please add instrumentCloudwise script manually!", logger_1.default.WARNING);
        }
    });
}
