/* jshint esversion: 6 */

// NOTE: all durations are expressed using notation understood by the
// `ms` NPM module. These durations must be converted before they are used.

var logger = require('./logging');

const DEVELOPMENT_IDENTIFIER = 'development';
const PRODUCTION_IDENTIFIER = 'production';

var environment = process.env.NODE_ENV;
var secret = process.env.HACKILLINOIS_SECRET;
var superuserEmail = process.env.HACKILLINOIS_SUPERUSER_EMAIL;
var superuserPassword = process.env.HACKILLINOIS_SUPERUSER_PASSWORD;
var mailApiKey = process.env.HACKILLINOIS_MAIL_KEY;
var isDevelopment = environment === DEVELOPMENT_IDENTIFIER;
var isProduction = environment === PRODUCTION_IDENTIFIER;

var envShortName;
if (isProduction) {
    envShortName = "prod";
} else {
    envShortName = "dev";
}

if (!isProduction && !isDevelopment) {
	logger.error("an environment was not provided");
	logger.error("set NODE_ENV to '%s' or '%s'",
		DEVELOPMENT_IDENTIFIER, PRODUCTION_IDENTIFIER);

	process.exit(1);
}

if (!secret) {
	logger.error(`set ENV variable HACKILLINOIS_SECRET to a secure, random string in config/${envShortName}.config`);
	process.exit(1);
}

if ((isProduction && superuserEmail === 'admin@example.com') || !superuserEmail) {
	logger.error(`set ENV variable HACKILLINOIS_SUPERUSER_EMAIL to the desired admin email in config/${envShortName}.config`);
	process.exit(1);
}

if ((isProduction && superuserPassword === 'ABCD1234!') || !superuserPassword) {
	logger.error(`set ENV variable HACKILLINOIS_SUPERUSER_PASSWORD to a secure, random string in config/${envShortName}.config`);
	process.exit(1);
}

if (!mailApiKey) {
	if (isProduction) {
		logger.error(`set ENV variable HACKILLINOIS_MAIL_KEY to the mailing provider's API key in config/${envShortName}.config`);
		process.exit(1);
	}

	mailApiKey = undefined;
}

var config = {};
config.auth = {};
config.database = {};
config.database.primary = { pool: {} };
config.mail = {};
config.storage = {};
config.superuser = {};
config.token = { expiration: {} };

config.isDevelopment = isDevelopment;
config.secret = secret;
config.port = process.env.HACKILLINOIS_PORT || 8080;
config.profile = 'hackillinois-api';

config.superuser.email = superuserEmail;
config.superuser.password = superuserPassword;

config.auth.secret = config.secret;
config.auth.header = 'Authorization';
config.auth.expiration = '7d';

config.token.expiration.DEFAULT = '7d';
config.token.expiration.AUTH = config.token.expiration.DEFAULT;

config.database.primary.host = process.env.DB_HOSTNAME || '127.0.0.1';
config.database.primary.port = process.env.DB_PORT || 3306;
config.database.primary.user = process.env.DB_USERNAME || 'root';
config.database.primary.password = process.env.DB_PASSWORD || '';
config.database.primary.name = process.env.DB_NAME || 'hackillinois-2017';
config.database.primary.pool.min = 0;
config.database.primary.pool.max = 7500;
config.database.primary.pool.idleTimeout = '5s';

config.mail.key = mailApiKey;
config.mail.sinkhole = '.sink.sparkpostmail.com';
config.mail.whitelistedDomains = ['@hackillinois.org'];
config.mail.whitelistedLists = ['test'];

config.storage.bucketExtension = (isDevelopment) ? '-development' : '-2017';

logger.info("prepared environment for %s", environment);

module.exports = config;
