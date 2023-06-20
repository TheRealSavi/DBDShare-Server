
# DBD Share 

DBD Share is a web application for people to share and save their favorite builds for the game "Dead by Daylight"

Essentially this is a full-stack CRUD application that I intended to host a production version soon.



## ⚙ Tech Stack 

**Client:** React, TailwindCSS, TypeScript, Vite

**Server:** Node, Express, Mongoose, Passport


## ✨ Features 

- Sign in through Steam
- Sign in through Google
- Responsive design for desktop and mobile
- Users and posts stored in database
- RESTful API
## 🗺 Roadmap 

- Light/Dark mode toggle

- Add additional tools for integrated in game calculators

- Implement frontend and backend cache

- Implement API request for perk images to reduce load times

## ✏ Authors 

- [@John Gibbons](https://www.github.com/TheRealSavi)



## 📷 Screenshots 

![App Screenshot](https://i.imgur.com/yTjSiDR.png)

![App Screenshot](https://i.imgur.com/wUWxBgW.png)

![App Screenshot](https://i.imgur.com/ffCheCw.png)

![App Screenshot](https://i.imgur.com/xTYNmJi.png)


## 💾 Run Locally

Clone the projects

```bash
  git clone https://github.com/TheRealSavi/DBDShare-Client
```

```bash
  git clone https://github.com/TheRealSavi/DBDShare-Server
```

Go to the project directories

```bash
  cd DBDShare-Client
```
```bash
  cd DBDShare-Server
```

Install dependencies (for each)

```bash
  npm install
```

Start the client

```bash
  npm run dev
```
Start the server

```bash
  npm run start
```


## 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Client:

`REACT_APP_API_URL`

Server:

`GOOGLE_CLIENT_ID`

`GOOGLE_SECRET`

`STEAM_API_KEY`

`SESSION_SECRET`

`CLIENT_URL`

`SERVER_URL`

`MONGODB_CONNECTION`

## ⚖ License

[MIT](https://choosealicense.com/licenses/mit/)

