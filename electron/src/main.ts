/* eslint-disable import/no-extraneous-dependencies,no-console */
import {
  app,
  BrowserWindow,
  session,
  systemPreferences,
  ipcMain,
  shell,
} from "electron";
import { platform } from "process";
import isDev from "electron-is-dev";
import { constructAssetPath } from "./asset-utils";
import { createAppMenu } from "./app-menu";
import { createAboutWindow } from "./about-window";

let win: BrowserWindow | null = null;

app.setAsDefaultProtocolClient("tel");
app.setAsDefaultProtocolClient("softphone");

app.setAboutPanelOptions({
  applicationName: "Sipgate Softphone",
  applicationVersion: "0.0.1",
  copyright: "erath GmbH",
  version: "",
  credits: "These are some lame credits", // only macOs, Windows
  iconPath: "", //only linux, Windows todo
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    process.env.ELECTRON_URL || constructAssetPath("dist/index.html", true)
  );

  function parseUri(uri: string) {
    const [protocol, commandPath] = uri.split(":");
    const normalizedPath = commandPath.startsWith("//")
      ? commandPath.replace("//", "")
      : commandPath;
    const path = normalizedPath.split(/\/|#/g);

    return { protocol, path };
  }

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  app.on("open-url", (event, url) => {
    const {
      protocol,
      path: [command, action, args],
    } = parseUri(url);

    if (protocol === "softphone") {
      if (command === "login") {
        const code = new URLSearchParams(args).get("code");
        if (action === "authenticate" && code) {
          if (mainWindow) {
            mainWindow.webContents.send("code", code);
          }
        }
      }
      if (command === "logout") {
        if (mainWindow) {
          mainWindow.webContents.send("logout");
        }
      }
    }
  });

  return mainWindow;
}

async function askForMediaAccess(): Promise<boolean> {
  try {
    if (platform !== "darwin") {
      return true;
    }

    const status = await systemPreferences.getMediaAccessStatus("microphone");
    console.info("Current microphone access status:", status);

    if (status === "not-determined") {
      const success = await systemPreferences.askForMediaAccess("microphone");
      console.log(
        "Result of microphone access:",
        success.valueOf() ? "granted" : "denied"
      );
      return success.valueOf();
    }

    return status === "granted";
  } catch (error) {
    console.error("Could not get microphone permission:", error.message);
  }
  return false;
}

app.on(
  "certificate-error",
  (event, webContents, accessUrl, error, certificate, callback) => {
    if (isDev) {
      event.preventDefault();
      callback(true);
      return;
    }
    callback(false);
  }
);

app.on("web-contents-created", (event, contents) => {
  const handleRedirect = (e: Event, url: string) => {
    e.preventDefault();
    shell.openExternal(url);
  };

  contents.on("will-navigate", (navigationEvent, navigationUrl) => {
    console.log("will navigate");
    handleRedirect(navigationEvent, navigationUrl);
  });

  contents.on("new-window", (navigationEvent, navigationUrl) => {
    console.log("new window");
    handleRedirect(navigationEvent, navigationUrl);
  });
});

app.on("ready", () => {
  win = createWindow();

  //todo clickhandler rausziehen
  const about = () => {
    createAboutWindow();
  };

  const help = () => {
    shell.openExternal(
      "https://teamhelp.sipgate.de/hc/de/articles/360006738717-sipgate-Webphone-Beta"
    );
  };

  const logout = () => {
    if (win) win.webContents.send("initiateLogoutFromContextMenu");
  };

  createAppMenu(win, { about, help, logout });

  win.on("close", () => {});

  win.on("closed", () => {
    win = null;
  });

  if (session.defaultSession) {
    console.info("Setting permission handler for default session");
    session.defaultSession.setPermissionRequestHandler(
      async (webContents, permission, callback) => {
        console.info(`App is requesting permission "${permission}"`);

        if (permission === "notifications") {
          callback(true);
          return;
        }

        if (permission === "media") {
          console.info(`Requesting OS media access...`);
          const success = await askForMediaAccess();
          callback(success);
          return;
        }

        callback(false);
      }
    );
  }
});

ipcMain.on("logout", () => {
  app.relaunch();
  app.exit();
});

ipcMain.on("window:main", (event, action: string) => {
  if (!win) {
    return;
  }
  switch (action) {
    case "close":
      win.close();
      break;
    case "show":
      win.show();
      break;
    case "maximize":
      win.maximize();
      break;
    case "minimize":
      win.minimize();
      break;
    case "unmaximize":
      win.unmaximize();
      break;
  }
});

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
