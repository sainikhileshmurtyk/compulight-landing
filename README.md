# Compulight landing page

This site is ready for GitHub-based deployment to **Cloudflare Pages**. Cloudflare connects to the repository and deploys changes pushed to `main`. The site is static HTML, CSS and JavaScript with locally hosted fonts. It needs no framework, dependency install or compilation.

**Current status:** prepared and verified locally. No Git repository has been initialized here, no GitHub repository has been created or pushed, and no Cloudflare project or DNS records have been changed.

## Files

- `public/`: the complete website and the only directory Cloudflare should publish.
- `README.md`: this setup and maintenance guide.
- `.gitignore`: excludes the original style guide, original logo directory, local QA, ZIPs and local tooling state.
- `tools/set-contact.mjs`: changes the contact address and generates a new random encoding mask.
- `tools/package.py`: packages the site and GitHub source using explicit file allowlists.
- `compulight-github.zip`: a ready-to-upload GitHub source bundle. Extract it before uploading its contents to GitHub.
- `compulight-pages.zip`: an optional Direct Upload asset bundle. It is not used by Git-based deployment.
- `qa/`: local screenshots and verification, excluded from both bundles and Git.

The GitHub bundle contains `public/`, this guide, `.gitignore` and the two maintenance scripts. It excludes the original PDFs, technical document, source artwork directory and QA files. The website includes a copy of the Compulight symbol and the font licenses it needs.

## 1. Put the site on GitHub

Use a dedicated repository named `compulight-landing`. Cloudflare Pages supports private repositories, so the repository can stay private while the deployed website is public.

Choose either the Terminal method or the browser upload method below.

### Terminal method

1. Open [GitHub's new repository page](https://github.com/new).
2. Set the repository name to `compulight-landing` and visibility to **Private**.
3. Leave the options to add a README, .gitignore and license unchecked, then create the empty repository.
4. Run these commands locally. Replace `YOUR_GITHUB_NAME` with the owner shown in the repository URL:

```sh
cd '/Users/sainikhileshmk/Documents/work-sync/D/code/wip/admin/2026 event-slush/landing'
git init -b main
git add public README.md .gitignore tools/set-contact.mjs tools/package.py
git diff --cached --stat
git commit -m "Add Compulight landing page"
git remote add origin https://github.com/YOUR_GITHUB_NAME/compulight-landing.git
git push -u origin main
```

The explicit `git add` command stages only the website and maintenance files. Review the staged file list before committing. Authenticate with your usual GitHub credential manager or GitHub CLI when prompted. GitHub does not accept an account password for Git pushes over HTTPS.

If you already have GitHub CLI installed and authenticated, you can instead run `gh repo create compulight-landing --private --source=. --remote=origin --push` after the local commit. This replaces the empty-repository creation, remote-add and push steps.

### Browser upload method

1. Extract `compulight-github.zip` into a temporary folder.
2. Create a private GitHub repository named `compulight-landing`.
3. Use **uploading an existing file** on the empty-repository page, or **Add file > Upload files** in an initialized repository.
4. Upload the extracted `public/` and `tools/` folders, `README.md` and `.gitignore`. On macOS, use **Command+Shift+.** in Finder to show `.gitignore` if needed. Upload the contents of the extracted folder so `public/` is at the repository root.
5. Commit the upload to `main`.

Upload the extracted files, not the ZIP itself. When finished, the top level on GitHub should contain:

```text
public/
  index.html
  styles.css
  contact.js
  _headers
  assets/
tools/
  set-contact.mjs
  package.py
README.md
.gitignore
```

If you use browser uploads, local edits will need another upload and commit. The Terminal method makes ongoing updates easier through `git push`.

## 2. Connect GitHub to Cloudflare Pages

1. Sign into [Cloudflare](https://dash.cloudflare.com/) and select the account that should own the site.
2. Open **Workers & Pages > Create application > Pages > Connect to Git**. The option may be labelled **Import an existing Git repository**.
3. Select **GitHub**. Authorize the Cloudflare GitHub application for **only the `compulight-landing` repository** when choosing repository access.
4. Select that repository and choose **Begin setup**.
5. Set the following values:

| Setting | Value |
| --- | --- |
| Project name | `compulight` or another available name |
| Production branch | `main` |
| Framework preset | `None` |
| Root directory | Leave blank, using the repository root |
| Build command | `exit 0` |
| Build output directory | `public` |
| Environment variables | None |

`exit 0` is a successful no-op command, as documented by Cloudflare for static HTML. There is no actual build step. The output directory is `public`, with no leading slash. Do not set the root directory to `public` as well, since that would make the output path resolve to `public/public`.

6. Choose **Save and Deploy**. Cloudflare will clone the repository and publish the contents of `public/`.
7. Open the HTTPS `*.pages.dev` URL returned by Cloudflare and check the heading, graphic, logo and fonts. Open the contact options, copy the address and try opening your email app on desktop and phone.

No GitHub Actions workflow, Wrangler login, API token or paid hosting service is needed for this setup. Cloudflare runs the deployment after a push to `main`; other branches and pull requests can receive preview deployments.

[Cloudflare Git integration guide](https://developers.cloudflare.com/pages/get-started/git-integration/) and [static HTML settings](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

### If you already created a Direct Upload project

Cloudflare does not let an existing Direct Upload project be converted to Git integration. Create a new Git-connected Pages project, for example `compulight-web`. Test its `pages.dev` URL before moving any custom domain from the earlier project. If the earlier guide was never deployed, start with the Git setup above.

[Direct Upload project limitation](https://developers.cloudflare.com/pages/get-started/direct-upload/).

## 3. Make future updates

Edit the page in `public/index.html` and styling in `public/styles.css`. With the Terminal setup:

```sh
cd '/Users/sainikhileshmk/Documents/work-sync/D/code/wip/admin/2026 event-slush/landing'
git add public README.md .gitignore tools/set-contact.mjs tools/package.py
git diff --cached --stat
git commit -m "Update landing page"
git push
```

Cloudflare automatically deploys the new commit. You do not need to recreate a ZIP, manually upload files to Cloudflare or create a new Pages project. Check the deployment result in the project's deployment history.

For a preview before changing production, make edits on another branch and open a pull request. Merge into `main` when ready for the live site.

## 4. Attach compulight.co (optional)

First verify the `pages.dev` deployment. In that Pages project, open **Custom domains > Set up a domain**, enter `compulight.co`, and follow the returned instructions.

- For the apex `compulight.co`, Cloudflare requires the domain to be a zone in the same account with nameservers pointing to Cloudflare. If already configured this way, setup can create the required web record.
- For `www.compulight.co`, add it in Pages as well. A subdomain can use a CNAME to the project's `*.pages.dev` hostname, including with an external DNS provider.
- If replacing an existing web record, first check what it serves. Keep existing **MX, SPF, DKIM and DMARC records** intact. When changing nameservers, carry over the complete DNS zone, including email records.
- Wait until Pages reports the custom domain active and HTTPS works, then test the contact options again. The website and email inbox are separate services.

Associate the domain with the Pages project before manually adding a CNAME. [Cloudflare custom domain instructions](https://developers.cloudflare.com/pages/configuration/custom-domains/).

## Contact behavior

The address is **website@compulight.co**, selected for website enquiries. **Contact us** and **Want to know more?** open the same contact dialog. Visitors can copy the email address or open their configured mail client with the recipient and the subject "Hello Compulight". Nothing is sent automatically.

The static HTML has no email address or `mailto:` URL. `contact.js` contains byte arrays encoded with a randomly generated mask. The address is decoded when the dialog opens and cleared from the page when it closes. This deters basic scrapers; bots that execute or analyze JavaScript can still recover it.

Clipboard access works on HTTPS and localhost when allowed. If permission is denied, the dialog selects the address for manual copying. JavaScript is required for contact; visitors with it disabled see an explanatory message.

To change the contact address, run the following and enter the address at the prompt:

```sh
node tools/set-contact.mjs
```

Then commit `public/contact.js` and push it to GitHub. The encoding changes each time the tool runs, while the destination stays the address you entered. Publishing does not create or configure the email inbox.

## Local preview and verification

```sh
cd '/Users/sainikhileshmk/Documents/work-sync/D/code/wip/admin/2026 event-slush/landing'
python3 -m http.server 8788 --bind 127.0.0.1 --directory public
```

Visit [the local preview](http://127.0.0.1:8788/). Stop the server with Ctrl+C. Double-clicking `public/index.html` also works, although clipboard permissions may differ. This simple preview does not apply Cloudflare's `_headers` file.

The site has been checked in a headless Chromium browser at widths of 320, 375, 390, 768, 1024 and 1440 px. Checks cover fonts and assets, the deployed Content Security Policy, clipboard success and denied-permission fallback, the mail link, dialog keyboard controls, mobile layout, reduced motion and JavaScript-disabled messaging. Screenshots are in `qa/`. Opening the operating system's email application and checking an actual Cloudflare deployment remain manual checks after publishing.

The supplied logo and style guide remain in their original locations. The SVG illustration is conceptual. Public copy introduces the approach without publishing component specifications, model-mapping details, performance targets or the development roadmap. `_headers` allows local assets, blocks framing and disables unused device permissions. [Cloudflare header configuration](https://developers.cloudflare.com/pages/configuration/headers/).

To refresh the optional GitHub source bundle and Direct Upload ZIP after edits:

```sh
python3 tools/package.py
```

The ZIPs are convenience exports. GitHub deployment uses the files committed in the repository.
