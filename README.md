# websecurityinfo

## What it does ##

The extension includes:

* a background script that collects HTTP response information using the webSecurityInfo API, and stores the results using the storage API.
* a browser action with a popup including HTML, CSS, and JS, which renders the responses stored by the background page


When the user navigates to a website from any of the browser tabs, the background page collects responses with the "http" or "https" schemes

When the user clicks the browser action button, the popup is shown, and the responses saved using the storage API are retrived and rendered in the popup window.

![Screenshot of UI showing a list of observed responses](docs/response_list.png?raw=true "List of observed responses")

![Screenshot of UI showing an expanded response](docs/response_expanded.png?raw=true "Response details")

## How to install ##

This is an unpublished extension in development. See the [documentation](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/) for how to temporarily install an extension, or use [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/).
