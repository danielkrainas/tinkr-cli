var interpolate = require('interpolate');

var project = require('../project');
var helpers = require('./helpers');


exports.command = 'init [projectDir]';

exports.action = helpers.resolveProjectDir(function (projectDir, program) {
    program = program.parent;
    project.init(projectDir, {
        stub: program.stub,
        domain: program.hostname,
        proxy: program.proxy
    }, function (err, settingsFilePath) {
        if (err) {
            console.log(interpolate('could not create {0}', [settingsFilePath]));
            return console.error(err);
        }

        console.log('created: ' + settingsFilePath);
    });
})