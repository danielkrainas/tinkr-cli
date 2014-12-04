var interpolate = require('interpolate');

var remoteList = require('../remote-list');


exports.command = 'remotes';

exports.action = function () {
    console.log('[remotes]');
    remoteList.forEach(function (remote) {
        console.log(interpolate('{name} -- {host}', remote));
    });
};
