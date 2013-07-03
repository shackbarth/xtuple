## xTuple Web/Mobile App Release Checklist

1. Update `enyo-client/database/source/update_version.sql` with the new version number.
2. Update `package.json` with the new version number.
3. Update `enyo-client/application/index.html` version numbers to reset caching.
4. Make sure extension versions are up-to-date in `extensions/source/extension_name/client/core.js`.
5. Update the project version number on dogfood and create new project version number for the next sprint.
6. Add the version number and date to `RELEASE.md` if it has not been done already.
7. Run `node getReleaseNotes.js` from `private-extensions/source/incident_plus/scripts/` to generate some code that you should run in the JS console against production dogfood. That will in turn generate some code that you should plug into the `README.md` file. Delete out the incidents that end users don not need to know about, e.g. bugs that were caused and fixed all within a sprint.
8. Commit and push changes.
9. Tag and push the release.
10. Send out an email.
