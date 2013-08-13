## xTuple Web/Mobile App Release Checklists

### Freezing

1. Update `enyo-client/database/source/update_version.sql` with the new version number.
2. Update `package.json` and `enyo-client/database/source/manifest.js` with the new version number.
3. Make sure extension versions are up-to-date in `/extension_name/client/core.js` and 
  `/extension_name/database/source/manifest.js`.
4. Update `package.json` in the `xtuple-extensions`, `private-extensions`, and `bi` repos,
   and update the extension versions *if they have changed*.
5. Update the project version number on dogfood and create new project version number for the next sprint.
6. Look at the open pull requests for all three repositories to make sure we have pulled everything
  we want for this release.
7. Make sure the only Resolved/Open issues for XT-MOBILE correspond to pull requests that
  you have left sitting in github.
8. Make sure that all Resolved <Not Open> issues have a Fixed-In version.
9. Create a new branch with the naming convention `tags/R1_4_0` (easiest done in Github).
10. Build Pandora on the frozen code
11. Send out an email.

### Testing

TODO: verify that the jsdoc look ok. Should this go in testing?

### Tagging

1. Jump to the frozen branch.
2. Add the version number and date to `RELEASE.md` if it has not been done already.
3. Run `node getReleaseNotes.js` from `private-extensions/source/incident_plus/scripts/` to generate 
  some code that you should run in the JS console against production dogfood. That will in turn 
  generate some code that you should plug into the `README.md` file. Delete out the incidents that 
  end users do not need to know about, e.g. bugs that were caused and fixed all within a sprint.
4. Commit and push changes.
5. Tag and push the release.
```bash
git fetch XTUPLE 
git checkout XTUPLE/tags/1_4_0
git tag -a v1.4.0 -m "xTuple Web Platform - Details here"
git push --tags XTUPLE
```
6. Also tag `xtuple-extensions`, `private-extensions`, and `bi`.
7. Send out an email.

### Deploying

