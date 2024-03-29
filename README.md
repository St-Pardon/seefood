# SeeFood

A Real-Time resturant chatbot application to assist customers in placing orders for their preferred meals.

## Contents
- [Objective](#objective)
- [Purpose](#purpose)
- [Getting Started](#getting-started)
    - [Prerequisite](#prerequisite)
    - [Setup](#setup)
- [Usage](#usage)
- [Tasks](#tasks)
- [Tools](#tools)
- [Deployment](#deployment)
- [Authors](#author)
- [Contributions](#contributions)

___
___

## Objective
An application to simplyfy the ability for customers to order from the response by sending options and the backend would have a chat app that would respond to the options in real-time.

## Purpose
A project submitted in partial fulfilment of Higher Diploma Certification in Software Engineering at [AltSchool Africa](https://www.altschoolafrica.com/).

> To join AltSchool Africa, join the [waitlist](https://www.altschoolafrica.com/waitlist?school=engineering) and when the application is open be sure to use the code **ALT/SOE/022/1344** as referral to get discount.

## Getting Started
### Prerequisite
To succefully run and test this application, you'll be needing the following:
- Web Browser - A application to help you interact with the frontend (e.g chrome, edge, opera)
- Node - A javascript runtime enviroment
- IDE/Text Editor - An application to allow you interact with the source code (e.g VS code, atom, sublime text, emacs)
- CLI - Command Line Interface to enable you clone and start the server on your local machine (e.g terminal for mac, git bash, WSL or CMD for windows)

### Setup
To start up the application, follow the following steps
- Step 1: Open your terminal/CLI
- Step 2: Clone the repository
    ```sh
    git clone https://github.com/St-Pardon/seefood.git
    ```
- Step 3: Navigate into the project directory/folder
    ```sh
    cd seefood/
    ```
- Step 4: Switch to the dev branch to run locally
    ```sh
    git checkout dev
    ```
- Step 5: Install all the project dependencies
    ```sh
    npm install
    ```
- Step 6: Start the server
    ```sh
    npm start
    ```
- Step 7: Open the url displayed on the terminal in your web browser and explore the application

## Usage
The application is really simple to use, but for better understanding, here is a walk through

- Firstly, lauch locally or use the [deployed](#deployment) demo. You'll land on a page to provide basic identification.
![](./demo/Welcome.png)

- When your `Name` and `Username` have been provided, you'll be redirected to the chat interface with a welcome message and some instruction on how to engage.
![](./demo/chatbot_interface.png)

- You can get started by clicking on the prompt corresponding to your need or typing it directly into the input field.

- When an input is typed or prompt clicked, the user immediately gets a response from the bot. if the input is correct the right response is displayed and when the input is wrong, an error message is displayed.
![](./demo/prompts.png) 

- When a food is selected, the user is prompted to either confirm or cancel the order.
![](./demo/confirm_order.png) 

## Tasks
The tasks expected to be achieved for the project are included [here](./Tasks.md)

## Tools
The tools use in making the application includes
- Client: HTML, CSS, JavaScript, Socket.io-client
- Server: Node, Socket.io, Express, Nodemon, dotenv
- Editor: VS Code
- Version Control: Git and Github

## Deployment
Application is live at [SeeFood](https://seefood-ryww.onrender.com) 🚀🚀🚀

## Author
Onu Onyedikachi P.

## Contributions
Coming Soon
