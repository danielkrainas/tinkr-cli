var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
var homePath = process.env.TINKR_HOME || path.resolve(path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.\\.tinkr'));

module.exports = {
    pkg: require(path.join(rootPath, 'package.json')),

    root: rootPath,

    home: homePath,

    extraConfig: process.env.TINKR_CONFIG || null,

    localConfig: 'config.json',

    remotesFile: 'remotes.json'
};
