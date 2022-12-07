import { app, BrowserWindow } from 'electron';
import { join } from 'path';

const indexHtml = join(__dirname, '../../dist/index.html');
const preload = join(__dirname, '../preload/index.js');

function createWindow() {
	const window = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload,
		},
	});

	// If electron is started by Vite dev server, load dev server url to electron
	if (process.env.VITE_DEV_SERVER_URL) {
		window.loadURL(process.env.VITE_DEV_SERVER_URL);
		// Open devTool if the app is not packaged
		window.webContents.openDevTools();
	} else {
		window.loadFile(indexHtml);
	}
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});