var interpolate = require('interpolate');

var ActionBuilder = require('./action-builder');
var TinkrClient = require('../tinkr-client');


exports.command = 'projects';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.getProjects(function (projects) {
            console.log(interpolate('[{name}]', client.remote));
            console.log('Projects: ');
            projects.forEach(function (project) {
                console.log('-- ' + project.name);
            });

            next();
        });
    })
    .build();
