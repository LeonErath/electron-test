!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=3)}([function(e,t){e.exports=require("electron")},function(e,t){e.exports=require("process")},function(e,t,n){"use strict";const o=n(0);if("string"==typeof o)throw new TypeError("Not running in an Electron environment!");const r=o.app||o.remote.app,i="ELECTRON_IS_DEV"in process.env,s=1===parseInt(process.env.ELECTRON_IS_DEV,10);e.exports=i?s:!r.isPackaged},function(e,t,n){"use strict";var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=n(0),i=n(1),s=o(n(2)),a=n(4),l=n(7),c=n(8);let u=null;function p(){const e=new r.BrowserWindow({width:400,height:700,webPreferences:{nodeIntegration:!0}});return e.loadURL(process.env.ELECTRON_URL||a.constructAssetPath("build/index.html",!0)),s.default&&e.webContents.openDevTools(),r.app.on("open-url",(t,n)=>{const{protocol:o,path:[r,i,s]}=function(e){const[t,n]=e.split(":");return{protocol:t,path:(n.startsWith("//")?n.replace("//",""):n).split(/\/|#/g)}}(n);if("test"===o){if("login"===r){const t=new URLSearchParams(s).get("code");"authenticate"===i&&t&&e&&e.webContents.send("code",t)}"logout"===r&&e&&e.webContents.send("logout")}}),e}r.app.setAsDefaultProtocolClient("tel"),r.app.setAsDefaultProtocolClient("softphone"),r.app.setAboutPanelOptions({applicationName:"Test App",applicationVersion:"0.0.1",copyright:"erath GmbH",version:"",credits:"These are some lame credits",website:"http://google.de",iconPath:""}),r.app.on("certificate-error",(e,t,n,o,r,i)=>{if(s.default)return e.preventDefault(),void i(!0);i(!1)}),r.app.on("web-contents-created",(e,t)=>{const n=(e,t)=>{e.preventDefault(),r.shell.openExternal(t)};t.on("will-navigate",(e,t)=>{console.log("will navigate"),n(e,t)}),t.on("new-window",(e,t)=>{console.log("new window"),n(e,t)})}),r.app.on("ready",()=>{u=p();l.createAppMenu(u,{about:()=>{c.createAboutWindow()},help:()=>{r.shell.openExternal("https://google.de")},logout:()=>{u&&u.webContents.send("initiateLogoutFromContextMenu")}}),u.on("close",()=>{}),u.on("closed",()=>{u=null}),r.session.defaultSession&&(console.info("Setting permission handler for default session"),r.session.defaultSession.setPermissionRequestHandler(async(e,t,n)=>{if(console.info(`App is requesting permission "${t}"`),"notifications"!==t){if("media"===t){return console.info("Requesting OS media access..."),void n(await async function(){try{if("darwin"!==i.platform)return!0;const e=await r.systemPreferences.getMediaAccessStatus("microphone");if(console.info("Current microphone access status:",e),"not-determined"===e){const e=await r.systemPreferences.askForMediaAccess("microphone");return console.log("Result of microphone access:",e.valueOf()?"granted":"denied"),e.valueOf()}return"granted"===e}catch(e){console.error("Could not get microphone permission:",e.message)}return!1}())}n(!1)}else n(!0)}))}),r.ipcMain.on("logout",()=>{r.app.relaunch(),r.app.exit()}),r.ipcMain.on("window:main",(e,t)=>{if(u)switch(t){case"close":u.close();break;case"show":u.show();break;case"maximize":u.maximize();break;case"minimize":u.minimize();break;case"unmaximize":u.unmaximize()}}),r.app.on("window-all-closed",()=>{r.app.quit()}),r.app.on("activate",()=>{null===u&&p()})},function(e,t,n){"use strict";var o=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=n(0),i=o(n(2)),s=o(n(5)),a=o(n(6));function l(e,t){const n=s.default.join(r.app.getAppPath(),e);return t?a.default.format({pathname:n,protocol:"file:",slashes:!0}):n}t.constructAssetPath=l,t.getAssetPath=function(e){return l(i.default?`static/images/${e}`:`build/${e}`,!1)}},function(e,t){e.exports=require("path")},function(e,t){e.exports=require("url")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(0),r=n(1);t.createAppMenu=function(e,t){const n=[{label:"testApp",submenu:[{label:"Über",role:"about",click:t.about},{type:"separator"},{label:"Hilfe",role:"help",click:t.help},{label:"Logout",click:t.logout},{label:"Beenden",accelerator:"Command+Q",role:"quit"}]}],i=o.Menu.buildFromTemplate(n);"darwin"===r.platform?o.Menu.setApplicationMenu(i):e.setMenu(i)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(0),r=n(1);let i=null;t.createAboutWindow=function(){if(i)return void i.show();const e={width:300,height:400,resizable:!1,maximizable:!1,title:"Test App",show:!0,titleBarStyle:"darwin"===r.platform?"hiddenInset":"default",frame:!("win32"===r.platform||"linux"===r.platform),webPreferences:{nodeIntegration:!0,enableRemoteModule:!1}};i=new o.BrowserWindow(e),i.on("closed",()=>{i=null})}}]);
//# sourceMappingURL=bundle.js.map