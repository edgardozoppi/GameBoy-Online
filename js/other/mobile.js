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

function loadSavedGame(key, blob) {
  var textHandle = new FileReader();
  textHandle.onload = function() {
    if (this.readyState === 2) {
      try {
        setValue(key, this.result);
      } catch (e) {
        alert(e.message);
      }
    }
  };
  textHandle.readAsText(blob);
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

function refreshSavedGames(parent) {
  const keys = listValues();
  const items = keys.map(k => {
    const name = k.substring("B64_SRAM_".length);
    const value = findValue(k);

    const div = document.createElement("div");
    div.className = "saved_game";

    const span = document.createElement("span");
    span.textContent = name;
    div.appendChild(span);
    
    const link = document.createElement('a');
    link.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(value)}`);
    link.setAttribute("download", `${name}.sav`);
    div.appendChild(link);

    let img = document.createElement("img");
    img.src = "images/download.svg";
    img.alt = "Download";
    link.appendChild(img);

    img = document.createElement("img");
    img.src = "images/delete.svg";
    img.alt = "Delete";
    img.onclick = () => {
      deleteValue(k);
      setTimeout(() => refreshSavedGames(parent), 1);
    };
    div.appendChild(img);

    return div;
  });
  parent.replaceChildren(...items);
}

function onLoad() {
  mainCanvas = document.getElementById("main_canvas");
  const gameName = document.getElementById("game_name");
  const openInput = document.getElementById("open_input");
  const loadInput = document.getElementById("load_input");
  const openButton = document.getElementById("controller_open");
  const openDialog = document.getElementById("open_dialog");
  const closeDialog = document.getElementById("close_dialog");
  const openNew = document.getElementById("open_new");
  const openSaved = document.getElementById("open_saved");
  const recentGames = document.getElementById("recent_games");
  
  window.onunload = autoSave;
  openButton.onclick = () => {
    if (!isPaused()) {
      keyDown("pause");
    }
    
    refreshSavedGames(recentGames);
    openDialog.showModal();
  };

  const onCloseDialog = () => {
    openDialog.close();
    keyDown("pause");
  };

  closeDialog.onclick = onCloseDialog;

  openNew.onclick = () => openInput.click();
  openSaved.onclick = () => loadInput.click();

  openInput.onchange = async () => {
    if (openInput.files && openInput.files.length > 0) {
      const file = openInput.files[0];
      openInput.value = "";

      if (file) {
        gameName.innerText = removeExtension(file.name);
        // loadViaXHR(`rom/${file.name}`);
        startGame(file);
        keepScreenAwake();
      }

      onCloseDialog();
    }
  };

  loadInput.onchange = async () => {
    if (loadInput.files && loadInput.files.length > 0) {
      const file = loadInput.files[0];
      loadInput.value = "";

      if (file) {
        loadSavedGame(`B64_SRAM_${removeExtension(file.name)}`, file);
        setTimeout(() => refreshSavedGames(recentGames), 1);
      }
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
