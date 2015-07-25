var interpolate = require('interpolate');
var fmt = require('fmt');

var ActionBuilder = require('./action-builder');
var TinkrClient = require('../tinkr-client');


exports.command = 'projects';

exports.action = new ActionBuilder()
    .loadLocalConfiguration(true)
    .mustHaveRemotes()
    .mustSpecifyRemote()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.getProjects(function (projects) {
            fmt.msg('');
            fmt.title(client.remote.toString('long'));
            if (projects.length <= 0) {
                fmt.li('None');
            } else {
                projects.forEach(function (project) {
                    fmt.li(project.name);
                });
            }

            next();
        });
    })
    .build();
