# JustShareIt

### For Windows/Mac

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