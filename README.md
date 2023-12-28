## Configs

<ul>
NGROK
<li><h3> download and unzip to folder ~/ngrok</h3></li>
www.ngrok.com

``` bash
# run first time
./ngrok config add-authtoken <authtoken>
```
<h5>Share Access to Local Web Server:</h5>

``` bash
./ngrok <protocol> <port>

# eg

/ngrok http 3000
```

<h5> free version should return something like:</h5>

``` bash
Session Status                online

Account                       example@gmail.com (Plan: Free)
Version                       3.4.0
Region                        region (re)
Latency                       50ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://xxxx-xx-xx-xx-xxx.ngrok-free.app -> http://localhost:3000  
```
</ul>