 [📚 Documentation](https://shipfa.st/
## Support

# Birdie-landing-page

--- 
# Backend Route Information

## /users
- **GET**: Retrieve all users in the user collection.
- **POST**: Add a new user to the user collection.

## /users/:userId
- **GET**: Retrieve user with a given `userId`.
- **PUT**: Update user with a given `userId`.
- **DELETE**: Delete user with a given `userId`.

## /threads
- **GET**: Retrieved all threads in threads collections
- **DELETE**: DELETE all threads in threads colllections
- **POST**: Add a new Thread into threads collection
    * Required fields:
        + userID: indicate to which threads belongs to what user. `userID` must already exist in users collections
        + title: the title of the new title
        + ThreadID: the ID that is associated with the new thread created from the plat form such as OPEN_AI

## /threads/:threadID
- **GET**: Retrieve a single thread with a given `threadID`.
- **DELETE**: Delete a single thread with a given `threadID`.
- **POST**: Update a single thread with a given `threadID`.
    * Prohibited fields to update: ThreadID, userID

## /threads/u/:userID
- **GET**: Retrieve all threads belongs to user with a given `userID`.
- **DELETE**: Delete all threads belongs to user with a given `userID`.

# Frontend Route Information

<!-- ## /api/auth/signin

## /api/auth/signup

## /dashboard -->


