
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
- **PUT**: Add a new Thread into threads collection
    * Required fields:
        + userID: indicate to which threads belongs to what user. `userID` must already exist in users collections
        + title: the title of the new title
        + threadID: the ID that is associated with the new thread created from other platform such as OPEN_AI. Each ThreadID from openAI set in database must be unique

## /threads/:threadID
- **GET**: Retrieve a single thread with a given `threadID`.
- **DELETE**: Delete a single thread with a given `threadID`.
- **POST**: Update a single thread with a given `threadID`.
    * Prohibited fields to update: ThreadID, userID

## /threads/u/:userID
- **GET**: Retrieve all threads belongs to user with a given `userID`.
- **DELETE**: Delete all threads belongs to user with a given `userID`.

## /messages
- **GET**: Retrieved all messages in messages collections
- **DELETE**: DELETE all messages in messages colllections
- **PUT**: Add a new Message into Messages collection
    * Required fields:
        + threadID: indicate to which messages belongs to what thread. `ThreadID` must already exist in users collections
        + messageID: the ID that is associated with a new message created from other platform such as OPEN_AI
        + message_total_token: this is the field also returned from other platform such as OPEN_AI
    * Note: When a new message is create/put into Message database, the `update_at` field in Thread collection is also gets updated; hence no need to make 2 calls

## /messages/:messageID
- No operations support at the moment

# /messages/t/:threadID
- **GET**: Retrieve all messages that is belongs to the given threadID

# Frontend Route Information

<!-- ## /api/auth/signin


## /api/auth/signup

## /dashboard -->


# NOTE for TO DO
Add the following logics:
Only create a thread ID when users enter the first question. 
When a new thread is created, enter the new collection into two tables: Thread and Message 
After the user enters the first question, grab the first 4 words of the prompt/question, save these words as the Title in the Thread table, and use that for displaying the previous conversation


# Stripe Local Testing Instruction
.\stripe.exe login
.\stripe.exe listen --forward-to localhost:3000/call/stripe/webhook