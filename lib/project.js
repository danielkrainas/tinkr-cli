var _ = require('lodash');
var fse = require('fs-extra');
var path = require('path');
var swig = require('swig');
var toml = require('toml');
var AdmZip = require('adm-zip');
var ignoreList = require('./ignore-list');

var SETTINGS_FILE = "tinkr.toml";
var DEFAULT_SETTINGS_PATH = path.resolve('./tinkr.default.toml');
var SNAPSHOTS_DIR = ".tinkr";

exports.readSettings = function (dir, callback) {
    fse.readFile(path.join(dir, SETTINGS_FILE), function (err, data) {
        if (err) {
            return callback(err, null);
        }

        var settings = toml.parse(data);
        callback(null, settings);
    });
};

exports.init = function (dir, defaults, callback) {
    var settingsPath = path.join(dir, SETTINGS_FILE);
    swig.renderFile(DEFAULT_SETTINGS_PATH, {
        name: defaults.name || path.basename(dir),
        version: defaults.version || '0.0.1',
        proxy: defaults.proxy || '', 
        domain: defaults.hostname || '',
        stub: defaults.stub || false
    }, function (err, rendered) {
        if (err) {
            return callback(err, settingsPath);
        }

        fse.writeFile(settingsPath, rendered, function (err) {
            callback(err, settingsPath);
        });
    });
};

exports.snapshot = function (dir, settings, callback) {
    var snapshotsPath = path.join(dir, SNAPSHOTS_DIR);
    var snapshotPath = path.join(snapshotsPath, (settings.name + '-' + settings.version + '.zip'));
    var zip = new AdmZip();
    ignoreList.getNativeOrGit(dir, function (err, ignoreFilter) {
        if (err) {
            return callback(err);
        }

        var walk = function (folder, dest) {
            fse.readdirSync(folder).forEach(function (file) {
                var newPath = folder + '/' + file;
                var zipPath = path.join(dest, file);
                var stat = fse.statSync(newPath);
                if (!ignoreFilter(zipPath)) {
                    return;
                } else if (stat.isFile()) {
                    zip.addLocalFile(newPath, dest);
                } else if (stat.isDirectory()) {
                    walk(newPath, zipPath);
                }
            });
        };

        walk(dir, '');

        zip.writeZip(snapshotPath);
        callback(null, snapshotPath);
    });
};
