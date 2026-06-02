Send your friend these exact steps. If followed in order, the project will run correctly.

🔥 SMART CANTEEN PROJECT — COMPLETE SETUP GUIDE
🔷 STEP 1 — Download Required Software
1️⃣ Download VS Code

VS Code Download

Install normally:

Next
Next
Finish
2️⃣ Download Node.js

Node.js Download

Install:

Next
Next
Finish

After install check:

Open CMD:

node -v

Then:

npm -v

If version shows → installed correctly.

3️⃣ Download MongoDB Community Server

MongoDB Community Server

IMPORTANT during installation:

✔ Choose:

Complete

✔ Keep checked:

Install MongoDB Compass

✔ Keep checked:

Install MongoDB as Service

Then install.

4️⃣ Download MongoDB Compass (if not installed)

MongoDB Compass

Step 2 — Install VS Code Extensions

Open VS Code.

Click on Extensions icon on left side OR press:
Ctrl + Shift + X

Install these extensions:

Live Server
Used to open frontend pages easily.
Prettier
(Optional — formats code properly)
Material Icon Theme
(Optional — better folder/file icons)

STEP 4 — Open Project in VS Code

Open VS Code.

Click:

File → Open Folder

Select:

Vaish

Step 5 — Open Terminal

In VS Code top 

Terminal → New Terminal

Terminal opens at bottom.

Step 6 — Go to Backend Folder

Type:

cd backend

Then press Enter.

Step 7 — Install Project Packages

Type:

npm install

Wait until installation finishes.

This installs:

express
mongoose
cors
all required packages

Step 8 — Fix MongoDB Data Folder Error

Open:
C:\

Create folder:
data

Open data folder.

Inside create:
db

Final path should become:

C:\data\db

This prevents MongoDB startup errors.

Step 9 — Start MongoDB Server

Open PowerShell.

Type:

& "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe"

If version differs:

check inside:
C:\Program Files\MongoDB\Server\

Use actual version folder.

Example:

8.0
8.3
7.0

If successful you’ll see:
“Waiting for connections”

Keep that window open.

Step 10 — Start Backend Server

Go back to VS Code terminal.

Type:

node server.js

If successful:

MongoDB Connected
Server Running on Port 5000

Keep this terminal open too.

Step 11 — Open Frontend

Go to frontend folder.

Open:
login.html

OR

Right click:
Open with Live Server

Step 12 — Register User

Open register page.

Enter:

username
password

Click Register.

It redirects to login page.

Step 13 — Login

Enter same:

username
password

Click Login.

Home page opens.

Step 14 — Place Order
Add food items
Click Proceed to Payment
Confirm payment

Order saves in MongoDB.

Step 15 — Open MongoDB Compass

Open MongoDB Compass.

Paste connection string:

mongodb://127.0.0.1:27017

Click Connect.

Step 16 — View Database

Open:
canteenDB

Inside:

users
orders
Step 17 — View Orders

Click:
orders

To see latest orders:
click Refresh button.

Every Time Project Runs
Start MongoDB using PowerShell command
Start backend:
node server.js
Open:
login.html

That’s all.