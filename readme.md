# BREWS

## Acronym
- **B**abel
- **R**eact
- **E**xpress
- **W**ebpack
- **S**plice Machine

## Run
```bash
gulp
```

## Build
```bash
docker build .
docker tag [image output] splicemachine/brews
docker push
```

There is an example `marathon.json` in `/config`. Use that to start `brews` as a Marathon App.

**Note:** Make sure you configure the proper `env.JDBC_URL`.

## Tutorials
These are the ones that really helped
- [Scotch.io][1]
    - [code for that][2]


[1]: https://github.com/scotch-io/hello-world-react
[2]: https://scotch.io/tutorials/setup-a-react-environment-using-webpack-and-babel
