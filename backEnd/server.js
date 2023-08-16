const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const knex = require('./db/dbConnection.js')
const app = express()
const hostname = "127.0.0.1";
const http = require("http");

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(express.json())
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }));

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const server = http.createServer((req, res) => {
    //Set the response HTTP header with HTTP status and Content type
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World\n");
});



  app.get('/', (req, res) => {
    res.send(`<html lang="en" title="serverHome">
    <main>
    <a href='http://localhost:8080/login'>Login Page</a>
    <br></br>
    <a href='http://localhost:8080/users'>Users Page</a>
    </main>
    </html>
    `)
  })

  app.post("/users", (request, response, next) => {
    bcrypt.hash(request.body.password, 10)
    .then(hashedPassword => {
      return database("user").insert({
          username: request.body.username,
          password_digest: hashedPassword
      })
      .returning(["id", "user_name"])
      .then(users => {
          response.json(users[0])
      })
      .catch(error => next(error))
    })
  })
  app.post("/login", (request, response, next) => {
    database("user")
    .where({username: request.body.username})
    .first()
    .then(user => {
      if(!user){
          response.status(401).json({
            error: "No user by that name"
          })
      }else{
          return bcrypt
          .compare(request.body.password, user.password_digest)
          .then(isAuthenticated => {
            if(!isAuthenticated){
                response.status(401).json({
                  error: "Unauthorized Access!"
                })
            }else{
                return jwt.sign(user, SECRET, (error, token) => {
                  response.status(200).json({token})
                })
            }
          })
      }
    })
})
  // app.get('/users', async (req, res) => {
  //   const { first_name, last_name, email, user_name } = req.query;
  
  //   console.log(last_name, first_name, email, user_name)
  //   try {
  //     let query = knex('users').select("*");
  
  //     if (user_name) {
  //       query = query.where('user_name', 'ilike', `%${user_name}%`);
  //     } else if (email) {
  //       query = query.where('email', 'ilike', email);
  //     } else if (last_name) {
  //       query = query.where('last_name', 'ilike', `%${last_name}%`);
  //       if (first_name) {
  //         query = query.where('first_name', 'ilike', `%${first_name}%`);
  //       }
  //     }
  //     const users = await query;
  //     res.status(200).json(users);
  //   } catch (err) {
  //       res.status(500).json({ message: "Failed to retrieve user." });
  //     }
  //   });

    
    // app.post('/login', async (req, res) => {
    //   const { username, password } = req.body
    //   console.log(`User '${username}' is attempting to login`)
    
    //   try {
    //     const user = await knex('users')
    //       .select('id', 'user_name', 'password')
    //       .where('user_name', username)
    //       .first()
    
    //     if (user) {
    //       const isPasswordValid = bcrypt.compareSync(password, user.password);
    //       console.log('bcrypt:', isPasswordValid)
    
    //       if (isPasswordValid) {
    //         console.log(`User '${username}' has successfully logged in`)
    
    //         const token = jwt.sign({ user: user.user_name }, JWT_SECRET, { expiresIn: '1h' })
    //         const user_name = user.user_name
    //         res.status(201).json({ token, user_name })
    //       } else {
    //         console.log(`User '${username}' failed authentication`)
    //         res.status(401).json({ message: "Failed to authenticate." })
    //       }
    //     } else {
    //       console.log('User does not exist')
    //       res.status(401).json({ message: "Failed to authenticate" })
    //     }
    //   } catch (err) {
    //     console.log(`Fetch request failed.  Invalid user input`)
    //     res.status(500).json({ message: "Failed Request" })
    //   }
    // })

  //////////////////////////////
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});