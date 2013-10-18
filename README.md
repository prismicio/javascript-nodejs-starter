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

Install the dependencies and run the server:

```
$ npm install
$ node app
``` 

### Licence

This software is licensed under the Apache 2 license, quoted below.

Copyright 2013 Zengularity (http://www.zengularity.com).

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.