# Hekla Volcano — Pages CMS and SiteGround

The finished website is the `dist` folder. Its text is managed in `content/home.json` and `content/history.json`, which Pages CMS presents as friendly browser forms. Saving in Pages CMS commits the text to GitHub; GitHub then rebuilds the two static pages and deploys them to SiteGround.

## Editing in Pages CMS

1. Put this project in a private GitHub repository with `main` as its default branch.
2. Visit [Pages CMS](https://app.pagescms.org/), sign in with GitHub, and authorize that repository.
3. Open either **Homepage** or **History page** in the sidebar, edit the fields, and save.
4. The saved change is recorded in GitHub and triggers the deployment workflow.

The `.pages.yml` file defines the editing forms. The public website has no CMS login, database, or dynamic server code.

## One-time GitHub deployment setup

Before the first Pages CMS edit, add these repository secrets under **Settings → Secrets and variables → Actions**:

- `SITEGROUND_HOST`: the SSH hostname shown in SiteGround
- `SITEGROUND_USER`: the SiteGround SSH username
- `SITEGROUND_PORT`: normally `18765`; use the value SiteGround shows
- `SITEGROUND_PATH`: the absolute document-root path for this domain
- `SITEGROUND_SSH_KEY`: the private key created in SiteGround's SSH Keys Manager
- `SITEGROUND_KNOWN_HOSTS`: the verified SSH host-key line for the SiteGround server

SiteGround SSH keys can reach all files for the website account, so keep the repository private, store the private key only as a GitHub secret, and do not paste it into the project files.

To regenerate the static pages locally after changing the JSON content, run `npm run build`. No package installation is required.

## Before changing the live site

1. In SiteGround, make a full backup of the existing WordPress site (files and database).
2. In **Websites**, choose `heklavolcanolivestream.com` and open **Site Tools**.
3. Open **Site → File Manager** and identify the domain's document root, usually `public_html`.
4. Move the current WordPress files into a dated backup folder inside the account. Do not delete the database yet.

## Upload this site

1. For the first deployment only, upload the *contents* of `dist` into the document root. Both `index.html` and `history.html` must sit directly inside `public_html`, not inside another `dist` folder.
2. Load `https://heklavolcanolivestream.com/` in a private/incognito browser window and check the desktop and phone layouts.
3. Keep the WordPress backup until you are happy with the replacement.

## Add the future livestream

The camera panel intentionally says “Footage coming soon.” When a YouTube stream is ready, the site template can be updated with YouTube's supplied embed iframe while the surrounding copy remains editable in Pages CMS.

## Content and image sources

The visible historical/monitoring information links to the Icelandic Meteorological Office. The eruption photograph is served from Wikimedia Commons and linked to its file page for licence and attribution details. Before adding any new photo, verify its licence on its source page and retain the attribution on this site.
