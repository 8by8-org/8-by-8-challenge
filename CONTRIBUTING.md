# Contributing

## Prerequisites

New contributors should be familiar with the following languages/frameworks:

- [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Learn/JavaScript)
- [React](https://react.dev/)

Additionally, we will be using the following languages/frameworks/libraries, which contributors will be expected to become familiar with:

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Sass](https://sass-lang.com/)
- [Luxon](https://github.com/moment/luxon/) - For manipulating dates.

Finally, please take some time to familiarize yourself with the different user stories depicted in the Figma.

## Tools

To contribute, you will need the following tools installed on your machine:

- A code editor. [Visual Studio Code](https://code.visualstudio.com/) is a great option as it provides many helpful features for TypeScript development.
- [Node.js](https://nodejs.org/en) - At the time of writing, Next.js requires version 18.17 or later.
- Docker (strongly recommended, but not required. The alternative is to set up your own Supabase project.)

## Jira

You will receive an invitation to join our Jira team once you have joined the organization as engineer. You will be assigned issues via Jira. Our Slack workspace will be configured so that you can set up personalized notifications from Jira when issues are assigned to you, etc. The Kanban board for this project in Jira will also provide a high-level roadmap for this development cycle.

## Workflow

1.  Please fork this repo, and clone your fork.
2.  Follow the directions in the Getting Started section of the Readme.
3.  You will be assigned a task to complete via Jira.
4.  Once the task is complete and you have written unit tests which provide 100% code coverage, push the code to your fork.
5.  Navigate to this repository and make a PR. For more information, please see [Making a PR](#making-a-pr).
6.  Github actions will run unit tests to determine if the PR can be merged. Additionally, another team member will be required to provide a review.
7.  If all unit tests pass and the reviewer requests no changes, the PR will be merged into development and you can begin work on any other issues assigned to you. If changes are requested or the test suite does not pass, please make the necessary changes and return to step 4.

## Code Style

Please see the [Style Guide](https://github.com/8by8-org/8by8-challenge/blob/development/STYLE_GUIDE.md) for information about code style requirements.

## Making a PR

Navigate to this repository and click on "Pull requests." Click the "Create pull request" button. Select "compare across forks." For the head repository, select your fork. In the title of the PR, make sure to include the Jira issue key and the state to transition the issue into (for instance "JRA-123 #done"). This will close the issue in Jira automatically once the PR is merged. Make sure to fill in the description field in the PR and request a review from a team member.

## Further Reading

We will be using Dependency Injection and an Inversion of Control container to provide services to presentation-layer components. Presentation-layer components should not handle business logic. They should simply call methods of service classes which will handle this logic. This will help create a loosely-coupled application which is easy to understand, maintain, modify and test. Therefore, an understanding of Dependency Injection and Inversion of Control as well as SOLID design principles will be valuable for contributing engineers.

For more information on these concepts, please see:

- [Dependency Injection and Inversion of Control](https://hackernoon.com/beginners-guide-to-inversion-of-control)
- [SOLID Design Principles](https://hackernoon.com/solid-principles-made-easy-67b1246bcdf)
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
