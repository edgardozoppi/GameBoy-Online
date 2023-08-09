var mainCanvas = null;
var screenWakeLock = null;
var cout = console.log.bind(console);

function startGame(blob) {
  var binaryHandle = new FileReader();
  binaryHandle.onload = function() {
    if (this.readyState === 2) {
      try {
        start(mainCanvas, this.result);
      } catch (e) {
        alert(e.message);
      }
    }
  };
  binaryHandle.readAsBinaryString(blob);
}

function loadViaXHR(romPath) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", romPath);
  xhr.responseType = "blob";
  xhr.onload = () => {
    startGame(new Blob([this.response], { type: "application/octet-stream" }));
  };
  xhr.send();
}

function removeExtension(name) {
  const i = name.lastIndexOf(".");
  return name.substring(0, i);
}

function keepScreenAwake() {
  if (!navigator.wakeLock) return;
  
  if (screenWakeLock) {
    screenWakeLock.release();
  } else {
    navigator.wakeLock.request("screen").then(lock => {
      screenWakeLock = lock;
      // cout("wake lock acquired");

      screenWakeLock.addEventListener("release", () => {
        screenWakeLock = null;
        // cout("wake lock released");
      });

    }).catch(err => cout(err));
  }
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    keepScreenAwake();
  }
});

function onLoad() {
  mainCanvas = document.getElementById("main_canvas");
  const gameName = document.getElementById("game_name");
  const fileInput = document.getElementById("file_input");
  const openButton = document.getElementById("controller_open");

  window.onunload = autoSave;
  openButton.onclick = () => fileInput.click();
  fileInput.onchange = () => {
    const file = fileInput.files[0];
    gameName.innerText = removeExtension(file.name);
    // loadViaXHR(`rom/${file.name}`);
    startGame(file);
    keepScreenAwake();
  };

  // Open ROM passed as parameter if any
  if (window.launchQueue) {
    launchQueue.setConsumer(params => {    
      if (params && params.files && params.files.length > 0) {
        const file = params.files[0];
        gameName.innerText = removeExtension(file.name);
        startGame(file);
        keepScreenAwake();
      }
    });
  }
}

//Wrapper for localStorage getItem, so that data can be retrieved in various types.
function findValue(key) {
  try {
    if (window.localStorage.getItem(key) != null) {
      return JSON.parse(window.localStorage.getItem(key));
    }
  } catch (error) {
    //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
    if (window.globalStorage[location.hostname].getItem(key) != null) {
      return JSON.parse(window.globalStorage[location.hostname].getItem(key));
    }
  }
  return null;
}
//Wrapper for localStorage setItem, so that data can be set in various types.
function setValue(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
    window.globalStorage[location.hostname].setItem(key, JSON.stringify(value));
  }
}
//Wrapper for localStorage removeItem, so that data can be set in various types.
function deleteValue(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    //An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
    window.globalStorage[location.hostname].removeItem(key);
  }
}

window.addEventListener("DOMContentLoaded", onLoad);
