## Starter for NodeJS projects

This is a blank [NodeJS](http://nodejs.org/) (using [express](http://expressjs.com/)) project that will connect to any prismic.io repository. It uses the prismic.io JavaScript developement kit, and provide a few helpers to integrate with [express](http://expressjs.com/).

### How to start?

Edit the `prismic-configuration.js` file to make the application point to the correct repository:

```
exports.Configuration = {

  apiEndpoint: 'https://lesbonneschoses.prismic.io/api',

  // -- Access token if the Master is not open
  // accessToken: 'xxxxxx',

  // OAuth
  // clientId: 'xxxxxx',
  // clientSecret: 'xxxxxx',
  ...
```

To get the OAuth configuration, go to the _Applications_ panel in your repository settings, and create an OAuth application to allow interactive sign-in. Just create a new application, fill the application name and the callback URL (`localhost` URLs are always authorized, so at development time you can omit to fill the Callback URL field), and copy/paste the `clientId` & `clientSecret` tokens.

Now, install the dependencies and run the server:

```
$ npm install
$ node app
``` 

### Deploy your NodeJS application

An easy way to deploy your NodeJS application is to use [Heroku](http://www.heroku.com). Just follow these few simple steps once you have successfully signed up and installed to Heroku toolchain:

Create a `Procfile` file at your application root, to declare the server command:

```
web: node app.js
```

Create a new Heroku application

```
$ heroku create
```

Push your code to heroku:

```
$ git push heroku master
```

Ensure you have at least one node running:

```
$ heroku ps:scale web=1
```

You can now browse your application online:

```
$ heroku open
```

### Licence

This software is licensed under the Apache 2 license, quoted below.

Copyright 2013 Zengularity (http://www.zengularity.com).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.