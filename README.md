# NestJS application for a job test in ArtX

## Intro

Assumptions I've made during designing:

- the App is distributed, so throttler needs single source of truth;
- TypeScript and NestJS in particular is not the best part in my knowledge, so I should be focused on the App features, rather than bringing everything in line with best practices;
- I did not take into account the configuration features for production since it is a demo app.

I've dropped some test cases due to time limitation. Also, a microservice is needed to clean up obsolete aggregations to increase performance of `ThrottlerService`.

## How to start and test

App depends on PostgreSQL and Redis instances. For convenience I've prepaired `docker-compose.yml` file which will work out-of-the-box with `.env.example`.

The rest is the same as in default NestJS application -

```
npm run start:dev
```

to start appplication, and -

```
npm run test:e2e
```

to run `e2e` tests.
