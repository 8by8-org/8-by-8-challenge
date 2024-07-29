# 8by8 Challenge

Welcome to the repository for the 8by8 Challenge! The 8by8 Challenge is a web application intended to foster civic engagement by allowing users to perform various actions such as registering to vote or signing up for election reminders in exchange for badges. Users can also share their challenge with friends via social media. When an invited user registers to vote, or takes another similar action, the inviter also receives a badge. When a user receives 8 badges within 8 days, they have completed their challenge and will earn a reward.

Currently, we are working on migrating the existing application to Next.js and TypeScript, as well as fixing bugs, improving accessibility, etc. For the existing application's source code, please visit [https://github.com/8by8-org/web-app](https://github.com/8by8-org/web-app).

## Requirements

You must have Node.js version 18.17+. Docker is strongly recommended for local development with Supabase, but you may also create your own Supabase project if you cannot install Docker.

## Getting Started

To run the application locally, fork the repository and clone the fork to your machine. In the terminal, navigate into the project directory and run `npm install`. This will install the project's dependencies.

Copy the contents of .env.example into a file named .env.

Replace the values of the variables inside .env with appropriate entries. Values for turnstile keys can be found here: https://developers.cloudflare.com/turnstile/troubleshooting/testing/

Values for Supabase variables will be displayed in the terminal after running either `npm run supabase-dev:start` or `npm run supabase-test:start`. These values will be
the same for both commands, and will be the same each time you run these commands.

## Contributing

New engineers should review [CONTRIBUTING.md](https://github.com/8by8-org/8by8-challenge/blob/development/CONTRIBUTING.md) for details about the recommended workflow and tools.

## Resources

- [Figma prototype](https://www.figma.com/design/TP1ZMtd6ykIjNql1t0OBoA/8BY8_PROTO_V2)
- [Existing application source code](https://github.com/8by8-org/web-app)
- [Deployed application](http://challenge.8by8.us/)
- [Contributing](https://github.com/8by8-org/8by8-challenge/blob/development/CONTRIBUTING.md)
- [Style Guide](https://github.com/8by8-org/8by8-challenge/blob/development/STYLE_GUIDE.md)
