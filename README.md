### Environment Configuration ###

Before starting the project, you need to set up the environment variables for your local machine.

Create a new file named .env in the root directory of the project.

Add the following environment variables to the .env file:

MONGODB=mongodb://<YOUR_DATABASE_INFOS>

TOKEN=<YOUR_SECRET_KEY>

Note: Replace <YOUR_DATABASE_INFOS> with the actual values for your database.

Important: The TOKEN value should be set to your own secret key.

Save the .env file and restart the server to make sure the environment variables are properly set.

### Back end Prerequisites ###

You will need to have Node and `npm` installed locally on your machine.

### Back end Installation ###

- Clone this repo
- From the "web-developer-P6" folder of the project, run `npm install`. You 
can then run the server with `npm start`
- From the "backend" folder of the project, run `nodemon server`

The server should run on `localhost` with default port `3000`. If the
server runs on another port for any reason, this is printed to the
console when the server starts, e.g. `Listening on port 3001`.

Open [http://localhost:4200](http://localhost:4200) to view it in your browser (modify port url if necessary).

The page will reload when you make changes.

## Table of contents

-  [Overview](#overview)
   -  [Work done](#work-done)
   -  [Links](#links)
-  [My process](#my-process)
   -  [Built with](#built-with)
   -  [Useful resources](#useful-resources)
-  [Author](#author)

## Overview

### Work done
All the frontend was already provided.
The objective was to build the backend ('backend" folder) from scratch, to allow the application to work.

### Links

-  Live Site URL: use `npm start` and then open [http://localhost:4200](http://localhost:4200) to view it in your browser (modify port url if necessary)

## My process

### Built with

-  JavaScript
-  Node.js
-  Express
-  MongoDB

## Author

-  Linkedin - [Anthony Chanty](https://www.linkedin.com/in/anthony-c-a925a6172/)
-  Frontend Mentor - [@achanty](https://www.frontendmentor.io/profile/AChanty)
