// eslint-disable-next-line @typescript-eslint/no-var-requires
const Notarizer = require('electron-notarize');

exports.default = async () => {
	if (process.platform !== 'darwin') {
		console.log('\n\n  → platform is not darwin, ignoring notarization\n\n');
	}

	// const { APPLE_DEV_USER, APPLE_DEV_PASSWORD } = process.env;

	// if (!APPLE_DEV_USER || !APPLE_DEV_PASSWORD) {
	// 	throw new Error(
	// 		'\n\n    Cannot notarize mac app. Please provide APPLE_DEV_USER and APPLE_DEV_PASSWORD in environment.\n\n'
	// 	);
	// }

	// console.log('\n  → notarizing mac app...\n');

	// await Notarizer.notarize({
	// 	appBundleId: 'com.clinq.desktop',
	// 	appPath: './dist/mac/CLINQ.app',
	// 	appleId: APPLE_DEV_USER,
	// 	appleIdPassword: APPLE_DEV_PASSWORD,
	// });
};
