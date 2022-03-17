require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cors = require("cors") //Newly added
const auth = require("./middleware/auth");

const app = express();

app.use(cors()) // Newly added


app.use(express.json({ limit: "50mb" }));

// const corsOptions = {
//     origin: 'http://example.com',
//     optionsSuccessStatus: 200 // for some legacy browsers
//   }
  
//   app.get('/welcome', cors(corsOptions), auth, (req, res) => {
//     res.status(200).send("Welcome to FreeCodeCamp 🙌 ");
//   });

app.use(express.json());

// Logic goes here

// importing user context
const User = require("./model/user");

// Register
app.post("/register", async (req, res) => {

        // Our register logic starts here
         try {
          // Get user input
          const { firstName, lastName, email, password } = req.body;
      
          // Validate user input
          if (!(email && password && firstName && lastName)) {
            res.status(400).send("All input is required");
          }
      
          // check if user already exist
          // Validate if user exist in our database
          const oldUser = await User.findOne({ email });
      
          if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
          }
      
          //Encrypt user password
          encryptedUserPassword = await bcrypt.hash(password, 10);
      
          // Create user in our database
          const user = await User.create({
            first_name: firstName,
            last_name: lastName,
            email: email.toLowerCase(), // sanitize
            password: encryptedUserPassword,
          });
      
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "5h",
            }
          );
          // save user token
          user.token = token;
      
          // return new user
          res.status(201).json(user);
        } catch (err) {
          console.log(err);
        }
        // Our register logic ends here
      });


// Login
app.post("/login", async (req, res) => {

        // Our login logic starts here
         try {
          // Get user input
          const { email, password } = req.body;
      
          // Validate user input
          if (!(email && password)) {
            res.status(400).send("All input is required");
          }
          // Validate if user exist in our database
          const user = await User.findOne({ email });
      
          if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
              { user_id: user._id, email },
              process.env.TOKEN_KEY,
              {
                expiresIn: "5h",
              }
            );
      
            // save user token
            user.token = token;
      
            // user
            return res.status(200).json(user);
          }
        //   return res.status(400).send("Invalid Credentials");

        }
        catch{
            return res.status(400).send("Invalid Credentials");
        }
          
});


app.get('/welcome', cors(), auth, (req, res) => {
    res.status(200).send("Welcome 🙌");
  });


module.exports = app;