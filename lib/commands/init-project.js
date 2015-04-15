var interpolate = require('interpolate');

var project = require('../project');
var ActionBuilder = require('./action-builder');


exports.command = 'init [projectDir]';

exports.action = new ActionBuilder()
    .resolveProjectDir()
    .use(function (context, next) {
        project.init(context.projectPath, {
            stub: context.program.stub,
            domain: context.program.hostname,
            proxy: context.program.proxy
        }, function (err, settingsFilePath) {
            if (err) {
                console.log(interpolate('could not create {0}', [settingsFilePath]));
                return next(err);
            }

            console.log('created: ' + settingsFilePath);
            next();
        });
    })
    .build();