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
  const openDialog = document.getElementById("open_dialog");
  const closeDialog = document.getElementById("close_dialog");
  const openNew = document.getElementById("open_new");
  
  window.onunload = autoSave;
  openButton.onclick = () => {
    if (!isPaused()) {
      keyDown("pause");
    }
    openDialog.showModal();
  };

  const onCloseDialog = () => {
    openDialog.close();
    keyDown("pause");
  };

  closeDialog.onclick = onCloseDialog;

  openNew.onclick = () => {
    fileInput.click();
  };

  fileInput.onchange = async () => {
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      fileInput.value = "";

    if (file) {
      gameName.innerText = removeExtension(file.name);
        // loadViaXHR(`rom/${file.name}`);
        startGame(file);
        keepScreenAwake();
    }
      onCloseDialog();
    }
  };

  // Open ROM passed as parameter if any
  if (window.launchQueue) {
    launchQueue.setConsumer(async params => {
      if (params && params.files && params.files.length > 0) {
        const fileHandle = params.files[0];
        const file = await fileHandle.getFile();
          file.handle = fileHandle;
          gameName.innerText = removeExtension(file.name);
          startGame(file);
          keepScreenAwake();
      }
    });
  }
}

window.addEventListener("DOMContentLoaded", onLoad);
