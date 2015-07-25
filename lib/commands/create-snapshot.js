var ActionBuilder = require('./action-builder');
var project = require('../project');

exports.command = 'snapshot [projectDir]';

exports.action = new ActionBuilder()
    .loadProject()
    .takeProjectSnapshot()
    .build();
