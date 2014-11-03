/*jshint node:true, indent:2, curly:false, eqeqeq:true, immed:true,
latedef:true, newcap:true, noarg:true, regexp:true, undef:true,
strict:true, trailing:true, white:true */
/*global XT:true */

(function () {
  "use strict";

  var lang = XT.stringsFor("en_US", {
    "_authURI": "Auth URI",
    "_clientName": "Client Name",
    "_clientEmail": "Client Email",
    "_clientType": "Client Type",
    "_delegatedAccess": "Delegated Access",
    "_details": "Details",
    "_id": "ID",
    "_issued": "Issued",
    "_fullListUrl": "Full List URL",
    "_generatingPrivateKey": "A new keypair will be generated for this OAUTH2 client. " +
      "The public key will be available in the future with this client. The private key " +
      "is only available now as a one-time download. Note that this process can take up " +
      "to a minute. Please wait until the key is downloaded.",
    "_logoURL": "Logo URL",
    "_maintainOauth2clients": "Maintain OAUTH2 Clients",
    "_oauth2": "OAUTH2",
    "_oauth2Client": "OAUTH2 Client",
    "_oauth2Clients": "OAUTH2 Clients",
    "_redirects": "Redirects",
    "_redirectURI": "Redirect URI",
    "_secret": "Secret",
    "_serviceAccount": "Service Account",
    "_singleResourceUrl": "Single Resource URL",
    "_tokenURI": "Token URI",
    "_tokenRevocationURI": "Token Revocation URI",
    "_webServer": "Web Server",
    "_website": "Website",
    "_x509PubCert": "X.509 Public Key Certificate"
  });

  if (typeof exports !== 'undefined') {
    exports.language = lang;
  }
}());
