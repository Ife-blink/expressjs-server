---
title: ExpressJs server
description: A simple ExpressJS server
tags:
  - http
  - nodejs
  - express
  - javascript
  - json
---

# NodeJS Express Example
This is the backend of a grantfinder application it uses OpenAI to convert Natural language to vector embeddings. The embedding are stored in Supabase Provisioned Postgres Database and then retrieved by matching the embedding of the "query" with its similar embedding on the database via consine similarity.
This allows to query doc and json files with near perfect accuracy even with typos

