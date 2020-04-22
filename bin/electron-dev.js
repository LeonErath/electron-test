/* eslint-disable */

const waitOn = require('wait-on');
const { spawn, exec } = require('child_process');
const { platform } = require('process');

(async () => {
	console.log('Waiting on', process.env.ELECTRON_URL);
	await waitOn({
		strictSSL: false,
		resources: [process.env.ELECTRON_URL],
	});
	if (platform === 'win32') {
		exec('electron .');
	} else {
		spawn('electron', ['.'], { stdio: 'inherit' });
	}
})();
