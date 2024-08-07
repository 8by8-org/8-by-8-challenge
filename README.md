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

##  Selenium Tests 

### Prerequisites

- **Python**: Ensure Python is installed on your system.
[Documentation](https://www.python.org/).
- **Selenium**: Python package for browser automation.
[Documentation](https://selenium-python.readthedocs.io/installation.html#).
- **Pytest**: Python package for unit testing.
[Documentation](https://docs.pytest.org/en/stable/getting-started.html).
- **Drivers**: Included with Selenium version 4.6.0 and higher. 
[Documentation](https://www.selenium.dev/documentation/selenium_manager/).


### Setup Instructions


### Python Version

While our project can run on different versions of Python, it is best practice to use Python 3 for better performance, security, and compatibility with modern libraries and frameworks.

### Installing Python 3

If you do not have Python 3 installed, you can download it from the [official Python website](https://www.python.org/downloads/).

```
python --version
```

### Note
The command to run Python might be `python3` on some systems (like Ubuntu and WSL), while in other environments it might just be `python`. Please adjust the commands accordingly based on your environment.

### Systems using Python 3
* Ubuntu (including WSL)
* CentOS/RHEL (recent versions)
* Fedora
* macOS (often default)

### Systems using Python  (depends on configuration)
* Older Linux distributions (e.g., Ubuntu 12.04, CentOS 6)
* Conda Environments
* Docker Containers

### 1. Create Virtual Enviornment 

`python3 -m venv venv` 

### 2. Activate Virtual Enviornment 

macOS 
`source venv/bin/activate` 

Windows 
`venv\Scripts\activate`

Linux 
`source venv/bin/activate`



### 3.  Installing Selenium
Selenium does not need to be installed on a per-project basis. To see if you
already have it installed, you can run the following command:

```
pip show selenium
```

If installed, it will print information about the package. If the version is less
than 4.6.0, you should update it by running:

```
pip install -U selenium
```

Otherwise, you can install it by running the following command:

```
pip install selenium
```

For more information on installing Selenium, see [this](https://www.selenium.dev/documentation/webdriver/getting_started/install_library/).

For information on upgrading Selenium, see [this](https://www.selenium.dev/documentation/webdriver/troubleshooting/upgrade_to_selenium_4/).


### 4.  Installing pytest

Be sure to install pytest:

```
pip install pytest
```

## 5.  Before Running Selenium Tests

To ensure that Selenium tests run efficiently, it is recommended to first compile your project using `npm run build`. This step improves performance by compiling and optimizing the code, which can make the tests smoother.

I. **Build the Project:**
```
npm run build
```

II. **Start Development Server:**
```
npm run start
```

### 7.   Run the tests

To run the Selenium tests, navigate into `src/__tests__/e2e` and run
`python3 -m pytest`.



## Contributing

New engineers should review [CONTRIBUTING.md](https://github.com/8by8-org/8by8-challenge/blob/development/CONTRIBUTING.md) for details about the recommended workflow and tools.

## Resources

- [Figma prototype](https://www.figma.com/design/TP1ZMtd6ykIjNql1t0OBoA/8BY8_PROTO_V2)
- [Existing application source code](https://github.com/8by8-org/web-app)
- [Deployed application](http://challenge.8by8.us/)
- [Contributing](https://github.com/8by8-org/8by8-challenge/blob/development/CONTRIBUTING.md)
- [Style Guide](https://github.com/8by8-org/8by8-challenge/blob/development/STYLE_GUIDE.md)
