# Give it a try

Make sure your development server is started. We will test a few routes to see how this first feature works on our API.

## Creation of the first entities

Let's make a first call to our API, through [Postman](https://www.postman.com) or [Insomnia](https://insomnia.rest) for example:

![IMAGE POSTMAN GET /cars => tableau vide](https://via.placeholder.com/800x450)

:::tip
If you analyze the response headers, you may see a `X-Total-Count` header that contains the total number of entities that match your search (regardless of your pagination etc).
:::

The result is an empty table. This is normal, we have not yet created a single car in the database. So here we go, let's create it.

![IMAGE POSTMAN POST /cars => création de voiture](https://via.placeholder.com/800x450)

As you can see, the car has been created (check the status of the response is `201 Created`), it has a defined ID and all the information we have passed and respected in relation to our DTO and serialization class.

Now let's try to create another car but forgetting some fields or forcing false fields:

![IMAGE POSTMAN POST /cars => création de voiture en 422](https://via.placeholder.com/800x450)

You can see that the status of the response is set to `422 Unprocessable Entity` to say that the information passed in the body does not match the DTO. Look carefully at the error details, normally everything is explained.

We invite you to correct your body to create a second car in the database. The best is that the data is not similar to the first one for the continuation of our tests. **Try to create several to populate your database**. Once this is done, let's try to recover our persistent data:

![IMAGE POSTMAN GET /cars => tableau avec 2 cars](https://via.placeholder.com/800x450)

Great, we created our first entities, with success.

## Fetch & update specific entity

Get the ID of one of your cars, and make the following call to get only the data related to the ID:

![IMAGE POSTMAN GET /cars/:id => objet d'une voiture](https://via.placeholder.com/800x450)

You can retrieve the data of a particular car. Now let's try to update it:

![IMAGE POSTMAN PATCH /cars/:id => update d'une voiture](https://via.placeholder.com/800x450)

We respected the update DTO which is a bit different from the creation DTO and we could update our Car entity. Note that we use the `PATCH` method to update the entity, unlike the `POST` method for the creation of an entity.

Now you know how to create, update and fetch entities.

## Filter, pagination & other queryparams

### Filter the data

We will continue our tests using the integrated filter & paging system of the Kodexo CRUD APIs. The filter/pagination system works quite simply, through queryparams of the urls.

To filter, use the keyword in queryparams: `$filter` followed by a JSON that will contain your query.

![IMAGE POSTMAN GET /cars => tableau avec brand identique](https://via.placeholder.com/800x450)

When you ask for a particular brand, only the well-sorted data stands out and is given to the response.

You can use several fields in the `$filter`. You also have several "op" keywords to be more precise in your queries (`$or, $and, $not, $ne...`). Note that you can chain your queries. See the Filtering in Usage Guide for more information.

:::warning
Your `$filter` JSON must be **stringified**. If you send a JS object, the API will return a JSON parsing error.
:::

### Pagination

With Kodexo CRUD, you can use offset pagination.

Only 2 keywords to put in your queryparams: `$limit` and `$offset`. The behavior is the same as any offset pagination: you pass the number of results you want per page in the `$limit` parameter and the number of entities you want to skip on the `$offset` parameter.

![IMAGE POSTMAN GET /cars => tableau avec limit à 1, offset de la page 1](https://via.placeholder.com/800x450)

![IMAGE POSTMAN GET /cars => tableau avec limit à 1, offset de la page 2](https://via.placeholder.com/800x450)

:::tip
Remember that we have the `X-Total-Count` header that only returns the total number of entities in your current search. Useful to calculate the total number of pages to display in your paginator for example.
:::

:::info
We are looking to offer **Cursor-based pagination** in the future.
:::

---

Congratulations, you have completed the tutorial. Don't hesitate to browse the documentation to go further, there are many other principles to understand, to master Kodexo and simplify your developments.
