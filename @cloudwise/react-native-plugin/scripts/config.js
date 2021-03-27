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
exports.checkConfiguration = exports.readConfig = exports.defaultConfig = exports.ERROR_CONFIG_NOT_AVAILABLE = void 0;
const fileOperationHelper_1 = require("./fileOperationHelper");
const logger_1 = require("./logger");
const pathsConstants_1 = require("./pathsConstants");
exports.ERROR_CONFIG_NOT_AVAILABLE = "-1";
exports.defaultConfig = {
    react: {
        autoStart: true,
        debug: false,
        lifecycle: {
            includeUpdate: false,
            instrument: (filename) => false
        },
        input: {
            instrument: (filename) => true
        }
    }
};
function readConfig(pathToConfig) {
    let readConfig;
    patchMalformedConfiguration(pathToConfig);
    readConfig = require(pathToConfig);
    if (readConfig === undefined) {
        throw new Error(exports.ERROR_CONFIG_NOT_AVAILABLE);
    }
    return addDefaultConfigs(readConfig);
}
exports.readConfig = readConfig;
function addDefaultConfigs(config) {
    let duplicateDefaultConfigReact = Object.assign({}, exports.defaultConfig.react);
    duplicateDefaultConfigReact = Object.assign(duplicateDefaultConfigReact, config.react);
    duplicateDefaultConfigReact.lifecycle = Object.assign(duplicateDefaultConfigReact.lifecycle, config.react.lifecycle);
    duplicateDefaultConfigReact.input = Object.assign(duplicateDefaultConfigReact.input, config.react.input);
    config.react = duplicateDefaultConfigReact;
    return config;
}
function checkConfiguration() {
    return __awaiter(this, void 0, void 0, function* () {
        let pathToCloudwiseConfig = pathsConstants_1.default.getConfigFilePath();
        try {
            yield fileOperationHelper_1.default.checkIfFileExists(pathToCloudwiseConfig);
        }
        catch (e) {
            yield createNewConfiguration(pathToCloudwiseConfig);
        }
    });
}
exports.checkConfiguration = checkConfiguration;
function createNewConfiguration(pathToCloudwiseConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        let defaultConfigContent = yield fileOperationHelper_1.default.readTextFromFile(pathsConstants_1.default.getDefaultConfig());
        yield fileOperationHelper_1.default.writeTextToFile(pathToCloudwiseConfig, defaultConfigContent);
        logger_1.default.logMessageSync("Created cloudwise.config.js - Please insert your configuration and update the file!", logger_1.default.INFO);
    });
}
function patchMalformedConfiguration(pathToCloudwiseConfig) {
    let configContent = fileOperationHelper_1.default.readTextFromFileSync(pathToCloudwiseConfig);
    if (configContent.indexOf("\u200B") != -1) {
        fileOperationHelper_1.default.writeTextToFileSync(pathToCloudwiseConfig, configContent.split("\u200B").join(""));
    }
}
