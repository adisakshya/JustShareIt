<p align="center">
    <img class="rounded-circle" src="https://github.com/adisakshya/JustShareIt/blob/master/webserver/static/img/logo.png" height="150px">
</p>

[![under development](https://img.shields.io/badge/UnderDevelopment-yes-green.svg)]()
[![release](https://img.shields.io/badge/release-1.0.0-green.svg)](https://github.com/adisakshya/JustShareIt/releases)
[![maintenance](https://img.shields.io/badge/maintained%3F-yes-green.svg)]()
[![made-with-python](https://img.shields.io/badge/python-3.7.3-blue.svg)]()
[![dockerized](https://img.shields.io/badge/dockerized-yes-green.svg)](https://github.com/adisakshya/JustShareIt/blob/master/docker-compose.yml)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/adisakshya/JustShareIt/blob/master/LICENSE)
[![Website](https://img.shields.io/badge/website-down-red.svg)](https://adisakshya.github.io/JustShareIt)
[![Tests](https://img.shields.io/badge/Tests-no-red.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/adisakshya/JustShareIt/pulls)
[![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)]()

---

JustShareIt, excellent open-source sharing app with fast cross-platform transfer speed, free of online feeds.
It enables sharing files including photos, videos, music, contacts, apps and any other files, no matter of what size.


## Setup Instructions

Step 1: Download Docker

Step 2: Clone the repo ```$ git clone https://github.com/adisakshya/JustShareIt.git```

Step 3: Run the following command to start the application ```sh start.sh```

### Developer Guide


#### For Windows/Mac

To Access JustShareIt on ```http://<ip-address>:5001 ...```

Follow the steps below:

- docker-machine stop default
- Open VirtualBox Manager
- Select your Docker Machine VirtualBox image (e.g.: default)
- Open Settings -> Network -> Advanced -> Port Forwarding
- Add your app name, the desired host port and your guest port
    - HOST PORT: ```<ip-address>```
    - GUEST PORT: ```Blank```
    - HOST PORT: 5001
    - GUEST PORT: 5001
- docker-machine start default
