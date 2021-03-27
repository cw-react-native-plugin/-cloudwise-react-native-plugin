#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeGradleConfig = exports.instrumentAndroidPlatform = exports.GRADLE_APPLY_BUILDSCRIPT = exports.GRADLE_DYNATRACE_FILE = void 0;
const logger_1 = require("./logger");
const fileOperationHelper_1 = require("./fileOperationHelper");
const pathsConstants_1 = require("./pathsConstants");
const GRADLE_CONFIG_IDENTIFIER = "// AUTO - INSERTED";
exports.GRADLE_DYNATRACE_FILE = "apply from: \"../node_modules/react-native-plugin2/files/cloudwise.gradle\"";
const GRADLE_BUILDSCRIPT_IDENTIFIER = "buildscript";
exports.GRADLE_APPLY_BUILDSCRIPT = "apply from: \"../node_modules/react-native-plugin2/files/plugin.gradle\", to: buildscript";
function instrumentAndroidPlatform(pathToGradle, remove) {
    let path = fileOperationHelper_1.default.checkIfFileExistsSync(pathToGradle);
    if (!path.endsWith(".gradle")) {
        throw new Error("Can't find .gradle file. gradle path must also include the gradle file!");
    }
    changeReactNativeBuildGradleFile(path, remove);
}
exports.instrumentAndroidPlatform = instrumentAndroidPlatform;
function removeOldCloudwiseClasspath(gradleFileContent) {
    let gradleFileContentLines = gradleFileContent.split("\n");
    for (let i = 0; i < gradleFileContentLines.length; i++) {
        if (gradleFileContentLines[i].indexOf("com.cloudwise.tools") > -1) {
            gradleFileContentLines.splice(i, 1);
            logger_1.default.logMessageSync("Removed old Cloudwise classpath from build.gradle", logger_1.default.INFO);
            break;
        }
    }
    return gradleFileContentLines.join("\n");
}
function changeReactNativeBuildGradleFile(pathToGradle, remove) {
    let gradleFileContent = fileOperationHelper_1.default.readTextFromFileSync(pathToGradle);
    let modifiedFileContent = removeOldCloudwiseClasspath(gradleFileContent);
    let gradleFileContentLines = modifiedFileContent.split("\n");
    let gradlePluginFileIndex = -1;
    let gradleCloudwiseFileIndex = -1;
    for (let i = 0; i < gradleFileContentLines.length && (gradleCloudwiseFileIndex === -1 || gradlePluginFileIndex === -1); i++) {
        if (gradleFileContentLines[i].indexOf("plugin.gradle") > -1) {
            gradlePluginFileIndex = i;
        }
        else if (gradleFileContentLines[i].indexOf("cloudwise.gradle") > -1) {
            gradleCloudwiseFileIndex = i;
        }
    }
    let modified = false;
    if (remove) {
        if (gradlePluginFileIndex !== -1) {
            gradleFileContentLines.splice(gradlePluginFileIndex, 1);
            modified = true;
        }
        if (gradleCloudwiseFileIndex !== -1) {
            gradleFileContentLines.splice(gradleCloudwiseFileIndex - (modified ? 1 : 0), 1);
            modified = true;
        }
        if (modified) {
            logger_1.default.logMessageSync("Removed Cloudwise modifications from build.gradle: " + pathToGradle, logger_1.default.INFO);
        }
    }
    else {
        if (gradlePluginFileIndex === -1) {
            let gradleFileReactIndex = -1;
            for (let i = 0; i < gradleFileContentLines.length; i++) {
                if (gradleFileContentLines[i].startsWith(GRADLE_BUILDSCRIPT_IDENTIFIER)) {
                    gradleFileReactIndex = i;
                    break;
                }
            }
            if (gradleFileReactIndex === -1) {
                throw new Error("Could not find Buildscript block in build.gradle.");
            }
            gradleFileContentLines.splice(gradleFileReactIndex + 1, 0, exports.GRADLE_APPLY_BUILDSCRIPT);
            modified = true;
        }
        if (gradleCloudwiseFileIndex === -1) {
            gradleFileContentLines.splice(gradleFileContentLines.length, 0, exports.GRADLE_DYNATRACE_FILE);
            modified = true;
        }
        if (modified) {
            logger_1.default.logMessageSync("Added Cloudwise plugin.gradle to the build.gradle: " + pathToGradle, logger_1.default.INFO);
        }
        else {
            logger_1.default.logMessageSync("Cloudwise plugin & agent already added to build.gradle", logger_1.default.INFO);
        }
    }
    if (modified) {
        let fullGradleFile = gradleFileContentLines.join("\n");
        fileOperationHelper_1.default.writeTextToFileSync(pathToGradle, fullGradleFile);
    }
}
function writeGradleConfig(androidConfig) {
    if (androidConfig === undefined || androidConfig.config === undefined) {
        logger_1.default.logMessageSync("Can't write configuration of Android agent because it is missing!", logger_1.default.WARNING);
        return;
    }
    let gradleFileContent = fileOperationHelper_1.default.readTextFromFileSync(pathsConstants_1.default.getCloudwiseGradleFile());
    let gradleFileContentLines = removeOldGradleConfig(gradleFileContent);
    let gradleFileIndex = -1;
    for (let i = 0; i < gradleFileContentLines.length; i++) {
        if (gradleFileContentLines[i].indexOf(GRADLE_CONFIG_IDENTIFIER) > -1) {
            gradleFileIndex = i;
            break;
        }
    }
    gradleFileContentLines.splice(gradleFileIndex + 1, 0, androidConfig.config);
    let fullGradleFile = gradleFileContentLines.join("\n");
    fileOperationHelper_1.default.writeTextToFileSync(pathsConstants_1.default.getCloudwiseGradleFile(), fullGradleFile);
    logger_1.default.logMessageSync("Replaced old configuration with current configuration in cloudwise.gradle", logger_1.default.INFO);
}
exports.writeGradleConfig = writeGradleConfig;
function removeOldGradleConfig(gradleFileContent) {
    let gradleFileContentLines = gradleFileContent.split("\n");
    var gradleConfigIndex = [];
    for (let i = 0; i < gradleFileContentLines.length && gradleConfigIndex.length < 2; i++) {
        if (gradleFileContentLines[i].indexOf(GRADLE_CONFIG_IDENTIFIER) > -1) {
            gradleConfigIndex.push(i);
        }
    }
    if (gradleConfigIndex.length != 2) {
        throw new Error("Could not find identfier in internal gradle file. Please re-install.");
    }
    gradleFileContentLines.splice(gradleConfigIndex[0] + 1, gradleConfigIndex[1] - (gradleConfigIndex[0] + 1));
    return gradleFileContentLines;
}
