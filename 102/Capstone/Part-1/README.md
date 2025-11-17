Josh Pires :: 000649771 :: piresj :: 16 Nov 2025

---

# BDV102 Capstone - Part 1

GitHub repository: <https://github.com/iosue/BDV/tree/main/102/Capstone/Part-1>

>\$ cd .../102/capstone/part-1
>\$ node swiftcart

[Note] See key files:
- <a href="./README.md">README.md</a> and <a href="./documentation.docx">documentation.docx</a>
- <a href="./ERD.pdf">ERD.pdf</a>
- <a href="./schema.sql">schema.sql</a>
- <a href="./test.rest">test.rest</a>

---

## 1 - Use Cases for an Online Store

### 1.1 - Impulse Buy

A user, whether logged in with a saved cart or in guest mode for immediate checkout, will interact with a virtual shopping cart:

- add items to cart
- edit quantity of items in cart
- remove items from cart
- submit cart and facilitate transaction

### 1.2 - Add to Cart, Wait for Item Sale

A logged in user can create a persistent cart, which they can access from multiple user terminals and at different times.  They can add a given item to the cart, and wait for said item to go on sale; the app can optionally send the user an email when this condition is met, or the user can log back in, resume session with the persistent cart and finalize transaction on demand.

Server must save state of the cart for the given user between sessions.

### 1.3 - Add to Cart Until Target Total (eg. to qualify for free shipping)

Similar to above, but the rationale here is that many e-stores will offer Free Shipping for qualifying orders (>= $threshold).  User can add items one at a time, days apart until a cart total value is reached, then process the order for free shipping or other discount.

---

## 2 - ERD and Schema

<object data="./ERD.pdf" type="application/pdf">
    <embed src="./ERD.pdf">
        <p>
          <i>
            This browser does not support PDFs.
            Please download the PDF to view it:
          </i>
          <a href="./ERD.pdf">Download ERD.pdf</a>.
        </p>
    </embed>
</object>
<p>
  See also the associated SQL schema file:
  <a href="./schema.sql">Download schema.sql</a>.
</p>

---

## 3 - Key Operations of an Online Store

- Create user account with name, email etc. to generate associated persistent cart. [POST]
- Registered users can access their account and associated cart. [GET]
- Whether cart is persistent or single-session:
  - view cart [GET]
  - add items to cart [POST]
  - view specific items from cart [GET]
  - edit quantity of items in cart [PUT]
  - remove items from cart [DELETE]
- Create and send transaction request for a complete order [POST to payment API]
- View list and details of previous transactions [GET]

---

## 4 - API Endpoints & HTTP Methods

>### GET /store

main store page, reference to **/store/items**

>### GET /store/items

list all available products in store (main user interface with catalogue)

>### GET /store/users

admin-locked, list all registered users

>### POST /store/users
>**{
> "email": "<piresj@mcmaster.ca>"
>}**

register new user; initialize new cart and empty list of previous orders, redirect to **/store/users/U-001**; prompt with form to create PUT request to update user fields: fullName, lastName, address etc.

>### PUT /store/users/U-001
>**{
> "firstName": "Josh",
> "lastName": "Pires"
>}**

edit user account, redirect to **/store/users/U-001**

>### GET /store/users/U-001

user-locked, view registered user account

>### GET /store/users/U-001/orders

user-locked, view list of previous orders

>### GET /store/users/U-001/orders/orderId

user-locked, view specific previous order by id

>### GET /store/users/U-001/cart

user-locked, view current [persistent] cart

>### POST /store/users/U-001/cart
>**{
> "itemId": "0001",
> "quantity": 1
>}**

add item to cart, redirect to **/store/items/itemId** (or **/store/users/U-001/cart** based on user prefs)

>### GET /store/users/U-001/cart/itemId

reference to product page for specific item by itemId.
includes data such as item quantity, user-specific discount etc.
*(distinct from **/store/items/itemId**)*

>### PUT /store/users/U-001/cart/itemId
>**{
> "quantity": 3
>}**

edit item quantity in cart

>### DELETE /store/users/U-001/cart/itemId

remove item from cart

---

## 5 - Discussion

For the purposes of this assignment, I have focused only on the functionality of a single registered-(mock)-user; user registration and account editing etc follows similar logic to the cart process.

The current structure of the database is a .json file acting  as an internal javascript object. changes made are not persistent. SQL schema and js logic are present; integration will be addressed going forward with the project.

*In developing the ERD, the cart_id was listed as order_id, and fed into the Item_in_Order entity (since Item_in_Order will only ever have ONE OF EITHER order_id or cart_id).  this caused a constraint collision in postgres, however.  What is the appropriate solution here?*

>