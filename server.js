const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
//in order to create an app all we have to do is call the express method
var app = express();
//see playground notes

//support for partials above view engine
hbs.registerPartials(__dirname + '/views/partials');
//is going to take the directory you want to use for all of your handlebar partial files
// You can run nodemon server.js -e js,hbs this is going to watch for changes in
// files with this extensions
const port = process.env.PORT || 3000;
//set all our http route
//app.get takes 2 arg the url and a function run and what to send back to
//the persnon that made the request. This function accepts 2 arguments
//the req where all info about the request comming in things like header
//the body any method that was made with that request the path etc


//res has a lot of methods for you so you can respond to the http request
//in whatever way you like. you can customize what data you send back you can
//se your http status code heders all sort of things

//Register middleware for view engine
//Middleware can be anything like loging something on the screen
//Make a change to a request or response object req,res
//we will be doing that in later section where we add api authentication
//we want to make sure the right header is going to be send
//that header is going to be exepted to have an api tocken
//We can use middleware to determine whether or not someone has loged in
//and wheather or not they would have access to that route
//and we can also use midleware to response to a request
app.set('view engine','hbs');


//our middleware app.use take the middleware function you want to use in our chase
//it is a build in called express.static();
//express.static takes the absolute path of the folder you want to serve up
//but the __dirname makes it easy for us serving us our main path
// app.use(express.static(__dirname + '/public'));
//to use a midleware you just use the .use() with a function that takes 3 argu-
//ments the req,res,next objects
app.use((req, res, next)=>{
  next();

});
//--Middleware is executed in th order you call app.use
//--so in the order we use the use is first with express.static then the loger
//--and then the maintenance middleware that why we see the help page if we
//--want the help page not to apear and make our puplic folder private
//-- we have to reorder it and move it from before the maintenance
//--after the maintenance

// app.use((req,res,next)=>{
//   res.render('maintenance.hbs',{
//     pageTitle: 'Maintenance Page',
//     currentYear: new Date().getFullYear(),
//     pageTitle: 'Maintenance Mode',
//     pageMessage: 'Website is under construction...'
//   });
//   //without calling next it dosent go to render other pages.
// });
app.use(express.static(__dirname + '/public'));
//partial is nothing more than a function you can run from inside of your handlebar
//template all you need to do is register it right below where we set up our
// express middleware and we are going to be registering a helper function.
// hbs.registerHelper take 2 arguments the name of the helper as the first parm
// and the function to run as the second.
//we are going to be creating a helper that returns the current year
hbs.registerHelper('getCurrentYear', ()=>{
//and anything we return from this funtion is going to get rendered in place of
//the getCurrentYear call
// That means if i call getCurrentYear inside of the footer it's going to return
//from the function and that data is what is going to get rendered
return new Date().getFullYear();
});

//Our helper can also take arguments and this is realy useful stuff. Lets create
//a 2nd helper that is going to be a capitalization helper. We'll call the
//helper screen it and its job is going to be to take some text and its going to
//return that text in uppercase. In order to do this we will be calling the
//hbs.registerHelper again like bellow. called screamIt accept 1 param the text
//and all is going to do is
hbs.registerHelper('screamIt', (text)=>{
return text.toUpperCase();
});

//next exist so you can tell exrpress when your midleware is done
//and this is usefull because you can have us many midlewares as you like
//registered to a single express app. And inside the midleware we can do many
//things but when we are done we put the next to go to the next midleware
//So if we do something asynchonously the middleware is not going to move on only
//when we call next like this next(); will tha application can continue to run.
//That means if your middleware doesnt call next your handlers for each request
//they never going to fire. because it will never go to to the next Middleware
//So with no next(); if we go to homepage the page never gets servered.
//Inside our middleware we want to make a file to store all our requests.



app.get('/',(req, res)=>{
  var now = new Date().toString();
  // console.log(`${now} : ${req.method} ${req.url}`);
  var log = `${now} : ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err)=>{
    if(err){
      console.log('Unable to append to server.log.');
    }
  });
  // res.send('<h1>Hello From Express!</h1>');
  // res.send({
  //   name: 'Alex',
  //   likes:[
  //     'Biking',
  //     'Cities'
  //   ]
  // });
  res.render('home.hbs',{
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to our Express Website.'
  });
});


app.get('/about', (req,res)=>{
  // res.send('About Page');
  res.render('about.hbs',{
    pageTitle: 'About Page'
  });
});

app.get('/projects', (req,res)=>{
  // res.send('About Page');
  res.render('projects.hbs',{
    pageTitle: 'Projects'
  });
});

app.get('/bad', (req,res)=>{
  res.send({
    errorMessage: 'Unable to get this request'
  });
});

//app.listen is going to bind our application to a port on our machine
//app.listen(3000);
//app.listen(3000,()=>{console.lgo('Server is up on port 3000')});
//takes a callback function and in our case we have only a console.log message
app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
});
