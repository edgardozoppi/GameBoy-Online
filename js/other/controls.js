const JS_KEY_UP = 38;
const JS_KEY_LEFT = 37;
const JS_KEY_RIGHT = 39;
const JS_KEY_DOWN = 40;
const JS_KEY_ENTER = 13;
const JS_KEY_ALT = 18;
const JS_KEY_CTRL = 17;
const JS_KEY_SHIFT = 16;
const JS_KEY_SPACE = 32;

const JS_KEY_W = 87;
const JS_KEY_A = 65;
const JS_KEY_S = 83;
const JS_KEY_D = 68;
const JS_KEY_J = 74;
const JS_KEY_K = 75;

const JS_KEY_Z = 90;
const JS_KEY_X = 88;

const DEADZONE = 0.1;

var dpad = document.getElementById("controller_dpad");

const buttons = {
  pause: document.getElementById("controller_pause"),
  start: document.getElementById("controller_start"),
  select: document.getElementById("controller_select"),
  a: document.getElementById("controller_a"),
  b: document.getElementById("controller_b"),
  left: document.getElementById("controller_left"),
  right: document.getElementById("controller_right"),
  up: document.getElementById("controller_up"),
  down: document.getElementById("controller_down")
};

const pressedButtons = {};

function keyDown(key) {
  if (pressedButtons[key] === undefined) {
    const btn = buttons[key];
    pressedButtons[key] = btn.className;
    btn.className += " btnPressed";
  } else if (key === "pause") {
    // Same as keyUp for toggle buttons like Pause
    const btn = buttons[key];
    btn.className = pressedButtons[key];
    pressedButtons[key] = undefined;
  }

  if (key === "pause") {
    pauseOrRun();
  } else {
    GameBoyKeyDown(key);
  }
}

function keyUp(key) {
  if (key === "pause") return;
  if (pressedButtons[key] !== undefined) {
    const btn = buttons[key];
    btn.className = pressedButtons[key];
    pressedButtons[key] = undefined;
  }

  GameBoyKeyUp(key);
}

function bindButton(el, code) {
  el.addEventListener("touchstart", function(e) {
    e.preventDefault();
    e.stopPropagation();
    keyDown(code);
  });

  el.addEventListener("touchend", function(e) {
    e.preventDefault();
    e.stopPropagation();
    keyUp(code);
  });
}

function bindDpad(el) {
  el.addEventListener("touchstart", function(e) {
    e.preventDefault();
    e.stopPropagation();
    var rect = e.currentTarget.getBoundingClientRect();
    var x = (2 * (e.targetTouches[0].clientX - rect.left)) / rect.width - 1;
    var y = (2 * (e.targetTouches[0].clientY - rect.top)) / rect.height - 1;
    move(x, y);
  });

  el.addEventListener("touchmove", function(e) {
    e.preventDefault();
    e.stopPropagation();
    var rect = e.currentTarget.getBoundingClientRect();
    var x = (2 * (e.targetTouches[0].clientX - rect.left)) / rect.width - 1;
    var y = (2 * (e.targetTouches[0].clientY - rect.top)) / rect.height - 1;
    move(x, y);
  });

  function move(x, y) {
    if (x < -DEADZONE || x > DEADZONE) {
      if (y > x && y < -x) {
        keyUp("right");
        keyDown("left");
      } else if (y > -x && y < x) {
        keyUp("left");
        keyDown("right");
      }

      if (y > -DEADZONE && y < DEADZONE) {
        keyUp("up");
        keyUp("down");
      }
    }

    if (y < -DEADZONE || y > DEADZONE) {
      if (x > y && x < -y) {
        keyUp("down");
        keyDown("up");
      } else if (x > -y && x < y) {
        keyUp("up");
        keyDown("down");
      }

      if (x > -DEADZONE && x < DEADZONE) {
        keyUp("left");
        keyUp("right");
      }
    }
  }

  el.addEventListener("touchend", function(e) {
    e.preventDefault();
    e.stopPropagation();
    keyUp("left");
    keyUp("right");
    keyUp("up");
    keyUp("down");
  });
}

function bindKeyboard() {
  window.onkeydown = function(e) {
    if (
      e.keyCode !== JS_KEY_CTRL &&
      e.keyCode !== JS_KEY_ALT &&
      e.keyCode !== JS_KEY_SHIFT &&
      (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
    ) {
      return;
    }
    if (e.keyCode === JS_KEY_SPACE) {
      keyDown("pause");
    } else if (e.keyCode === JS_KEY_LEFT || e.keyCode === JS_KEY_A) {
      keyDown("left");
    } else if (e.keyCode === JS_KEY_RIGHT || e.keyCode === JS_KEY_D) {
      keyDown("right");
    } else if (e.keyCode === JS_KEY_UP || e.keyCode === JS_KEY_W) {
      keyDown("up");
    } else if (e.keyCode === JS_KEY_DOWN || e.keyCode === JS_KEY_S) {
      keyDown("down");
    } else if (e.keyCode === JS_KEY_ENTER) {
      keyDown("start");
    } else if (
      e.keyCode === JS_KEY_ALT ||
      e.keyCode === JS_KEY_X ||
      e.keyCode === JS_KEY_K
    ) {
      keyDown("a");
    } else if (
      e.keyCode === JS_KEY_CTRL ||
      e.keyCode === JS_KEY_Z ||
      e.keyCode === JS_KEY_J
    ) {
      keyDown("b");
    } else if (e.keyCode === JS_KEY_SHIFT) {
      keyDown("select");
    }
    e.preventDefault();
  };

  window.onkeyup = function(e) {
    if (e.key === "Dead") {
      // Ipad keyboard fix :-/
      // Doesn't register which key was released, so release all of them
      ["right", "left", "up", "down", "a", "b", "select", "start", "pause"].forEach(keyUp);
    }
    else if (e.keyCode === JS_KEY_SPACE) {
      keyUp("pause");
    } else if (e.keyCode === JS_KEY_LEFT || e.keyCode === JS_KEY_A) {
      keyUp("left");
    } else if (e.keyCode === JS_KEY_RIGHT || e.keyCode === JS_KEY_D) {
      keyUp("right");
    } else if (e.keyCode === JS_KEY_UP || e.keyCode === JS_KEY_W) {
      keyUp("up");
    } else if (e.keyCode === JS_KEY_DOWN || e.keyCode === JS_KEY_S) {
      keyUp("down");
    } else if (e.keyCode === JS_KEY_ENTER) {
      keyUp("start");
    } else if (
      e.keyCode === JS_KEY_ALT ||
      e.keyCode === JS_KEY_X ||
      e.keyCode === JS_KEY_K
    ) {
      keyUp("a");
    } else if (
      e.keyCode === JS_KEY_CTRL ||
      e.keyCode === JS_KEY_Z ||
      e.keyCode === JS_KEY_J
    ) {
      keyUp("b");
    } else if (e.keyCode === JS_KEY_SHIFT) {
      keyUp("select");
    }
    e.preventDefault();
  };
}
bindButton(buttons.pause, "pause");
bindButton(buttons.start, "start");
bindButton(buttons.select, "select");
bindButton(buttons.a, "a");
bindButton(buttons.b, "b");
bindDpad(dpad);
bindKeyboard();
