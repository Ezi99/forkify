import { TIMEMOUT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  const response = await Promise.race([fetch(url), timeout(TIMEMOUT_SEC)]);
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message + " " + response.status);
  }

  return body;
};
