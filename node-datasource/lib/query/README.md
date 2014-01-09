## xtuple-query

Create, validate, and translate various forms of XT datasource query object.

### 0. Concept
xTuple client applications send payload objects to the xTuple server in order
to communicate. **This API is concerned with properly setting the value of
`payload.query`.**

The xtuple datasource accepts queries from the following avenues:

  - REST
  - socket.io
  - internal (programmatically)

They can be of different types:

  - parameterized selector
  - free-text search
  - dispatch function invocation
  - etc?

This library unifies these client and server-side concerns with a simple API
that exposes exactly two methods: `isValid()` and `toTarget()`.

### 1. Usage
The objects in this API can be thought of as being isometric to the
`payload.query` property and each other, in that they are all one translation
away from being equivalent.

Each `Query` type defines a `template` which validates its constructor input
according to set rules.

#### A. Server Side
The REST router uses descendants of the `SourceQuery` type to validate and
translate incoming queries. Consider:

1. Client creates a select query on some type:

        query: {
          query: {
            'customer.number': {
              EQUALS: 'TTOYS'
            },
            amount: {
              LESS_THAN: 7500
            }
          },
          orderby: {
            amount: 'desc'
          },
          maxresults: 5
        }

2. Client issues a `GET` request to the server of the form:

        api/v1alpha1/sales-order/?query[customer.number][EQUALS]=TTOYS&query[amount][LESS_THAN]=7500

2. The server validates the integrity of the request:

        var source = new RestQuery(req.query),
          target;
        if (!query.isValid()) {
          error = restQuery.getErrors();
          return res.json(error.error.code, error);
        }

3. The server translates the client request into a form accepted by the
datasource and executes the query. The target forms are of type `TargetQuery`.
In this case, `XtGetQuery` objects are accepted by `xt.get()`.

        payload.query = source.toTarget(XtGetQuery);
        db.query('get', payload);


#### B. Client Side

- TODO document
