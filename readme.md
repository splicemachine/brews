# BREWS

This repository contains an example Splice Machine use-case using a React Frontend and a Node.js Backend. The frontend uses a plain React-based stack with no official state management framework as of yet. The backend is written in TypeScript and makes use of [node-jdbc][3] to communicate with a Splice Machine instance.

## Installation

Please complete the [Prerequisites](#prerequisites) first.

There are three deployment strategies:
- [Local Development](#local-development)
- [Local Docker Deployment](#local-docker-deployment)
- [Production Docker Deployment](#production-docker-deployment)

You will need a Splice Machine JDBC URL to configure the application. If you created a Splice Machine database with the Cloud UI, your JDBC URL will be in your Cluster Ready email, or can be found on that Cluster's page in the Cloud Manager. For other environments, see our documentation at doc.splicemachine.com for JDBC URL information.

Before running or installing, you must create the file `server/environment.ts`. There is an example of this file at `server/environment.example.ts`. 

# Prerequisites
This repository was developed on MacOS v10.12.6 (16G1114). The development workflow has been tested only for this environment.

Make sure you have [Node.js installed][4].

This was developed with `node@v8.9.3` and `npm@5.6.0`.

```bash
npm install -g nodemon
```

### Local Development
#### Server
In one terminal:
```bash
cd server
npm install
npm start
```

#### Client
In another terminal:
```bash
cd client
npm install
npm start
```

Navigate to: http://localhost:8080

**Note**: For now, I have removed the preparation step from the ATP Demo workflow. If you are running against a cluster that does not have the ATP schema or data, please navigate to [http://localhost:3000/api/v1/prepare][7] in your browser.

### Local Docker Deployment
[Install Docker][5].

```bash
make
docker build .
```

You should see something like:
```
Successfully built [image]
```

Take that image tag and run with the following command:
```bash
docker run -d \
    -p 3000:3000 \
    -e "ATP_JDBC_URL=[ATP_JDBC_URL]" \
    -e "MODELING_JDBC_URL=[MODELING_JDBC_URL]" \
    [image]
```

And navigate your browser to [`http://localhost:3000/`][6]

### Production Docker Deployment
You will need to produce the [local docker artifact](#local-docker-deployment) to push it to production.

There is an example `marathon.json` in `/config`. Use that to start `brews` as a Marathon App.

**Note:** Make sure you configure the proper `env.ATP_JDBC_URL` and `env.MODELING_JDBC_URL`.

## Acronym
- **B**abel
- **R**eact
- **E**xpress
- **W**ebpack
- **S**plice Machine

## Example Test Case
### Multi-Line ATP
We can add the following parameters to get a view of when a multi-line order will be available to promise. First, we add the lines of inventory that represent the proposed order we would like to 'promise'. Then we can set the target date by which the order must be ready. The output represent when each of the items will be 'Available to Promise' and the maximum of those values is the earliest we can promise the proposed order.

For example:
#### Input Parameters
##### Proposed Order
|`INV_ID`|`QTY`|
|-|-|
|`100`|`400`|
|`200`|`400`|
|`600`|`4000`|

##### Target Date
`2016-10-15`

#### Output
##### Order ATP
|`COMBINED_ATP`|
|-|
|`2016-12-20`|

##### Line Item ATP
|`INV_ID`|`ATP_ON_TARGET_DATE`|`ATP_DATE`|
|-|-|-|
|`600`|`0`|`2016-12-20`|
|`200`|`0`|`2016-11-19`|
|`100`|`0`|`2016-11-23`|

[1]: https://github.com/scotch-io/hello-world-react
[2]: https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel
[3]: https://github.com/CraZySacX/node-jdbc
[4]: https://nodejs.org/en/download/
[5]: https://docs.docker.com/install/
[6]: http://localhost:3000/
[7]: http://localhost:3000/api/v1/prepare
