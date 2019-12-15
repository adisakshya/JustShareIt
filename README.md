<p align="center">
  <a href="https://github.com/adisakshya/JustShareIt">
    <img src="https://raw.githubusercontent.com/adisakshya/JustShareIt/master/webserver/static/img/logo.png?token=AKXRM5VLR2QKYOTUH2VPINC574NDS" height="150" alt="Notable">
  </a>
</p>

[![release](https://img.shields.io/badge/release-1.0-green.svg)](https://github.com/adisakshya/JustShareIt/releases) [![maintenance](https://img.shields.io/badge/maintained%3F-yes-green.svg)]() [![made-with-python](https://img.shields.io/badge/python-3.7.3-blue.svg)]() [![dockerized](https://img.shields.io/badge/dockerized-yes-green.svg)](https://github.com/adisakshya/JustShareIt/blob/master/docker-compose.yml) [![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/adisakshya/JustShareIt/blob/master/LICENSE) [![Website](https://img.shields.io/badge/website-down-red.svg)](https://adisakshya.github.io/JustShareIt) [![Tests](https://img.shields.io/badge/Tests-no-red.svg)]() [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/adisakshya/JustShareIt/pulls) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)]()

---

I couldn't find a file-haring app that ticked all the boxes I'm interested in 🤔: files are shared fast & securely ⚡, sharing any type of file, any size of file, from my laptop/pc to any device, having cross-platform support with pretty interface, no one can access the app except me (SHAREIt allowed it though 🤨), no ads please and no need to have the same app installed on the receiving end , enabling convenient, hassle free sharing experience.

So I built my own. 😃

## Features

### The Lighting Bolt ⚡

Open-source sharing app with fast cross-platform transfer speed, free of online feeds. Enables sharing files including photos, videos, music, contacts, apps and any other files, no matter of what size.

<p align="center">
  <a href="https://img.notable.md/screenshot-editor.png">
  <img src="https://github.com/adisakshya/JustShareIt/raw/master/screenshots/user_landing_page.png" width="800" alt="User landing page" />
  </a>
</p>

### No room to waste 📦

Files to be shared are simply not stored on your disk, this is extremely storage friendly, unlike conventional apps some space is required to store the files first on app storage and then share them with the receiver.

<p align="center">
  <a href="https://img.notable.md/screenshot-filesystem.png">
   <img src="https://github.com/adisakshya/JustShareIt/raw/master/screenshots/shared_files.png" width="800" alt="Shared Files" />
  </a>
</p>

### Share with anyone 💻📱

Share files from your laptop/personal-computer with any type of client, let it be another laptop/personal-computer or mobile devices. No matter what OS they are operating on.

When I used to use SHAREIt, to transfer files from my laptop to mobile/another-laptop it required that it's app to be installed on both the devices i.e., on sender & receiver, this created hurdles for sharing conveniently.

Having JustShareIt installed on both ends is not required. Only the sender needs to have it installed. Receiver can access the shared files using any convient browser on their devices upon sharing approval from the sender.

<p align="center">
  <a href="https://img.notable.md/screenshot-dark.png">
    <img src="https://github.com/adisakshya/JustShareIt/raw/master/screenshots/share_with_mobile.png" width="800" alt="Share with mobile devices" />
  </a>
</p>

### JustKeepItSecure 🔐

No one, except you can access JustShareIt for sharing files from your system with anyone.

<p align="center">
  <a href="https://img.notable.md/screenshot-zen.png">
   <img src="https://github.com/adisakshya/JustShareIt/raw/master/screenshots/admin_login.png" width="800" alt="Admin Login" />
  </a>
</p>

## Getting Started

JustFollow below steps to setup the app:

### Prerequisites

Docker - Set of platform as a service products that use OS-level virtualization to deliver software in packages called containers.

- For Windows/MacOS
	- Download & Install **Docker Toolbox**
		- for macOS instructions are [here](https://docs.docker.com/toolbox/toolbox_install_mac/).
		- for Windows instructions are [here](https://docs.docker.com/toolbox/toolbox_install_windows/).
- For Ubuntu
	- Install **Docker**, instructions are [here](https://www.youtube.com/watch?v=V9AKvZZCWLc).

### Operating Instructions

- Fork this repository
	- "Forking" adds a copy of [adisakshya/JustShareIt](https://github.com/adisakshya/JustShareIt/) repository to your GitHub account as `https://github.com/YourGitHubUserName/JustShareIt`
- Download or clone your forked repository
	- You can clone the repository executing below command in a location of your choice of your system.
	```$ git clone https://github.com/YourGitHubUserName/JustShareIt.git```
- That's it your almost done, now in the repository root, run the following command
```$ sh start.sh```, this will start all the JustShareIt services.
- After successful startup, the app will be available
	- At ```http://<your-ip-address>:5001/JustShareIt/admin/dashboard``` for the admin (sender).
	- At ```http://<your-ip-address>:5001/JustShareIt/user``` for the user (receiver).
	- Admin (sender) can add the files to share from admin-dashboard.
	- Users can access shared files from user-dashboard, after access-request is approved by the admin.
- To stop the services run, ```$ sh stop.sh```
	- Adding a "-r" argument like ```$ stop.sh -r```, cleans all the app containers & volume mounts, and reset the app to default configurations.
	- Executing the above command without "-r", simply stops all services and don't reset to default.
- To restart the app, (while the app is still running) use the following command
```$ sh restart.sh```
	- Adding a "-r" argument like ```$ restart.sh -r```, cleans all the app containers & volume mounts, and reset the app to default configurations and then start the servcies again.
	- Executing the above command without "-r", simply stops all services and don't reset to default and start the services again.

#### Developer Guide

- Application Services: ```docker-compose.yml```
- API Service: ```/app```
	- API utilities: ```/app/utils```
	- Requirements: ```/app/requirements.txt``` 
- Redis Service: ```/redis```
	- Redis configuration file: ```/redis/redis.conf```
- Database Service: ```/db```
	- Default dump file: ```/db/init.sql```
- Webserver: ```/webserver```
	- Blueprints (defining client & admin functions): ```/webserver/blueprints```
	- Static Files: ```/webserver/static```
	- Web Page Templates: ```/webserver/templates```
	- Webserver utilities: ```/webserver/utils```
	- Requirements: ```/webserver/requirements.txt``` 
- Tests: ```/test```
	- Database (check if db is available): ```/test/db.sh```

## Suggest Features

Is a feature you care about currently missing? Make sure to browse the [issue tracker](https://github.com/adisakshya/JustShareIt/issues?q=is%3Aissue+is%3Aopen+sort%3Areactions-%2B1-desc) and add your ":+1:" reaction to the issues you care most about, as we also use those reactions to prioritize issues.

## Contributing

There are multiple ways to contribute to this project, read about them [here](https://github.com/adisakshya/JustShareIt/blob/master/.github/CONTRIBUTING.md).

## License

All versions of the app are open-sourced, read more about this [LICENSE](https://github.com/adisakshya/JustShareIt/blob/master/LICENSE).
