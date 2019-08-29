# insurassistant

Insurassistant is a web (written in React JS) and mobile application (written in React Native).

Thanks to the mobile application, you can talk to a chatbot and / or a human. On the other hand, the web application allows an agent to talk to the users using the mobile application.

## Running the application

Firstly, you have to change the credentials  and set your own Cloudant + IBM Watson Assistant + IBM Watson Tone Analyser API KEY

```bash
mv server/.env.example server/.env
```

Secondly, you can run the different part of the application

To run the server  :
```
cd server && npm install && npm start
```

To run the mobile application :
```
cd mobile && npm install && expo start
```

To run the web application :
```
cd mobile && npm install && npm start
```

## Web application screenshot  :

<div align="center">
  <img src="https://github.com/maxgfr/insurassistant/blob/master/.github/web/screen1.png"/>
</div>

## Mobile application screenshot :

<div align="center">
  <img src="https://github.com/maxgfr/insurassistant/blob/master/.github/mobile/screen1.jpg" height="540" width="280"/>
  <img src="https://github.com/maxgfr/insurassistant/blob/master/.github/mobile/screen2.jpg" height="540" width="280"/>
  <img src="https://github.com/maxgfr/insurassistant/blob/master/.github/mobile/screen3.jpg" height="540" width="280"/>
  <img src="https://github.com/maxgfr/insurassistant/blob/master/.github/mobile/screen4.jpg" height="540" width="280"/>
</div>
