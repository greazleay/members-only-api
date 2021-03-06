# Members Only - API

## Contributors

* Lekan Adetunmbi

## About
Project concept from [the Odin Project](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs/lessons/members-only) curriculum with slight variations to make it more practical.

A sample API mimicking a members only service, it allows members to access only authorized resources. Members get to perform the following operations:
    
    * Create their profile.
    * Update their profile.
    * Create Posts.
    * Comment on posts by other members.
    * Like posts by other members.
    * A member can only like a post once.
    * Some operations are restricted to admin users only.

## Tech Stack

* TypeScript
* Express
* MongoDB
* Mongoose
* Passport-Jwt
* JsonWebToken
* Jest
* Supertest


## Endpoints 

* API Documentation is available [here](https://api-mbo.herokuapp.com/api-docs)

## Available Routes:

### Authentication Routes
* User Login:                                                   POST /v1/auth/login
* User Logout:                                                  GET /v1/auth/logout
* Refresh Token:                                                POST /v1/auth/refresh_token 

### User Routes
* Create User:                                                  POST /v1/user/register
* User Info:                                                    GET /v1/user/userinfo
* Delete User                                                   DELETE /v1/user/delete_user

### Password Reset Routes
* Request Verification Code:                                    GET /v1/user/verification_code
* Reset Password:                                               PUT /v1/user/reset_password
* Change Password:                                              PUT /v1/user/change_password

### Post Routes
* Get All Posts:                                                GET /v1/posts/all_posts
* Get Post By Id:                                               GET /v1/posts/post/:id
* Get All Posts By User:                                        GET /v1/posts/post_by_user
* Create Post:                                                  POST /v1/posts/create_post
* Add Comment to post:                                          PUT /v1/posts/:id/add_comment
* Add Like to post:                                             PUT /v1/posts/:id/like_post
* Delete Comment on Post:                                       DELETE /v1/posts/:id/delete_comment/:commentId
* Unlike Post:                                                  PUT /v1/posts/:id/unlike_post

### Profile Routes
* Get User Profile:                                             PUT /v1/profiles/user_profile
* Create User Profile:                                          POST /v1/profiles/create_profile
