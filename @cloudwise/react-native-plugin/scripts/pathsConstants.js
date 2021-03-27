#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodePath = require("path");
const PATH_FILES = "files";
const PATH_LOGS = "logs";
var rootPath = __dirname;
exports.default = {
    setRoot: function (newRoot) {
        rootPath = nodePath.resolve(newRoot);
    },
    getApplicationPath: function () {
        return nodePath.join(getPluginPath(), "..", "..", "..");
    },
    getAppJsonFile: function () {
        return nodePath.join(this.getApplicationPath(), "app.json");
    },
    getPackageJsonFile: function () {
        return nodePath.join(this.getApplicationPath(), "package.json");
    },
    getMetroSouceMapPath: function () {
        return nodePath.join(this.getApplicationPath(), "node_modules", "metro", "src", "DeltaBundler", "Serializers", "helpers");
    },
    getOurSourceMapFile: function () {
        return nodePath.join(getPluginPath(), "lib", "metro2", "getSourceMapInfo.js");
    },
    getInternalPackageJsonFile: function () {
        return nodePath.join(getPluginPath(), "package.json");
    },
    getDefaultConfig: function () {
        return nodePath.join(getPluginPath(), PATH_FILES, "default.config.js");
    },
    getBuildPath: function () {
        return nodePath.join(getPluginPath(), "build");
    },
    getConfigFilePath: function () {
        return nodePath.join(this.getApplicationPath(), "cloudwise.config.js");
    },
    getAndroidFolder: function () {
        return nodePath.join(this.getApplicationPath(), "android");
    },
    getAndroidGradleFile: function (androidFolder) {
        return nodePath.join(androidFolder, "build.gradle");
    },
    getIOSFolder: function () {
        return nodePath.join(this.getApplicationPath(), "ios");
    },
    getCloudwiseGradleFile: function () {
        return nodePath.join(getPluginPath(), PATH_FILES, "cloudwise.gradle");
    },
    getCurrentLogPath: function () {
        return nodePath.join(getPluginPath(), PATH_LOGS, "currentLog.txt");
    },
    getLogPath: function () {
        return nodePath.join(getPluginPath(), PATH_LOGS);
    }
};
function getPluginPath() {
    return nodePath.join(rootPath, "..");
}
