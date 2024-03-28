# E-Commerce App

## Project Description

- A mobile e-commerce application designed to provide an easy and convenient shopping
experience for users.
- Built using the popular cross-platform technology, React Native, to ensure compatibility
- Offers two user profiles: normal users and administrators, each with its own set of
features and capabilities

## Features

#### For Normal Users
- Browse through a wide selection of products, with the ability to filter and search based
on various criteria such as category, price, and product name.

- Choose between two payment options: cash on delivery or online payment via Stripe, a
well-known and secure payment platform.
- Conveniently place orders and monitor their status through the app.


#### For Administrators Dashboard Features:
- A powerful and intuitive dashboard exclusively for administrators, allowing them to
manage the product catalog and monitor orders.
- Add new categories, create new products, edit existing products and product images,
and manage product availability.
- Monitor all orders and manage order processing, from receiving the order to delivering
the product.
- Visualize the number of in-stock and out-of-stock products using a pie chart, providing a
quick overview of their inventory and helping to make informed decisions.



## Prerequisites

- Node.js
- React Native CLI
- iOS or Android development environment setup
- mongoDB
- React

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Saurabh-Dey/mern-react-native-ecom-server.git   
2. Navigate to the Repository Directory Change into the directory that was created by the clone command:
   ```sh
   cd your-repository-directory
3. Install Dependencies Run the following command to install all the dependencies listed in the package.json file:
   ```sh
   npm install
4. Start the Node Server If the repository has a start script defined in the package.json, you can start the server using:
   ```sh
   npm start
5. Otherwise, you may need to run the server file directly with Node. For example:
   ```sh
   node server.js
Remember to check the README.md file in the GitHub repository for any specific instructions related to the project you’re running. Also, ensure that you have Node.js and npm installed on your machine before executing these commands

### Make Sure to Create a config.env file in backend/config directory and add appropriate variables in order to use the app.

Essential Variables PORT= DB_URI = STRIPE_API_KEY= STRIPE_SECRET_KEY= JWT_SECRET= JWT_EXPIRE= COOKIE_EXPIRE= SMPT_SERVICE = SMPT_MAIL= SMPT_PASSWORD= SMPT_HOST= SMPT_PORT= CLOUDINARY_NAME CLOUDINARY_API_KEY CLOUDINARY_API_SECRET fill each filed with your info respectively
