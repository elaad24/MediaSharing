# Illegal Music Download with Display and Analytics

## Overview

This project is a full-stack application that integrates Spotify and YouTube to display and download the most liked songs from Spotify. It serves as a robust platform for interacting with popular music and has been designed to learn and explore key concepts such as TypeScript, working with streams, and scanning files for malware and CVEs (Common Vulnerabilities and Exposures).

### Key Features

- **Spotify Integration**:

  - Fetches and displays the current most liked songs from Spotify using their API.
  - The song data is displayed in a user-friendly interface, where each song entry provides additional actions like opening on YouTube or downloading.

- **YouTube Integration**:

  - **Open on YouTube**: Provides an option to directly open the song on YouTube. This is done through a web scraping technique that retrieves the relevant YouTube link for each song.
  - **Download Song**: The user can download the song directly from YouTube by clicking the download button. The process involves web scraping, manipulating specific web APIs, and temporarily storing the downloaded song on the server.

- **Security and File Scanning**:

  - Before delivering the downloaded song, the system scans the file for malware and CVEs. This is based on a custom CVE database that can be expanded, allowing the system to detect and prevent the download of potentially harmful files.
  - The file is only passed to the user if it passes all security checks. This ensures that only clean and safe files are delivered.

- **File Management**:

  - **MongoDB GridFS**: Files are stored in chunks using MongoDB's GridFS, which efficiently handles large files and streaming.
  - **Efficient Caching**: If a song has already been downloaded and scanned, it is served directly from the database without re-scanning, improving efficiency and reducing server load.

- **Streaming**:

  - The project implements streaming to ensure fast and seamless connectivity between the database and the user. This is crucial for handling large audio files and providing a smooth user experience.

- **User Authentication**:
  - Implements user management with login and authentication features.
  - **JWT Authentication**: Security is managed using JWT (JSON Web Tokens) with support for refresh and access tokens. This ensures that only authenticated users can access the download features.

### Learning Objectives

This project was built not only to create a functional application but also as a learning tool to explore and understand the following concepts:

- **TypeScript**:
  - The entire project is built using TypeScript, allowing for strong typing and better error handling during development.
- **Streams**:

  - Implementing and working with streams was a key focus, particularly in handling file downloads and data transmission between the server and client.

- **CVE and Malware Scanning**:

  - Understanding how to scan files for known vulnerabilities (CVEs) and malware. The project includes a database of CVEs that can be expanded to improve security checks.

- **Web Scraping**:
  - Techniques for web scraping were employed to retrieve YouTube links and download songs, which is central to the functionality of this project.

### Environment Variables

To run the project, you'll need to set up the following environment variables:

- `SPOTIFY_API_KEY`: Your Spotify API key for fetching song data.
- `MONGODB_URI`: Connection string for your MongoDB instance, used for file storage and user management.
- `JWT_SECRET`: A secret key for signing JWT tokens, used for user authentication.

### Running the Project

This project is designed to run locally. To remember how to start and interact with it in the future:

- Start by configuring the environment variables as outlined above.
- Use `npm install` to install dependencies.
- Start the backend server with `npm run start:server`.
- Start the frontend with `npm run start:client`.

Once running, the application will provide a user interface to browse popular Spotify songs, download them, and ensure the files are safe for use.

### Project Summary

This project serves multiple purposes:

1. **Functional Tool**: A robust application for browsing and downloading popular songs with built-in security checks.
2. **Learning Platform**: A comprehensive learning experience covering TypeScript, streams, web scraping, and security practices in software development.
3. **Scalable and Extendable**: The project is designed with scalability in mind, particularly in how it handles large files and the ability to extend its security features by adding more CVEs to its database.

In the future, this project can serve as a reference for building similar tools or as a base for more complex applications that require secure file handling and efficient data streaming.
