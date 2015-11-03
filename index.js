var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')
var binPath = phantomjs.path

var childArgs = [
	path.join(__dirname, 'phantomjs-script.js'),
	'http://dev.fourtwo.com.br:88/board/report_view.php?idreport=253&sld=27360',
	'teste.png'
	,'--debug'
]

var ls = childProcess.execFile(binPath, childArgs, function (err, stdout, stderr) {
	if (err) console.error('Error:', err);
});

if (childArgs[3] === '--debug') {
	ls.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});

	ls.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	ls.on('exit', function (code) {
		console.log('child process exited with code ' + code);
	});
}