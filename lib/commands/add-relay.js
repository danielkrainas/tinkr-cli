var fmt = require('fmt');
var _ = require('lodash');

var ActionBuilder = require('./action-builder');
var TinkrClient = require('../tinkr-client');

var successMessage = _.template('[<%= remote.name %>] <%= project.name %> added.');


exports.command = 'addrelay [projectPath]';

exports.action = new ActionBuilder()
    .mustHaveRemotes()
    .loadProject()
    .forEachRemoteTargetClient(function (client, context, next) {
        client.pushRelay(context.project, function () {
            fmt.msg(successMessage({
                project: context.project,
                remote: client.remote
            }));

            next();
        });
    })
    .build();
