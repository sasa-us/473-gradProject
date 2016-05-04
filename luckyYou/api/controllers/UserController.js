/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * Add money 
   */
   update: function (req, res) {

    // If not logged in, show the public view.
    if (!req.session.me) {
      return res.view('homepage');
    }

    // Try to look up user
    User.findOne(
      req.session.me
      , function foundUser(err, user) {
      if (err)   {      
        sails.log.verbose('Error in findOne.');
        return res.negotiate(err);
      }
      if (!user)  {
        sails.log.verbose('user not found: '+req.param('email'));
        return res.notFound();
      }
      
      var balance = parseInt(user.balance) + parseInt(req.param('depositNum'));
      console.log("balance = "+balance);    
      
      //save into db
      
      User.update(
        //Find user with his email.
         req.session.me,
       
        // Update his balance
        { balance: balance}
        ).exec(function(err, users) {
        // In case of error, handle accordingly
        if(err) {return res.serverError(err);} 

        if (!user) return res.notFound();

         return res.ok();  
      });       
      return res.ok();  
    });
  },


  /**
   * Get balance 
   */
   balance: function (req, res) {
    // Try to look up user using the provided email address
    console.log("Reading balance...");
    User.findOne(
      req.session.me
    
    , function foundUser(err, user) {
      if (err) return res.negotiate(err);
      if (!user)  {
        sails.log.verbose('user not found: '+user.email);
        return res.notFound();
      }
     
      var balance = user.balance;

      console.log("balance = "+user.balance);
      //return res.send(balance);
      return res.json({ balance: balance });
    });
  },

  /**
   * Play game 
   */
   play: function (req, res) {

    // If not logged in, show the public view.
    if (!req.session.me) {
      return res.view('homepage');
    }

    // Try to look up user
    User.findOne(
      req.session.me
      , function foundUser(err, user) {
      if (err)   {      
        sails.log.verbose('Error in findOne.');
        return res.negotiate(err);
      }
      if (!user)  {
        sails.log.verbose('user not found: '+req.param('email'));
        return res.notFound();
      }
      //random number generator
      var balance = parseInt(user.balance);
      console.log("Old balance = "+balance);    
      //var balance = user.balance;
      var winRate = Math.random();
      var ret = 0;
      if(winRate < 0.4) {
        ret = 10;       
      }
      else {
        ret = -10;       
      }
      balance = balance + ret;
      if(balance < 0) {
        balance = 0;
      }
      console.log("New balance = "+balance);    

      //save into db
      
      User.update(
        //Find user with his email.
         req.session.me,
       
        // Update his balance
        { balance: balance}
        ).exec(function(err, users) {
        // In case of error, handle accordingly
        if(err) {return res.serverError(err);} 

        if (!user) return res.notFound();
        
       
         // Otherwise send a success message and a 200 status    
         //return res.send('success');
          return res.ok();            
      }); 
      return res.ok();  
    });
  },

  /**
   * Check the provided email address and password, and if they
   * match a real user in the database, sign in to Activity Overlord.
   */
  login: function (req, res) {

    // Try to look up user using the provided email address
    User.findOne({
      email: req.param('email')
    }, function foundUser(err, user) {
      if (err) return res.negotiate(err);
      if (!user) return res.notFound();

      // Compare password attempt from the form params to the encrypted password
      // from the database (`user.password`)
      require('machinepack-passwords').checkPassword({
        passwordAttempt: req.param('password'),
        encryptedPassword: user.encryptedPassword
      }).exec({

        error: function (err){
          return res.negotiate(err);
        },

        // If the password from the form params doesn't checkout w/ the encrypted
        // password from the database...
        incorrect: function (){
          return res.notFound();
        },

        success: function (){

          // Store user id in the user session
          req.session.me = user.id;

          // All done- let the client know that everything worked.
          return res.ok(); //?? may not need it.
        }
      });
    });

  },

  /**
   * Sign up for a user account.
   */
  signup: function(req, res) {

    var Passwords = require('machinepack-passwords');

    // Encrypt a string using the BCrypt algorithm.
    Passwords.encryptPassword({
      password: req.param('password'),
      difficulty: 10,
    }).exec({
      // An unexpected error occurred.
      error: function(err) {
        return res.negotiate(err);
      },
      // OK.
      success: function(encryptedPassword) {
        require('machinepack-gravatar').getImageUrl({
          emailAddress: req.param('email')
        }).exec({
          error: function(err) {
            return res.negotiate(err);
          },
          success: function(gravatarUrl) {
          // Create a User with the params sent from
          // the sign-up form --> signup.ejs
            User.create({
              name: req.param('name'),
              title: req.param('title'),
              email: req.param('email'),
              encryptedPassword: encryptedPassword,
              balance: 0,
              lastLoggedIn: new Date(),
              gravatarUrl: gravatarUrl
            }, function userCreated(err, newUser) {
              if (err) {

                console.log("err: ", err);
                console.log("err.invalidAttributes: ", err.invalidAttributes)

                // If this is a uniqueness error about the email attribute,
                // send back an easily parseable status code.
                if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0]
                  && err.invalidAttributes.email[0].rule === 'unique') {
                  return res.emailAddressInUse();
                }

                // Otherwise, send back something reasonable as our error response.
                return res.negotiate(err);
              }

              // Log user in
              req.session.me = newUser.id;

              // Send back the id of the new user
              return res.json({
                id: newUser.id
              });
            });
          }
        });
      }
    });
  },

  /**
   * Log out 
   * (wipes `me` from the sesion)
   */
  logout: function (req, res) {

    // Look up the user record from the database which is
    // referenced by the id in the user session (req.session.me)
    User.findOne(req.session.me, function foundUser(err, user) {
      if (err) return res.negotiate(err);

      // If session refers to a user who no longer exists, still allow logout.
      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists.');
        return res.backToHomePage();
      }

      // Wipe out the session (log out)
      req.session.me = null;

      // Either send a 200 OK or redirect to the home page
      return res.backToHomePage();

    });
  }
};
