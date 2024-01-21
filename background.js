//reg event
var optionsDefault = {
  notification_skills: ["3"],
  notification_show: true,
  notification_priority: "0",
  notification_ignore_title: "([0-9]{7,100})",
  notification_ignore_content: "selenium\\nselenium",
  notification_ignore_uname: "allspam",
  notification_ignore_currency: "EUR|INR|AUD|HKD|SGD",
  notification_time_clear: "30000",
  notification_format: "<[budget]><[time]>[summary]",
  notification_truncate: "150",
  notification_sound_play: true,
  notification_sound_type: "1.wav",
  notification_sound_volume: "80",
  notification_startup: true,
  notification_welcome: true,
};

function waitForContentScript(tabId, payload) {
  console.log("startListen in background");
  return new Promise(function (resolve, reject) {
    chrome.tabs.sendMessage(tabId, payload, function (response) {
      if (response) {
        console.log("sdfsdf", response);
        resolve(response);
      } else {
        reject(new Error("No response received"));
      }
    });
  });
}

// Usage
var startListen = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    waitForContentScript(tabs[0].id, { action: "startListen" })
      .then(function (response) {
        console.log("Content script responded:", response.messsage);
      })
      .catch(function (error) {
        console.log("Error");
      });
  });
};

var windowOpen = function (url, mode) {
  chrome.windows.create({ url: url, type: mode }, function (createdWindow) {
    console.log("Window created:", createdWindow);
  });
};

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.get("options", function (data) {
    optionsObj = data["options"] || optionsDefault;
    if (optionsObj.notification_welcome) {
      windowOpen("/data/options/options.html", "normal");
    }
  });
});

chrome.notifications.onClicked.addListener(function (notificationId) {
  notifyClear(notificationId);
  window.focus();
  var url = "https://www.freelancer.com/projects/" + notificationId + ".html";
  windowOpen(url, "normal");
});

chrome.storage.local.get("options", function (data) {
  optionsObj = data["options"] || optionsDefault;
  if (optionsObj.notification_startup) {
    startListen();
  }
});

chrome.action.onClicked.addListener(function () {
  startListen();
});

function ShowCount(_count) {
  chrome.action.setBadgeText({ text: _count + "" });
  chrome.action.setTitle({ title: _count + "" });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "showCount") {
    ShowCount(request.count);
    sendResponse({ message: "ShowCount function called" });
  } else if (request.action === "getCookie") {
    chrome.cookies.get(request.payload, function (ck) {
      if (ck) sendResponse({ message: "Get Cookie", ck });
      else sendResponse({ message: "Not Get Cookie" });
    });
    return true;
  } else if (optionsObj && request._method == "updateConfig") {
    if (
      optionsObj.notification_skills.join("") !=
      request.options.notification_skills.join("")
    ) {
      restartListen(request.options);
    }
    optionsObj = request.options;
    sendResponse(false);
  }
});

function notifyClear(idreturn) {
  console.log("clear: " + idreturn);
  chrome.notifications.clear(idreturn, function () {
    var index = newprojects.indexOf(idreturn);
    newprojects.splice(index, 1);
    ShowCount(newprojects.length);
  });
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "createNotification") {
    console.log(request.data);
    chrome.notifications.create(
      request.data.id,
      {
        type: "basic",
        title: request.data.title,
        message: request.data.message,
        iconUrl: request.data.iconUrl,
        priority: request.data.priority,
      },
      function (idreturn) {
        newprojects[newprojects.length] = idreturn;
        ShowCount(newprojects.length);
        setTimeout(function () {
          notifyClear(idreturn);
        }, parseInt(optionsObj.notification_time_clear) * 1000);
      }
    );
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "getAudioFileURL") {
    // Respond with the URL of the audio file
    var audioFileURL = chrome.runtime.getURL("data/sounds/3.wav");
    sendResponse({ url: audioFileURL });
  }
});
