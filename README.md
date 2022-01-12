# RedBull
Light-weight real time dashboard for viewing bull jobs on redis.

This dashboard helps you to visualize the jobs as well as perform some actions on the jobs like retry , delete, etc.

## Notes

- You must have have [Bull](https://github.com/OptimalBits/bull) and [Redis](https://redis.io/) installed in your projects

## Getting Started ##
## Install and run red bull

The following are the different ways to install **red-bull**.

### From npm:
---

 - Install the module globally using the command

```
 npm install -g @vinay-kumar/red-bull
 ```

 - Then use the following command to start the application

 ```
 red-bull
 ```

 - By default application listens on port 5000
 - To start application with custom port try the following command by passing specified command line arguments
 ```
red-bull port:<valid-port-number>
ex: red-bull port:5050
 ```

 - By default application will try to connect to redis with localhost and default port 6379.
 - To connect application with custom redis host & redis port try the following command by passing specified command line arguments
 ```
red-bull REDIS_HOST:<redis-host-ip> REDIS_PORT:<redis-port-number>
ex: red-bull REDIS_HOST:127.0.0.1 REDIS_PORT:6379
 ```


### From github:
---
 - First of all, clone the **red-bull** repository using the command ```git clone https://github.com/vinaykumarvnrb4u/RedBull``` or download the zip file from [here](https://github.com/vinaykumarvnrb4u/RedBull/archive/refs/heads/master.zip).
 - Change the directory to red-bull ```cd RedBull```
 - Install all the dependencies ```npm install```
 - Start the application using ```npm start``` command
 - To start application with custom port try the following command by passing specified command line arguments
 ```
npm start port:<valid-port-number>
ex: npm start port:5050
 ```
 - To start application with custom redis host & redis port try the following command by passing specified command line arguments
 ```
npm start REDIS_HOST:<redis-host-ip> REDIS_PORT:<redis-port>
ex: npm start REDIS_HOST:127.0.0.1 REDIS_PORT:6379
 ```
<br>

### Working preview
---
<br>

![red-bull](https://user-images.githubusercontent.com/55359359/136439510-f0fc7214-4105-4be3-a5d0-c99d25910e67.gif)

