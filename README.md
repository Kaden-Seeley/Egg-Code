# EggCode

EggCode is a simple desktop timer designed to help you stay focused while coding. The interface is built with HTML, CSS, and JavaScript and runs as an Electron application.

<img width="280" height="436" alt="image" src="https://github.com/user-attachments/assets/8dced153-8401-4e2a-b50a-b3cecbad4b4b" />

## Install on Linux

Download the [EggCode Linux installer for x86_64](https://github.com/Kaden-Seeley/Egg-Code/releases/latest/download/EggCode-Linux-x86_64-Installer-1.0.0.run) from the latest release. Open the downloaded file to choose an install folder. EggCode will then appear in your applications menu; search for **EggCode** to launch it.

If your system does not let you run the downloaded file, open a terminal in its download folder and run:

```bash
chmod +x EggCode-Linux-x86_64-Installer-1.0.0.run
./EggCode-Linux-x86_64-Installer-1.0.0.run
```

This installer currently supports x86_64 Linux. On Wayland, always-on-top requires an XWayland display.

## Requirements

To run from source or create a package, you need:

- [Node.js](https://nodejs.org/) 22.12 or newer and npm
- The source code from this repository

## Setup

Clone the repository, open a terminal in the project folder, and install the dependencies:

```bash
npm install
```

## Run From Source

Start EggCode in development mode with:

```bash
npm start
```

## Build For Linux

Create both a portable AppImage and a Debian package:

```bash
npm run build:linux
```

The files are written to `dist/`. Launch the AppImage with:

```bash
chmod +x dist/EggCode-*.AppImage
./dist/EggCode-*.AppImage
```

Install the `.deb` package on Debian or Ubuntu with your package manager, or from a terminal with `sudo apt install ./dist/EggCode-*.deb`.

To create a single-file graphical installer that lets each user choose the install folder, run:

```bash
npm run build:installer
```

This creates `dist/EggCode-Linux-<architecture>-Installer-<version>.run` (for example, `EggCode-Linux-x86_64-Installer-1.0.0.run`). Users can launch it from their file manager or run it from a terminal. It installs the app and adds an EggCode entry to their applications menu, where they can search for and launch it. A desktop folder chooser opens at `~/Applications` when available; otherwise, the installer asks for the folder in the terminal.

If the downloaded file is not marked executable, run these commands from its folder:

```bash
chmod +x EggCode-Linux-*-Installer-*.run
./EggCode-Linux-*-Installer-*.run
```

## Build For Windows

On Windows, create the portable executable with:

```bash
npm run build:win
```

Build output is written to `dist/` and is excluded from version control.

## License

This project is licensed under the [Apache License 2.0](LICENSE). You can read the full license terms in the [LICENSE file](LICENSE).
