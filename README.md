<p align="center">
  <a href="https://github.com/adisakshya/JustShareIt">
    <img src="https://raw.githubusercontent.com/adisakshya/JustShareIt/master/screenshots/logo.png" height="150" alt="JustShareIt">
  </a>
</p>

[![release](https://img.shields.io/badge/release-1.1-green.svg)](https://github.com/adisakshya/JustShareIt/releases) [![maintenance](https://img.shields.io/badge/maintained%3F-yes-green.svg)]() [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/adisakshya/JustShareIt/blob/master/LICENSE) [![Website](https://img.shields.io/badge/website-down-red.svg)](https://adisakshya.github.io/JustShareIt) [![Tests](https://img.shields.io/badge/Tests-no-red.svg)]() [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/adisakshya/JustShareIt/pulls) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)]()

---

I couldn't find a file-haring app that ticked all the boxes I'm interested in 🤔: files are shared in a fast & secure way ⚡, sharing any type of file, any size of file, from my laptop/pc to any device, having cross-platform support with pretty interface, no ads please and most important among all no need to have the same app installed on the receiving end , enabling convenient, hassle free sharing experience.

So I built my own. 😃

## Features

### The Lighting Bolt ⚡

Open-source file sharing app with fast cross-platform transfer speed, free of online feeds. Enables sharing files including photos, videos, music, contacts, apps and any other files, no matter of what size.

<p align="center">
  <a href="https://raw.githubusercontent.com/adisakshya/JustShareIt/master/screenshots/client_request.png">
  <img src="https://raw.githubusercontent.com/adisakshya/JustShareIt/master/screenshots/client_request.png" width="100%" alt="User landing page" />
  </a>
</p>

### Share with anyone 💻📱

Share files from your laptop/personal-computer with any type of client, let it be another laptop/personal-computer or mobile devices. No matter what OS they are operating on.

When I used to use apps like SHAREIt, to transfer files from my laptop to mobile/another-laptop it required that it's app to be installed on both the devices i.e., on sender & receiver, this created hurdles for sharing conveniently.

Having JustShareIt installed on both ends is not required. Only the sender needs to have it installed. Receiver can access the shared files using any convient browser on their devices upon sharing approval from the sender.

<p align="center">
  <a href="https://raw.githubusercontent.com/adisakshya/JustShareIt/master/screenshots/mobile_devices_qr.png">
    <img src="https://raw.githubusercontent.com/adisakshya/JustShareIt/master/screenshots/mobile_devices_qr.png" width="100%" alt="Share with mobile devices" />
  </a>
</p>

### JustKeepItSecure 🔐

No one, except users the admin approves can access JustShareIt for receiving shared files from your system.

<p align="center">
  <a href="https://raw.githubusercontent.com/adisakshya/JustShareIt/master/screenshots/admin_all_requests.png">
   <img src="https://raw.githubusercontent.com/adisakshya/JustShareIt/master/screenshots/admin_all_requests.png" width="100%" alt="Admin Request" />
  </a>
</p>

## Getting Started

JustFollow below steps to setup the app:

### Prerequisites

NodeJS - Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside of a browser.

- Download & Install **NodeJS**
		- ```https://nodejs.org/en/download/```.

### Operating Instructions

- Fork this repository
	- "Forking" adds a copy of [adisakshya/JustShareIt](https://github.com/adisakshya/JustShareIt/) repository to your GitHub account as `https://github.com/YourGitHubUserName/JustShareIt`
- Download or clone your forked repository
	- You can clone the repository executing below command in a location of your choice of your system.
	```$ git clone https://github.com/YourGitHubUserName/JustShareIt.git```
- That's it your almost done, now in the repository root, run the following command
```$ cd justshareit/```, this will take you to project directory.
- Now install dependencies using the node package manager (npm).
	- In project-directory ```./justshareit```, run the following command
		- ```npm install```
- You are all set to get started with JustShareIt, now run the following command to start JustShareIt
	- ```npm start --host 0.0.0.0```
- Now you have successfully setup JustShareIt,
	- Go to ```http://<your-ip-address>:3000/JustShareIt/admin``` for the admin dashboard (sender).
	- Go to ```http://<your-ip-address>:3000``` for the user landing page(receiver).
	- Admin (sender) can add the files to share from admin-dashboard.
	- Users can access shared files from user-dashboard, after access-request is approved by the admin.
- To stop the services run just terminate the execution of the application.

## Suggest Features

Is a feature you care about currently missing? Make sure to browse the [issue tracker](https://github.com/adisakshya/JustShareIt/issues?q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc) and add your ":+1:" reaction to the issues you care most about, as we also use those reactions to prioritize issues.

## Contributing

There are multiple ways to contribute to this project, read about them [here](https://github.com/adisakshya/JustShareIt/blob/master/.github/CONTRIBUTING.md).

## JustStarIt

🌟 Star this repo if JustShareIt helped you.

## License

All versions of the app are open-sourced, read more about this [LICENSE](https://github.com/adisakshya/JustShareIt/blob/master/LICENSE).
