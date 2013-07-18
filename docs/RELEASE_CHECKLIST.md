## xTuple Web/Mobile App Release Checklists

### Freezing

1. Update `enyo-client/database/source/update_version.sql` with the new version number.
2. Update `package.json` with the new version number.
3. Make sure extension versions are up-to-date in `/extension_name/client/core.js` and 
  `/extension_name/database/source/manifest.js`.
4. Update the project version number on dogfood and create new project version number for the next sprint.
5. Look at the open pull requests for all three repositories to make sure we have pulled everything
  we want for this release.
6. Make sure the only Resolved/Open issues for XT-MOBILE correspond to pull requests that
  you have left sitting in github.
7. Make sure that all Resolved <Not Open> issues have a Fixed-In version.
8. Create a new branch with the naming convention `tags/R1_4_0` and push to the `XTUPLE` remote.
```bash
git checkout XTUPLE/master
git checkout -b tags/R1_4_0
git push XTUPLE tags/R1_4_0
```
9. Send out an email.

### Testing



### Tagging

1. Add the version number and date to `RELEASE.md` if it has not been done already.
2. Run `node getReleaseNotes.js` from `private-extensions/source/incident_plus/server/` to generate 
  some code that you should run in the JS console against production dogfood. That will in turn 
  generate some code that you should plug into the `README.md` file. Delete out the incidents that 
  end users do not need to know about, e.g. bugs that were caused and fixed all within a sprint.
3. Commit and push changes.
4. Tag and push the release.
5. Send out an email.

### Deploying

