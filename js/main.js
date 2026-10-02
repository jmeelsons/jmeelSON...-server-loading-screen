"use strict";

var isGmod = false;
var isTest = false;
var totalFiles = 50;
var totalCalled = false;
var downloadingFileCalled = false;
var percentage = 0;

/**
 * Gmod Called functions
 */
function GameDetails(
  servername,
  serverurl,
  mapname,
  maxplayers,
  steamid,
  gamemode
) {
  debug("GameDetails called");
  isGmod = true;
  if (!isTest) {
    loadAll();
  }

  setProgress(0, "wait...");
}

function SetFilesTotal(total) {
  debug("SetFilesTotal called total: " + total);
  totalCalled = true;
  totalFiles = total;
}

function SetFilesNeeded(needed) {
  debug("SetFilesNeeded called needed: " + needed);
  if (totalCalled && totalFiles > 0) {
    var sPercentage = 100 - Math.round((needed / totalFiles) * 100);
    percentage = sPercentage;
    setProgress(sPercentage);
  }
}

function DownloadingFile(filename) {
  filename = filename.replace("'", "").replace("?", "");
  debug("DownloadingFile called '" + filename + "'");
  downloadingFileCalled = true;

  setProgress(null, filename);
}

var allow_increment = true;
function SetStatusChanged(status) {
  debug("SetStatusChanged called '" + status + "'");

  if (status === "Workshop Complete") {
    allow_increment = false;
    setProgress(80, "workshop complete");
  } else if (status === "Client info sent!") {
    allow_increment = false;
    setProgress(95, "client info sent");
  } else if (status === "Starting Lua...") {
    setProgress(100, "starting lua...");
  } else {
    if (allow_increment) {
      percentage = percentage + 0.1;
      setProgress(percentage);
    }
    setProgress(null, status);
  }
}

/**
 * External Functions
 */
function loadAll() {
  // nothing to fade, layout always visible
}

function loadBackground() {
  // background image disabled in this layout
}

/**
 * Прогресс-бар
 * @param {number|null} value  процент 0-100 (null — не менять)
 * @param {string} [label]     подпись (имя файла / статус)
 */
function setProgress(value, label) {
  var $fill = document.getElementById("progressFill");
  var $percent = document.getElementById("progressPercent");
  var $file = document.getElementById("progressFile");

  if (!$fill || !$percent || !$file) return;

  if (typeof value === "number" && !isNaN(value)) {
    var v = Math.max(0, Math.min(100, value));
    percentage = v;
    $fill.style.width = v + "%";
    $percent.textContent = Math.round(v) + "%";
  }

  if (typeof label === "string" && label.length) {
    $file.textContent = label;
  }
}

function setLoad(percentage) {
  setProgress(percentage);
}

var permanent = false;
function announce(message, ispermanent) {
  // announcements disabled in this layout
  if (ispermanent) {
    permanent = true;
  }
}

function debug(message) {
  if (typeof Config !== "undefined" && Config.enableDebug) {
    console.log(message);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  setProgress(0, "wait...");

  setTimeout(function() {
    if (!isGmod) {
      debug("No Garry's mod testing..");
      isTest = true;

      GameDetails(
        "Servername",
        "Serverurl",
        "Mapname",
        "Maxplayers",
        "SteamID",
        "Gamemode"
      );

      var totalTestFiles = 100;
      SetFilesTotal(totalTestFiles);

      var needed = totalTestFiles;
      setInterval(function() {
        if (needed > 0) {
          needed = needed - 1;
          SetFilesNeeded(needed);
          DownloadingFile("Filename " + needed);
        }
      }, 500);

      SetStatusChanged("Testing..");
    }
  }, 1000);
});
