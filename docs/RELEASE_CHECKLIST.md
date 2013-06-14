## xTuple Web/Mobile App Release Checklist

1. Update `package.json` with the new version number.
2. Update `enyo-client/application/index.html` version numbers to reset caching.
3. Add the version number and date to `README.md` if it hasn't been done already.
4. Run `node getReleaseNotes.js` from `private-extensions/source/incident_plus/server/` to generate some code that you should run in the JS console against production dogfood. That will in turn generate some code that you should plug into the `README.md` file. Delete out the incidents that end users don't need to know about, e.g. bugs that were caused and fixed all within a sprint.
5. Tag the release.
6. Send out an email.
