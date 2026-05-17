/*
 * Title: Token Handler
 * Description: Handler to handle token related routes
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 12/05/2020
 *
 */

// step-2 : ekhane amra amader ager userHandler er all code niye ashbo, and ja ja lage seta nibo

// dependencies
const data = require("../../lib/data");
const { hash } = require("../../helpers/utilities");
// step-13 : and then ekhane require kore niye eshe tokenId = function ta bosay dibo guru :
const { createRandomString } = require("../../helpers/utilities");
const { parseJSON } = require("../../helpers/utilities");

// module scaffolding
const handler = {};
// step-3 : ekhane amra user handler ke token handler e replace korbo, and etai muloto amader route.js e route er jonno call hoy
handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    // step-4 : sob _users ke replace kore _token e replace korbo
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

// step-5 : sob _users er replace e _token hobe, and vitorer sob function muche dite hobe, just _token.post,get,put etc ei function gulo thakbe

handler._token = {};

// step-7 : so ekhane amra token post korbo, mane jokhon ekta user login korbe tar token create hobe, and then setake ekhane post korbo, pore get, put, delete, verify korbo amra, let's start the jwt token er khela :
handler._token.post = (requestProperties, callback) => {
  // step-8 : phone ta ager userHandler theke niye eshe check korbo and password same:
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  //   step-9 : ekhane amra check korbo jdi phone and password ok thake seta :
  // step-10 : amader tokens er jonno .data folder er modde age ekta tokens name e folder create kore nite hobe, and amader password ta jeheto hash kore niyesilam, so sei pass take check korar jonno hash function ta require kore niye ashte hobe :
  if (phone && password) {
    data.read("users", phone, (err1, userData) => {
      const hashedpassword = hash(password);
      if (hashedpassword === parseJSON(userData).password) {
        // step-11 : ekhon amader token generate korte hobe, ejonno amra helper/utilities er modde hash function er moto age ekta function create korbo
        const tokenId = createRandomString(20);
        // step-14 : important bisoy, so amader token ta kotokhon ba etar validity kotokhon thakbe seta niche:
        const expires = Date.now() + 60 * 60 * 1000;
        // step-15 : and then token er nicher jinishpotro gulo rakhbo
        const tokenObject = {
          phone,
          id: tokenId,
          expires,
        };

        // step-16 : finally amader create kora tokens folder er modde token ta store korbo:
        // store the token
        data.create("tokens", tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: "There was a problem in the server side!",
            });
          }
        });
      } else {
        callback(400, {
          error: "Password is not valid!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};
// step-17 : then amader postman khule first ager lesson er moto ekta user e data post kore data create korbo, then:
// // {
//   "phone": "01234567890",
//   "password": "123456"
// } eta diye /token er modde post korlei amader token create hoye jabe token folder er modde!

// step-18 : ekhon amra get er kaj korbo, jehetu userHandler er get and etar get er kaj same, ejonno amra userHandler er get er code ta copy koore niye eshe setai modify korbo
handler._token.get = (requestProperties, callback) => {
  // step-19 : sob jaygay phone er bodole id ashbe
  // check the id if valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    // step-20 : ekhane length 20 hobe c's amader token 20 character er
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;
  if (id) {
    // step-21 : niche password.delete eta bad dibo, c's eta token ! and user er bodole tokens folder convert
    // lookup the token
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...parseJSON(tokenData) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, {
          error: "Requested token was not found!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested token was not found!",
    });
  }
};

// step-22 : and then amader postman e giye valid token id diye post korle amader niche data diye dibe, {exa : http://localhost:3000/token?id=okhrfp28krccvtop9wua}

// step-23 : so ekhon amra put er kaj korbo and ekhane token er modde tw ar update korar kaj nai, user jdi amader exteends:true pathay so amra token tar validity 1 hour baray dibo ei, token take refresh kora ei!
handler._token.put = (requestProperties, callback) => {
  // step-24 : then amra opurer post theke phone ta copy kore niye eshe id te convert korbo, and length 20
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;
  //   step-25 and then id ta niche copy kore extend e convert korbo, then string er bodole boolean and then false bodole true
  const extend = !!(
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
  );
  // step-26 : and then amra ekhane token ta thik ki na eta check korbo
  if (id && extend) {
    data.read("tokens", id, (err1, tokenData) => {
      // step-27: then token ta jehetu string e ache etake pasrseJSON e convert korbo, then niche token er validity 1 hour baray diye token database e store kore nibo, and eta exprires var er modde ache db te
      const tokenObject = parseJSON(tokenData);
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 1000;
        //step-28 : store the updated token
        data.update("tokens", id, tokenObject, (err2) => {
          if (!err2) {
            callback(200);
          } else {
            callback(500, {
              error: "There was a server side error!",
            });
          }
        });
      } else {
        callback(400, {
          error: "Token already expired!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request",
    });
  }
};

// step-29 : and then check korar pala, ata amra localhost e : http://localhost:3000/token, method:PUT, and body : "{
//   "id": "okhrfp28krccvtop9wua",
//   "extend":true
// }" id ta must tokens folder er moddo theke create kora token theke nite hobe, and then eta korle seit token tar 1 hour expire barbe boobie!

// step-30 : so delete er jonno amader ager userHandler er delete ta niye ashbo, then setake modify korbo
handler._token.delete = (requestProperties, callback) => {
  // step-31 : ekhane phone bodole id hobe, length = 20
  // check the token if valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the user
    // step-32 : and then ekhane user er bodole tokenData and user bodole oopure id:
    data.read("tokens", id, (err1, tokenData) => {
      if (!err1 && tokenData) {
        data.delete("tokens", id, (err2) => {
          if (!err2) {
            callback(200, {
              message: "Token was successfully deleted!",
            });
          } else {
            callback(500, {
              error: "There was a server side error!",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a server side error!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was a problem in your request!",
    });
  }
};

// step-33 : and then etar kaj sesh, ekhon amra eta delete korbo evabe : localHost:http://localhost:3000/token?id=okhrfp28krccvtop9wua, {
//   "id": "okhrfp28krccvtop9wua",
//   "extend":true
// }, and then niche successfully fucked dekhabe and id delete hoye jabe candu, and evabe user logout hoy!

// step-35 : ekhon amara varify function ta create korbo:
handler._token.verify = (id, phone, callback) => {
  // step-36 : and ekhane data tokens folder er modde data ta read korbo
  data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      // step-37 : ekhane data ta parseJSON e convert kore nibo, c's data ta string
      if (
        parseJSON(tokenData).phone === phone &&
        parseJSON(tokenData).expires > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
    // step-38 : and etai silo simple verify function and just id and phone pathay diye ekhane ekta user ke authenticad korbo amra
  });
};

module.exports = handler;

// step-34 : ekhon amader main kaj suru hobe, eta onkta amader express er middlewere er moto and ekhon amra userHandler er modde age just get,put,delete,post er kaj korchilam authentication chara, ekhon amra tokeverify er maddome pura kaj ta korbo, let's go!
