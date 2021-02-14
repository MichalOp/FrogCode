var md5 = require("md5");

function getPwdhash(s) {
  return md5(s);
}

module.exports = {
  getPwdhash,
};
