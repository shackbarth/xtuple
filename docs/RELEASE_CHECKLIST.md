## xTuple Web/Mobile App Release Checklist

1. Update `enyo-client/database/source/update_version.sql` with the new version number.
2. Update `package.json` with the new version number.
3. Update `enyo-client/application/index.html` version numbers to reset caching.
4. Make sure extension versions are up-to-date in `extensions/source/extension_name/client/core.js`.
4. Add the version number and date to `RELEASE.md` if it has not been done already.
5. Run `node getReleaseNotes.js` from `private-extensions/source/incident_plus/server/` to generate some code that you should run in the JS console against production dogfood. That will in turn generate some code that you should plug into the `README.md` file. Delete out the incidents that end users don not need to know about, e.g. bugs that were caused and fixed all within a sprint.
6. Commit and push changes.
6. Tag and push the release.
7. Send out an email.
