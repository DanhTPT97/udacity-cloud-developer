## <b>This project is the Capstone Project for the Cloud Deveploper Nanodegree course</b></br>

## Description
Based on the code from the Project 4 - Serverless Application provided by Udacity Cloud Developer course. 
This application is a products management application provided ways to control the information and quantity.
The application include backend serverless and react front-end.

# Serverless

The `backend` folder contains simple Products management application using AWS Lambda and Serverless framework.

# React

The `client` folder contains a web application that can use the API that should be developed in the project.

# How to run the application

## Backend

To run unit tests and deploy/re-deploy deploy an application  to serverless:

```
cd backend

npm run deploy-test
```

To run backend unit tests only:

```
cd backend

npm test
```
## Frontend

Run the following commands:

```
cd client

npm install

npm run start
```

# Functionality of the application

## Create/Delete product
To create new product, click on the green button "Add product" then provide these fields below:

- name: name of the product
- description: brief description of product
- price: product price
- quantity: quantity of the product

You can also delete product info by clicking on the red button on each created product row.

## Upload product image
This action is done by clicking on the blue button and provide the image file. This file will then be uploaded to S3 bucket and show on the page.