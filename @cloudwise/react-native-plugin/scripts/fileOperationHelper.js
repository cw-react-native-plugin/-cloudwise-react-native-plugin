#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
exports.default = {
    checkIfFileExists,
    checkIfFileExistsSync,
    readTextFromFile,
    readTextFromFileSync,
    writeTextToFile,
    writeTextToFileSync,
    deleteDirectory,
    deleteFile,
    deleteFileSync,
    createDirectorySync,
    renameFile,
    renameFileSync,
    copyFile,
    copyFileSync,
    copyDirectory
};
function checkIfFileExists(_file) {
    return new Promise(function (resolve, reject) {
        fs.stat(_file, function (err) {
            if (err) {
                reject(`${err} - File doesn't exist: ${path.resolve(_file)}`);
            }
            resolve(_file);
        });
    });
}
function checkIfFileExistsSync(_file) {
    fs.statSync(_file);
    return _file;
}
function readTextFromFileSync(_file) {
    return fs.readFileSync(_file, "utf8");
}
function readTextFromFile(_file) {
    return new Promise(function (resolve, reject) {
        fs.readFile(_file, "utf8", (err, data) => {
            if (err) {
                reject(err + "Could not read the file: " + path.resolve(_file));
            }
            resolve(data);
        });
    });
}
function writeTextToFile(_file, _text) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(_file, _text, (err) => {
            if (err) {
                reject(err + " Could not write to file: " + path.resolve(_file));
            }
            resolve(_file);
        });
    });
}
function writeTextToFileSync(_file, _text) {
    try {
        fs.writeFileSync(_file, _text);
        return _file;
    }
    catch (err) {
        throw new Error(err + " Could not write to file: " + path.resolve(_file));
    }
}
function createDirectorySync(directory) {
    try {
        mkdirSyncRecursive(directory);
        return true;
    }
    catch (e) {
        return false;
    }
}
function mkdirSyncRecursive(directory) {
    let pathParts = directory.split(path.sep);
    for (var i = 1; i <= pathParts.length; i++) {
        var segment = pathParts.slice(0, i).join(path.sep);
        if (segment.length > 0) {
            !fs.existsSync(segment) ? fs.mkdirSync(segment) : null;
        }
    }
}
function deleteDirectory(dir) {
    return new Promise(function (resolve, reject) {
        fs.access(dir, function (err) {
            if (err) {
                return reject(err);
            }
            fs.readdir(dir, function (err, files) {
                if (err) {
                    return reject(err);
                }
                Promise.all(files.map(function (file) {
                    return deleteFile(path.join(dir, file));
                })).then(function () {
                    fs.rmdir(dir, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                }).catch(reject);
            });
        });
    });
}
function deleteDirectorySync(dir) {
    fs.accessSync(dir);
    let files = fs.readdirSync(dir);
    files.map(function (file) {
        return deleteFileSync(path.join(dir, file));
    });
    fs.rmdirSync(dir);
}
function deleteFile(filePath) {
    return new Promise(function (resolve, reject) {
        fs.lstat(filePath, function (err, stats) {
            if (err) {
                return reject(err);
            }
            if (stats.isDirectory()) {
                resolve(deleteDirectory(filePath));
            }
            else {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
        });
    });
}
function deleteFileSync(filePath) {
    let stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
        deleteDirectorySync(filePath);
    }
    else {
        fs.unlinkSync(filePath);
    }
}
function renameFile(fileOld, fileNew) {
    return new Promise(function (resolve, reject) {
        fs.rename(fileOld, fileNew, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}
function renameFileSync(fileOld, fileNew) {
    fs.renameSync(fileOld, fileNew);
}
function copyFile(filePath, destPath) {
    return new Promise(function (resolve, reject) {
        fs.copyFile(filePath, destPath, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}
function copyFileSync(filePath, destPath) {
    fs.copyFileSync(filePath, destPath);
}
function copyDirectory(from, to) {
    fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        }
        else {
            copyDirectory(path.join(from, element), path.join(to, element));
        }
    });
}
