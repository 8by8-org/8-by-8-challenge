# 8by8 Challenge

Welcome to the repository for the 8by8 Challenge! The 8by8 Challenge is a web application intended to foster civic engagement by allowing users to perform various actions such as registering to vote or signing up for election reminders in exchange for badges. Users can also share their challenge with friends via social media. When an invited user registers to vote, or takes another similar action, the inviter also receives a badge. When a user receives 8 badges within 8 days, they have completed their challenge and will earn a reward.

Currently, we are working on migrating the existing application to Next.js and TypeScript, as well as fixing bugs, improving accessibility, etc. For the existing application's source code, please visit [https://github.com/8by8-org/web-app](https://github.com/8by8-org/web-app).

## Requirements

You must have Node.js version 18.17+ and the Firebase CLI installed to run the local development server.

## Getting Started

To run the application locally, fork the repository and clone the fork to your machine. In the terminal, navigate into the project directory and run `npm install`. This will install the project's dependencies.

Before running the local development server, you will need to create a .env file. You can do this by running the following command:

```
npm run init-dev-env
```

This will create a .env file if it does not already exist, or update it to ensure all required env variables are present. None of the values in this .env file point
to actual resources.

You can now run the local development server with the command `npm run dev`.

## Contributing

New engineers should review [CONTRIBUTING.md](https://github.com/8by8-org/8by8-challenge/blob/development/CONTRIBUTING.md) for details about the recommended workflow and tools.

## Resources

- [Figma prototype (see "Mocks, December version" under pages)](https://www.figma.com/file/0Q2tpQqi9sYcIA3ZyiX3PF/8BY8_POD_Jul30)
- [Existing application source code](https://github.com/8by8-org/web-app)
- [Deployed application](http://challenge.8by8.us/)
- [Contributing](https://github.com/8by8-org/8by8-challenge/blob/development/CONTRIBUTING.md)
- [Style Guide](https://github.com/8by8-org/8by8-challenge/blob/development/STYLE_GUIDE.md)
