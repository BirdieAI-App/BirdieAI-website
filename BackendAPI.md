# Backend API Documentation

## Auth Route

**Note:** This route has already been implemented by the backend developer. No additional information is available.

---

## Stripe Routes

### 1. Create Checkout Session
**Endpoint:** `POST /stripe/create-checkout`

**Request Body:**
- `priceID` (string): The ID of the price object in Stripe.
- `userId` (string): The MongoDB user ID.
- `successUrl` (string): The URL to redirect to after a successful checkout.
- `cancelUrl` (string): The URL to redirect to if the checkout is canceled.

**Response:**
- Returns an HTTP URL (string) for the frontend to redirect users to the Stripe Checkout page.

---

### 2. Create Customer Portal
**Endpoint:** `POST /stripe/create-customer-portal`

**Request Body:**
- `userId` (string): The MongoDB user ID.
- `returnUrl` (string): The URL for the user to return to after leaving the Stripe Customer Portal.

**Response:**
- Returns an HTTP URL (string) for the frontend to redirect users to the Stripe Customer Portal page.

---

### 3. Get Product List
**Endpoint:** `GET /stripe/product-list`

**Response:**
- Returns a list of active products in Stripe.

---

### 4. Get Price Details of a Product
**Endpoint:** `GET /stripe/price/:priceID`

**Parameters:**
- `priceID` (string): The ID of the price object returned from the product list.

**Response:**
- Returns details of the product associated with the provided `priceID`.

**Note:** Always consult the backend developer when working with Stripe-related routes.

---

## Thread Routes

**Note:** All thread routes are protected and require cookies or an authorization header for access.

### Thread Model
- `userID` (string): The ID of the user who owns the thread.
- `title` (string): The title of the thread.

---

### Thread Management
**Endpoint:** `/threads`

- **GET**:
  - Returns all threads from the thread pool.

- **PUT**:
  - **Request Body:**
    - `userID` (string): The MongoDB user ID.
    - `title` (string): The title of the thread to be saved.
  - **Response:**
    - Returns the newly saved thread object, including its ID.

**Endpoint:** `/threads/:threadID`

- **GET**:
  - **Parameters:**
    - `threadID` (string): The ID of the thread.
  - **Response:**
    - Returns the thread object associated with the given `threadID`.

- **POST**:
  - **Request Body:**
    - Any field(s) from the thread model that need to be updated.
  - **Response:**
    - Returns the thread object with the updated fields.

**Endpoint:** `/threads/u/:userID`

- **GET**:
  - **Parameters:**
    - `userID` (string): The MongoDB user ID.
  - **Response:**
    - Returns a list of threads belonging to the specified user.

---

## Message Routes

**Note:** All message routes are protected and require cookies or an authorization header for access.

### Message Model
- `threadID` (string): The ID of the thread the message belongs to.
- `userID` (string): The ID of the user who owns the message.
- `prompt` (string): The user's prompt or question.
- `response` (string): The response from OpenAI (this field cannot be updated).
- `feedback` (string): Feedback from the user ("like", "dislike", or "none" by default).

---

### Message Management
**Endpoint:** `/messages`

- **GET**:
  - Returns a list of all message objects from the message collection.

- **PUT**:
  - **Request Body:**
    - `threadID` (string, optional): The ID of the thread to tie the message to. If not provided, a new thread will be created.
    - `userID` (string): The MongoDB user ID.
    - `prompt` (string): The user's prompt or question.
    - `feedback` (string, optional): User feedback (default is "none").
  - **Response:**
    - If `threadID` is not provided:
      - Creates a new thread tied to the given `userID`.
      - Returns the new `threadID` along with the full message object (including the OpenAI response).
    - If `threadID` is provided:
      - Returns the message object with the `response` field populated.

**Note:** Free-tier users exceeding daily limits will receive a `200` status with a message explaining the restriction instead of the message object.

**Endpoint:** `/messages/:messageID`

- **GET**:
  - **Parameters:**
    - `messageID` (string): The ID of the message.
  - **Response:**
    - Returns the message object associated with the given `messageID`.

**Endpoint:** `/messages/t/:threadID`

- **GET**:
  - **Parameters:**
    - `threadID` (string): The ID of the thread.
  - **Response:**
    - Returns a list of message objects belonging to the specified thread.

---

