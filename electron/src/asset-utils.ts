/* eslint-disable import/no-extraneous-dependencies */
import { app } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import url from 'url';

export function constructAssetPath(assetPath: string, useFileProtocol: boolean) {
	const pathname = path.join(app.getAppPath(), assetPath);
	if (!useFileProtocol) {
		return pathname;
	}
	return url.format({
		pathname,
		protocol: 'file:',
		slashes: true,
	});
}

export function getAssetPath(assetPath: string) {
	return constructAssetPath(isDev ? `static/images/${assetPath}` : `build/${assetPath}`, false);
}
