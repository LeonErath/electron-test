import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { platform } from 'process';

let aboutWin: BrowserWindow | null = null;

export function createAboutWindow() {
	if (aboutWin) {
		aboutWin.show();
		return;
	}

	const constructionOptions: BrowserWindowConstructorOptions = {
		width: 300,
		height: 400,
		resizable: false,
		maximizable: false,
		title: 'Sipgate Softphone',
		show: true,
		titleBarStyle: platform === 'darwin' ? 'hiddenInset' : 'default',
		frame: !(platform === 'win32' || platform === 'linux'),
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: false,
		},
	};

	aboutWin = new BrowserWindow(constructionOptions);

	aboutWin.on('closed', () => {
		aboutWin = null;
	});
}
