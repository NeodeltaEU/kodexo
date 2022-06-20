# Give it a try

Make sure your development server is started. We will test a few routes to see how this first feature works on our API.

## Creation of the first entities

Let's make a first call to our API, through [Postman](https://www.postman.com) or [Insomnia](https://insomnia.rest) for example:

**IMAGE POSTMAN GET /cars => objet vide**

:::tip
If you analyze the response headers, you may see an `X-Total-Count` header that contains the total number of entities that match your search (regardless of your pagination etc).
:::

The result is an empty table. This is normal, we have not yet created a single car in the database. So here we go, let's create it.

**IMAGE POSTMAN POST /cars => création de voiture**
