# Exercise Tracker REST API

A microservice project from [freeCodeCamp](https://www.freecodecamp.org/)'s curriculum.

## Overview

As part of completing the freeCodeCamp [APIs and Microservices](https://www.freecodecamp.org/learn/apis-and-microservices/) certification a number of self-study projects need to be completed, and this is the final one. The curriculum is undergoing a major update so these projects are likely to change, but at the time of writing (August 2020) this is the final challenge project.

For previous challenges, I haven't done a great job of making the repository complete and self-contained, but for this one I wanted it to be properly "finished" and structured as best as it could be with the current state of my knowledge.

## Starting Materials

You are given a running [Glitch app](https://nonstop-pond.glitch.me/) as a demonstration of the intended functionality, as well as a [fairly bare repository](https://github.com/freeCodeCamp/boilerplate-project-exercisetracker/) to clone or start a new Glitch project with. The repo has a bit of noise in it from being hosted on various REPLs over the years, so I did an initial clean-up of it before starting the challenge.

## `.env`

If you're interested in cloning this repository, you'll need to set a few things in your `.env` file, both in your local environment and the target. In order to have my `.env` file read locally at run-time, rather than having to set them _literally_, I use the following `dev` script in my `package.json` and then run `npm run dev` during local development:

~~~sh
export $(cat .env | xargs) && nodemon server.js
~~~

## Git/Glitch Deployment

I wanted to use Glitch to deploy and run the final app, because the freeCodeCamp tests need something to run against and provide a pass/fail result. I borrowed and incorporated the design of a [Github-usable webhook](https://github.com/nmcardoso/glitch-github-sync/) that'll run various Git commands on the target Glitch server and update it every time I push to Github. That's obviously not necessary for local development or deployment on other infrastructure, but it's handy for Glitch and possibly other REPLs.

The webhook is located at `/git`.

## User Stories

These User Stories are supplied by freeCodeCamp and form the basis of the tests that need to pass to achieve the certification:

1. ✅ I can create a user by posting form data username to `/api/exercise/new-user` and returned will be an object with username and `_id`.
2. ✅ I can get an array of all users by getting `api/exercise/users` with the same info as when creating a user.
3. I can add an exercise to any user by posting form data `userId(_id)`, `description`, `duration`, and optionally `date` to `/api/exercise/add`. If no `date` supplied it will use the current date. Returned will be the `user` object with the `exercise` fields added.
4. I can retrieve a full exercise log of any user by getting `/api/exercise/log` with a parameter of `userId(_id)`. Return value will be the `user` object with added array log and count (total exercise count).
5. I can retrieve part of the log of any user by also passing along optional parameters of `from` & `to` or `limit`. (Date format `yyyy-mm-dd`, `limit = int`).
