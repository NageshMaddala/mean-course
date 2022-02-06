# MeanPOC

Goal was to create a simple full working MEAN stack application

Here is the tech stack info: 
  - Front End: Angular 8, Typescript, Angular material
  - Back End: Nodejs, Express, MongoDB, Mongoose, JWT for authentication and authorization

Here is the workflow -
 - Create User
 - User Validation (Authentication, Authorization along with timeout features)
 - Create Posts
 - View Posts
 - Edit Posts

Also, this code base follows the clean code structure and extensible to add new features. Please feel free to fork and use it for your learning needs.

## Development server

Here is how to run this application, it requires 2 different servers, first one is for front end angular application and the second server is for the backend service.

Run `npm run start:server` would start the backend server.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
