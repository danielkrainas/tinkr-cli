var helpers = require('./helpers');
var project = require('../project');

exports.command = 'snapshot [projectDir]';

exports.action = helpers.resolveProjectDir(
    helpers.loadProjectSettings(function (projectDir, settings) {
        project.snapshot(projectDir, settings, function (err, snapshotPath) {
            if (err) {
                console.error('could not create snapshot.');
                return console.error(err);
            }

            console.log('snapshot created: ' + snapshotPath);
        });
    })
);
