var args = require('yargs').argv;
var http = require('https');
var fs = require('fs');
var request = require('request');
var unzip = require('unzip');

var host = args.host;
var projectId = args.project;
var user = args.user;
var apikey = args.apikey;
var manual = args.manual || true;
var url = "/rest/cucumber/1.0/project/" + projectId + "/features?manual=" + manual;
var out = "../output/jira_" + projectId + "_features.zip";

module.exports = function() {
	switch(undefined) {
		case projectId:
			console.log("Project undefined: use --project");
			break;
		case user:
			console.log("User undefined: use --user");
			break;
		case apikey:
			console.log("API key undefined: use --apikey")
			break;
		case host:
			host = "https://behave.pro";
			console.log("Using default host " + host);
			break;
	}

request({
	url: host + url,
	headers: {
		Authorization: "Basic " + new Buffer(user + ":" + apikey).toString("base64"),
	},
	encoding: null
}, function(err, resp, body) {
	console.log("Downloading features from JIRA project " + projectId);
	if (err) throw err;
		fs.writeFile(out, body, function(err) {
			if (err) throw err;
			console.log("Features downloaded, extracting...");

			fs.createReadStream(out).pipe(
				unzip.Extract({
					path: out.split(".zip")[0]
				})
			);
			console.log("Saved to " + out.substring(2).split(".zip")[0] + "/")
		});
	});
}