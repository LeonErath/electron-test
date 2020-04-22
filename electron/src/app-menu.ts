// eslint-disable-next-line import/no-extraneous-dependencies
import { MenuItemConstructorOptions, BrowserWindow, Menu } from "electron";
import { platform } from "process";

export function createAppMenu(
  win: BrowserWindow,
  handlers: { about: () => void; help: () => void; logout: () => void }
) {
  const template: MenuItemConstructorOptions[] = [
    {
      label: "testApp",
      submenu: [
        { label: "Über", role: "about", click: handlers.about },
        { type: "separator" },
        { label: "Hilfe", role: "help", click: handlers.help },
        { label: "Logout", click: handlers.logout },
        { label: "Beenden", accelerator: "Command+Q", role: "quit" },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);

  if (platform === "darwin") {
    Menu.setApplicationMenu(menu);
  } else {
    win.setMenu(menu);
  }
}
