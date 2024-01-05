<p align="center">
  <a href="https://gsoc2.github.io/?utm_source=github&utm_medium=logo" target="_blank">
    <picture>
      <source srcset="https://gsoc2-brand.storage.googleapis.com/gsoc2-logo-white.png" media="(prefers-color-scheme: dark)" />
      <source srcset="https://gsoc2-brand.storage.googleapis.com/gsoc2-logo-black.png" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)" />
      <img src="https://gsoc2-brand.storage.googleapis.com/gsoc2-logo-black.png" alt="Gsoc2" width="280">
    </picture>
  </a>
</p>

# Official Gsoc2 Command Line Interface

[![Build Status](https://github.com/gsoc2/gsoc2-cli/workflows/CI/badge.svg?branch=master)](https://github.com/gsoc2/gsoc2-cli/actions?query=workflow%3ACI)
[![GitHub release](https://img.shields.io/github/release/gsoc2/gsoc2-cli.svg)](https://github.com/gsoc2/gsoc2-cli/releases/latest)
[![npm version](https://img.shields.io/npm/v/@gsoc2/cli.svg)](https://www.npmjs.com/package/@gsoc2/cli)
[![license](https://img.shields.io/github/license/gsoc2/gsoc2-cli.svg)](https://github.com/gsoc2/gsoc2-cli/blob/master/LICENSE)

This is a Gsoc2 command line client for some generic tasks. Right now this is
primarily used to upload debug symbols to Gsoc2 if you are not using the
Fastlane tools.

* Downloads can be found under
  [Releases](https://github.com/gsoc2/gsoc2-cli/releases/)
* Documentation can be found [here](https://docs.gsoc2.github.io/hosted/learn/cli/)

## Installation

If you are on OS X or Linux, you can use the automated downloader which will fetch the latest release version for you and install it:

    curl -sL https://gsoc2.github.io/get-cli/ | bash

We do, however, encourage you to pin the specific version of the CLI, so your builds are always reproducible.
To do that, you can use the exact same method, with an additional version specifier:

    curl -sL https://gsoc2.github.io/get-cli/ | GSOC2_CLI_VERSION=2.0.4 bash

This will automatically download the correct version of `gsoc2-cli` for your operating system and install it. If necessary, it will prompt for your admin password for `sudo`. For a different installation location or for systems without `sudo` (like Windows), you can `export INSTALL_DIR=/custom/installation/path` before running this command.

If you are using `gsoc2-cli` on Windows environments, [Microsoft Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist) is required.

To verify it’s installed correctly you can bring up the help:

    gsoc2-cli --help

### pip

_New in 2.14.3_: `gsoc2-cli` can also be installed using `pip`:

```bash
pip install gsoc2-cli
```

### Node

Additionally, you can also install this binary via npm:

    npm install @gsoc2/cli

When installing globally, make sure to have set
[correct permissions on the global node_modules directory](https://docs.npmjs.com/getting-started/fixing-npm-permissions).
If this is not possible in your environment or still produces an EACCESS error,
install as root:

    sudo npm install -g @gsoc2/cli --unsafe-perm

By default, this package will download gsoc2-cli from the CDN managed by [Fastly](https://www.fastly.com/).
To use a custom CDN, set the npm config property `gsoc2cli_cdnurl`. The downloader will append
`"/<version>/gsoc2-cli-<dist>"`.

```sh
npm install @gsoc2/cli --gsoc2cli_cdnurl=https://mymirror.local/path
```

Or add property into your `.npmrc` file (https://www.npmjs.org/doc/files/npmrc.html)

```rc
gsoc2cli_cdnurl=https://mymirror.local/path
```

There are a few environment variables that you can provide to control the npm installation:

```
GSOC2CLI_CDNURL=<url> # Use alternative cdn url for downloading binary
GSOC2CLI_USE_LOCAL=1 # Use local instance of gsoc2-cli binary (looked up via $PATH environment)
GSOC2CLI_SKIP_DOWNLOAD=1 # Skip downloading binary entirely
GSOC2CLI_NO_PROGRESS_BAR=1 # Do not print the progress bar when downloading binary (default for non-TTY environments like CI)
GSOC2CLI_LOG_STREAM=<stdout|stderr> # Changes where to redirect install script output
```

When using `gsoc2-cli` via JavaScript API or any 3rd party plugin that is consuming said API,
you can also use `GSOC2_BINARY_PATH=<path>` alongside `GSOC2CLI_SKIP_DOWNLOAD=1` to completely
control what binaries are downloaded and used throughout the whole process.

If you're installing the CLI with NPM from behind a proxy, the install script will
use either NPM's configured HTTPS proxy server or the value from your `HTTPS_PROXY`
environment variable.

### Homebrew

A homebrew recipe is provided in the `gsoc2/tools` tap:

    brew install gsoc2/tools/gsoc2-cli

### Docker

As of version _1.25.0_, there is an official Docker image that comes with
`gsoc2-cli` preinstalled. If you prefer a specific version, specify it as tag.
The latest development version is published under the `edge` tag. In production,
we recommend you to use the `latest` tag. To use it, run:

```sh
docker pull gsoc2/gsoc2-cli
docker run --rm -v $(pwd):/work gsoc2/gsoc2-cli --help
```

Starting version _`2.8.0`_, in case you see `"error: config value 'safe.directory' was not found;"` message,
you also need to correctly set UID and GID of mounted volumes like so:

```sh
docker run --rm -u "$(id -u):$(id -g)" -v $(pwd):/work gsoc2/gsoc2-cli --help
```

This is required due to security issue in older `git` implementations. See [here](https://github.blog/2022-04-12-git-security-vulnerability-announced/) for more details.

## Update

To update gsoc2-cli to the latest version run:

```sh
gsoc2-cli update
```

## Compiling

In case you want to compile this yourself, you need to install at minimum the
following dependencies:

* Rust stable and Cargo
* Make, CMake and a C compiler

Use cargo to compile:

    $ cargo build

Also, there is a Dockerfile that builds an Alpine-based Docker image with
`gsoc2-cli` in the PATH. To build and use it, run:

```sh
docker build -t gsoc2-cli .
docker run --rm -v $(pwd):/work gsoc2-cli --help
```
