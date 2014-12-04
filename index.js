var _ = require('lodash');
var program = require('commander');
var fs = require('fs');
var interpolate = require('interpolate');

var pkg = require('./package.json');
var remoteList = require('./lib/remote-list');


var addRemote = function (name, remotes) {
    var remote = remoteList.getByName(name);
    if (!remote) {
        console.log(interpolate('{0} is not a valid remote', [name]));
    } else {
        remotes.push(remote);
    }
    
    return remotes;
};

program
    .version(pkg.version)
    .option('-r, --remote [name]', 'Specify a remote to target.', addRemote, [])
    .option('-A, --all-remotes', 'Specifies all remotes as targets.')
    .option('-h, --host <hostname>', 'Hostname setting')
    .option('--stub', 'Marks the operation as stub-only.')
    .option('--proxy <proxy>', 'Proxy target address');

var commands_path = __dirname + '/lib/commands';
var walk = function (path) {
    fs.readdirSync(path).forEach(function (file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile() && file !== 'helpers.js' && /(.*).(js$)/.test(file)) {
            var cmd = require(newPath);
            program
                .command(cmd.command)
                .action(cmd.action);
        }
    });
};
walk(commands_path);

remoteList.load(function () {
    console.log();
    program.parse(process.argv);
});
