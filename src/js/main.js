"use strict";

function cookie_get(name) {
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  name = `${name}=`;

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }

    if (!c.indexOf(name)) {
      return c.substring(name.length, c.length);
    }
  }
}

function cookie_set(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

const uuid_chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_+";

function uuid(length) {
  if (typeof length == "undefined") {
    length = 52;
  }

  let s = "";
  for (let i = 0; i < length; i++) {
    s += uuid_chars[Math.floor(Math.random() * uuid_chars.length)];
  }

  return s;
}

window.onload = function () {
  if (typeof cookie_get("client-id") == "undefined") {
    cookie_set("client-id", uuid(), 10000);
  }

  // Register global components
  Vue.component("templated-input", require("./templated-input"));
  Vue.component("message", require("./message"));
  Vue.component("indicators", require("./indicators"));
  Vue.component("io-indicator", require("./io-indicator"));
  Vue.component("console", require("./console"));
  Vue.component("unit-value", require("./unit-value"));

  Vue.filter("number", function (value) {
    if (isNaN(value)) {
      return "NaN";
    }

    return value.toLocaleString();
  });

  Vue.filter("percent", function (value, precision) {
    if (typeof value == "undefined") {
      return "";
    }

    if (typeof precision == "undefined") {
      precision = 2;
    }

    return `${(value * 100.0).toFixed(precision)}%`;
  });

  Vue.filter("non_zero_percent", function (value, precision) {
    if (!value) {
      return "";
    }

    if (typeof precision == "undefined") {
      precision = 2;
    }

    return `${(value * 100.0).toFixed(precision)}%`;
  });

  Vue.filter("fixed", function (value, precision) {
    if (typeof value == "undefined") {
      return "0";
    }

    return parseFloat(value).toFixed(precision);
  });

  Vue.filter("upper", function (value) {
    if (typeof value == "undefined") {
      return "";
    }

    return value.toUpperCase();
  });

  Vue.filter("time", function (value, precision) {
    if (isNaN(value)) {
      return "";
    }

    if (isNaN(precision)) {
      precision = 0;
    }

    const MIN = 60;
    const HR = MIN * 60;
    const DAY = HR * 24;
    const parts = [];

    if (DAY <= value) {
      parts.push(Math.floor(value / DAY));
      value %= DAY;
    }

    if (HR <= value) {
      parts.push(Math.floor(value / HR));
      value %= HR;
    }

    if (MIN <= value) {
      parts.push(Math.floor(value / MIN));
      value %= MIN;
    } else {
      parts.push(0);
    }

    parts.push(value);

    for (let i = 0; i < parts.length; i++) {
      parts[i] = parts[i].toFixed(i == parts.length - 1 ? precision : 0);
      if (i && parts[i] < 10) {
        parts[i] = `0${parts[i]}`;
      }
    }

    return parts.join(":");
  });

  // Vue app
  require("./app");
};
