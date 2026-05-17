/*
 * Title: Utilities
 * Description: Important utility functions
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/21/2020
 *
 */

// dependencies

// module scaffolding
const crypto = require("crypto");

const utilities = {};
const environments = require("./environments");

// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
  let output;

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

// hash string
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    console.log(environments, process.env.NODE_ENV);
    const hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  }
  return false;
};

// step-12 : and then amader random string create korar jonno nicher ei function ta banabo
// create random string
utilities.createRandomString = (strlength) => {
  let length = strlength;
  //   validation
  length = typeof strlength === "number" && strlength > 0 ? strlength : false;

  if (length) {
    const possiblecharacters = "abcdefghijklmnopqrstuvwxyz1234567890";
    let output = "";
    for (let i = 1; i <= length; i += 1) {
      // ekhane ekta important bisoy: chart random ekta string dibe, and math.random muloto 0-1 er modde dosomic share kore so setar sathe 10 gun korle 1-9 er modde number pabo, so etar sathe possiblecharacter.length gun korle amra amder random jwt token generate korte parbo, and Math.floor gun add korle dosomic chara amake number dibe
      const randomCharacter = possiblecharacters.charAt(
        Math.floor(Math.random() * possiblecharacters.length),
      );
      output += randomCharacter;
    }
    return output;
  }
  return false;
};

// export module
module.exports = utilities;
