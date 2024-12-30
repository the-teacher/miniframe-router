# How to develop the project

## Run Tests in Docker Container

### Pre-requisites

- Docker
- Docker Compose
- Make

### 1. Clone the project

```bash
git clone https://github.com/the-teacher/miniframe-router.git
```

### 2. Run test in container

```bash
make test
```

### 3. You will see the output like this:

```bash
$ make test
make up
docker-compose up -d

[+] Running 2/2
 ✔ Network miniframe_router_default  Created                                                                                                              0.0s
 ✔ Container miniframe_router-app-1  Started                                                                                                              0.3s
make install
docker-compose exec app yarn install
yarn install v1.22.22
[1/4] Resolving packages...
success Already up-to-date.
Done in 0.19s.

docker-compose exec app yarn test
yarn run v1.22.22
$ jest
 PASS  src.ts/tests/utils.test.ts
 PASS  src.ts/tests/index.test.ts

Test Suites: 2 passed, 2 total
Tests:       18 passed, 18 total
Snapshots:   0 total
Time:        2.622 s
Ran all test suites.
Done in 3.34s.

make down
docker-compose down
[+] Running 2/1
 ✔ Container miniframe_router-app-1  Removed                                                                                                             10.1s
 ✔ Network miniframe_router_default  Removed
```

## Get into the container

### 1. Clone the project

```bash
git clone https://github.com/the-teacher/miniframe-router.git
```

### 2. Run the shell

```
make shell
```

### 3. You will see the output like this:

```bash
root@564b967d49fa:/app#
```

### 4. Do whatever you want

```bash
yarn test
```

```bash
yarn build

yarn run v1.22.22
$ node build.js
Build complete
Done in 0.09s.
```
