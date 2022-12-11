## <b>This project is the final Project for the Cloud Deveploper Nanodegree course 
</b></br>


### Based on the code from the Project 4 - Serverless Application, in the project, I have already added the possible unit tests for backend lambda and helpers functions.
</br>

# Serverless TODO

To implement this project, you need to implement a simple TODO application using AWS Lambda and Serverless framework. Search for all comments starting with the `TODO:` in the code to find the placeholders that you need to implement.

# Functionality of the application

This application will allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.
   
# Functions to be implemented

Implemented the following functions and configure them in the `serverless.yml` file

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetTodos` - should return all TODOs for a current user. A user id can be extracted from a JWT token that is sent by the frontend

* `CreateTodo` - should create a new TODO for a current user. A shape of data send by a client application to this function can be found in the `CreateTodoRequest.ts` file

* `UpdateTodo` - should update a TODO item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateTodoRequest.ts` file

It receives an object that contains three fields that can be updated in a TODO item:

The id of an item that should be updated is passed as a URL parameter.

* `DeleteTodo` - should delete a TODO item created by a current user. Expects an id of a TODO item to remove.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a TODO item.

All functions are already connected to appropriate events from API Gateway.

Unit tests for `GetTodos`, `CreateTodo`, `UpdateTodo`, `DeleteTodo`, `GenerateUploadUrl` functions and all related.

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.


# How to run the application

## Backend

To run backend unit tests only:

```
cd backend

npm test
```

To run unit tests and deploy/re-deploy deploy an application  to serverless:

```
cd backend

npm run deploy-test
```

## Frontend

Run the following commands:

```
cd client

npm install

npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project.