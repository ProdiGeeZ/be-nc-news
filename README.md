# Northcoders News API

## Overview

The Northcoders News API provides backend functionality for a news or blog application, enabling data interactions between a frontend client and a PostgreSQL database. It supports operations on news articles, comments, and user data.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or newer)
- npm (v6 or newer)
- PostgreSQL

## Setup Instructions

### Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/ProdiGeeZ/be-nc-news.git
cd be-nc-news
```

### Install Dependencies

Install the necessary Node.js packages:

```bash
npm install
```

### Environment Setup

#### Development Environment

1. Create a `.env.development` file in the root directory.
2. Add the following line to specify the development database:

```plaintext
PGDATABASE=nc_news
```

#### Testing Environment

1. Create a `.env.test` file in the root directory.
2. Add the following line to specify the testing database:

```plaintext
PGDATABASE=nc_news_test
```

### Database Setup

Initialize the database and seed it with initial data:

```bash
npm run setup-db
```

## Running the Application

To start the server in development mode:

```bash
npm run dev
```

This will start the server on `http://localhost:9090` by default.

## Running Tests

To run automated tests:

```bash
npm test
```

## Additional Information

For more details on API endpoints and usage, refer to the API documentation provided in the `docs` directory.
