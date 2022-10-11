# E-Commerce-market
+  link to demo :-  https://protected-mesa-09949.herokuapp.com/
## Overview 
The website allows the users to lookup products descriptions, types, manufacturers… etc. Users
should be allowed to create an account, add items to their “cart” and search for products. The website should
initially be hosted on your PCs “local host” and when the site development phase is done, you should host
it online on the cloud platform heroku.com

## Components 
+ ### Users Login (Main Page):
Registered users should be allowed to log in to their accounts using their stored username and
password. If an unregistered user tries to log in an error message should be displayed.
+ ### User Registration:
Users should be allowed to create an account using a unique username and a password and the
users’ information should be stored in a database using MongoDB. If the user tried to register using
an already taken username, an error message should be displayed.
+ ### Home Page:
The home page is the first page that should be encountered by the users when they log in to their
accounts. It contains several item types and a button to view the user’s “cart”. When the user clicks
on any item type, they should be redirected to that type’s page.
+ ### Type Page:
The type page contains all the items within this type. When a user clicks on any item’s name, they
should be redirected to that item’s page.
+ ### Item Page:
The item page contains a description for the item. The page should also contain an embedded link
for a video describing the item which can be streamed by the user. Please don’t copy the video
itself to the folder so that it doesn’t exceed the allowed size. Finally, an “add to cart” button should
be added. The button adds this item to the user’s “cart” in the database.
+ ### Cart Page:
The cart page contains the items that the user previously added using the “add to cart” button. A
“view cart” button should be added to the home page that directs the user to their own cart page.
+ ### Search:
A search bar will be displayed in all pages except for the registration and login pages. The search
will be done using items names only. The search result is either an “item not found” message if the
item was not available in the database or a list of the items that contain the search keyword in their
names. The search results is clickable and they direct you to that specific item’s page.

## Technologies used :- 
  + MongoDB
  + NodeJS
  + Express
