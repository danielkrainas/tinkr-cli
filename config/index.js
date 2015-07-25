process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var _ = require('lodash');
var path = require('path');
var fs = require('fs');

var ensureLocalConfig = function (path) {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '{}');
    }
};

var ensureHomeExists = function (path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};

var config = module.exports = _.merge(
    require(__dirname + '/env/all'),
    require(__dirname + '/env/' + process.env.NODE_ENV) || {}
);

if (config.extraConfig) {
    config = module.exports = _.merge(config, require(config.extraConfig) || {});
} else {
    ensureHomeExists(config.home);
    var localConfigPath = path.join(config.home, config.localConfig);
    ensureLocalConfig(localConfigPath);
    config = module.exports = _.merge(config, require(localConfigPath) || {});
}