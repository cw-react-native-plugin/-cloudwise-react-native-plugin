"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = require("semver");
const versionBoundary = "0.60.1";
const android = 1;
const ios = 2;
let reactNativeVersionString;
try {
    reactNativeVersionString = require('react-native/package.json').version;
}
catch (e) {
    reactNativeVersionString = null;
}
if (reactNativeVersionString === null) {
    module.exports = [];
}
else if (semver_1.gte(reactNativeVersionString, versionBoundary)) {
    module.exports = getCommandForRN60_1();
}
else {
    module.exports = getCommandForRN60_0();
}
function getCommandForRN60_0() {
    return [
        getCommand("instrument-cloudwise", "Applies the Cloudwise configuration.", -1)
    ];
}
function getCommandForRN60_1() {
    return [
        getCommand("run-android", "Extends the original run-android. Applies the Cloudwise configuration.", android),
        getCommand("run-ios", "Extends the original run-ios. Applies the Cloudwise configuration.", ios)
    ];
}
function getCommand(name, description, os) {
    let ex = [];
    let cm = [];
    let returnCommands = {
        name: name,
        description: description,
        options: cm,
        examples: ex,
        func: () => {
            require("../scripts/instrument");
        }
    };
    returnCommands.options.push(...getInternalOptions());
    returnCommands.examples.push(...getInternalExample(name));
    if (os === android) {
        returnCommands.options.push(...getAndroidOptions());
    }
    else if (os === ios) {
        returnCommands.options.push(...getIosOptions());
        returnCommands.examples.push(...getIosExamples());
    }
    return returnCommands;
}
function getInternalOptions() {
    return [
        { command: 'gradle [string]',
            description: 'The location of the root build.gradle file. We will assume that the other gradle file resides in /app/build.gradle. This will add the whole agent dependencies automatically for you and will update the configuration.' },
        { command: 'plist [string]',
            description: 'Tell the script where your info.plist file is. The plist file is used for updating the configuration for the agent.' },
        { command: 'config [string]',
            description: 'If you have not got your config file in the root folder of the React Native project but somewhere else.' }
    ];
}
function getInternalExample(name) {
    return [
        { desc: `${name} with custom cloudwise.config.js path and custom port`,
            cmd: `react-native ${name} --verbose gradle=C:\\MyCustomPath\\cloudwise.config.js --port=2000` },
    ];
}
function getIosExamples() {
    return [{
            desc: 'Run on a different simulator, e.g. iPhone 5',
            cmd: 'react-native run-ios --simulator "iPhone 5"'
        }, {
            desc: 'Pass a non-standard location of iOS directory',
            cmd: 'react-native run-ios --project-path "./app/ios"'
        }, {
            desc: "Run on a connected device, e.g. Max's iPhone",
            cmd: 'react-native run-ios --device "Max\'s iPhone"'
        }, {
            desc: 'Run on the AppleTV simulator',
            cmd: 'react-native run-ios --simulator "Apple TV"  --scheme "helloworld-tvOS"'
        }];
}
function getIosOptions() {
    return [
        {
            command: '--simulator [string]',
            description: 'Explicitly set simulator to use. Optionally include iOS version between' + 'parenthesis at the end to match an exact version: "iPhone 6 (10.0)"'
        }, {
            command: '--configuration [string]',
            description: 'Explicitly set the scheme configuration to use'
        }, {
            command: '--scheme [string]',
            description: 'Explicitly set Xcode scheme to use'
        }, {
            command: '--project-path [string]',
            description: 'Path relative to project root where the Xcode project ' + '(.xcodeproj) lives.'
        }, {
            command: '--device [string]',
            description: 'Explicitly set device to use by name.  The value is not required if you have a single device connected.'
        }, {
            command: '--udid [string]',
            description: 'Explicitly set device to use by udid'
        }, {
            command: '--no-packager',
            description: 'Do not launch packager while building'
        }, {
            command: '--verbose',
            description: 'Do not use xcpretty even if installed'
        }, {
            command: '--port [number]',
            description: 'Port of the webserver'
        }, {
            command: '--terminal [string]',
            description: 'Launches the Metro Bundler in a new window using the specified terminal path.'
        }
    ];
}
function getAndroidOptions() {
    return [
        {
            command: '--root [string]',
            description: 'Override the root directory for the android build (which contains the android directory)'
        }, {
            command: '--variant [string]',
            description: "Specify your app's build variant"
        }, {
            command: '--appFolder [string]',
            description: 'Specify a different application folder name for the android source. If not, we assume is "app"'
        }, {
            command: '--appId [string]',
            description: 'Specify an applicationId to launch after build.'
        }, {
            command: '--appIdSuffix [string]',
            description: 'Specify an applicationIdSuffix to launch after build.'
        }, {
            command: '--main-activity [string]',
            description: 'Name of the activity to start'
        }, {
            command: '--deviceId [string]',
            description: 'builds your app and starts it on a specific device/simulator with the ' + 'given device id (listed by running "adb devices" on the command line).'
        }, {
            command: '--no-packager',
            description: 'Do not launch packager while building'
        }, {
            command: '--port [number]',
            description: 'Port of the webserver'
        }, {
            command: '--terminal [string]',
            description: 'Launches the Metro Bundler in a new window using the specified terminal path.'
        }, {
            command: '--tasks [list]',
            description: 'Run custom Gradle tasks. By default it\'s "installDebug"'
        }, {
            command: '--no-jetifier',
            description: 'Do not run "jetifier" – the AndroidX transition tool. By default it runs before Gradle to ease working with libraries that don\'t support AndroidX yet. See more at: https://www.npmjs.com/package/jetifier.'
        }
    ];
}
