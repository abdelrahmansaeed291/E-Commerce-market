var express = require('express');
var path = require('path');
var app = express();
var alert = require('alert');
var { MongoClient  } = require ('mongodb');
const  sessions  = require('express-session');
var uri = 'mongodb+srv://mahmoud:123654789@newtworksproject.dmgly.mongodb.net/Project?retryWrites=true&w=majority';
var client = new MongoClient(uri,{useNewUrlParser:true, useUnifiedTopology:true});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

async function add_to_cart(req, res,product,desc){
  await client.connect();
  var user = await client.db('Project').collection('Users').find({"username":req.session.username}).toArray();
  var products = user[0].products;
  var exist = false;
  if (products){
    products.forEach(nproduct =>{
      if (nproduct.name == product)
        exist = true;
    })
  }
  if (exist){
    product = product + "3";
    res.redirect(`/${product}`);
    // // res.redirect(`/${product}`);
    // alert(`${product} is already in your cart`);
    // get(req, res, product);
    //res.render(`${product}`);
    await client.close();
  }
  else{
    products.push({"name":product, "desc":desc});
    await client.db('Project').collection('Users').findOneAndUpdate({"username":req.session.username},{"$set":{"products":products}});
    await client.close();
    res.redirect('/cart');
  }
};
app.get("/error/:page", function(req, res){
  const page =  req.params.page;
  res.render(`${page}`, {name:req.session.username, m:""});
});

async function login(req, res){
  await client.connect();
  const username = req.body.username;
  const password = req.body.password;
  var users = await client.db('Project').collection('Users').find().toArray();
  var exist = false;
  users.forEach(user =>{
    if (user.username == username && user.password == password)
      exist = true;
  })
  if (exist){
    req.session.username = username;
    res.redirect('/home');
    await client.close();
    return;
  }
  res.render('login',{message:"Incorrect Username or Password"});
  await client.close();
  return;
};

async function register(req, res){
  await client.connect(); 
  const username = req.body.username.trim();
  const password = req.body.password;
  var users = await client.db('Project').collection('Users').find().toArray();
  var exist = false;
  users.forEach(user =>{
    if (user.username == username)
      exist = true;
  })
  if (exist){
      res.render('registration',{message:"This user name is already token"});
      await client.close();
      return;
  }
  if (username.length == 0 || password.length == 0){
    res.render('registration',{message:"The username and the password can not be empty"});
    await client.close();
    return;
  }
  const user = {"username" : username, "password" : password, "products":[]};
  req.session.username = username;
  await client.db('Project').collection('Users').insertOne(user);
  res.redirect('/home');
  await client.close();
}


app.get('/', function(req, res){
  res.render('login',{message:""})
});

app.post('/',function(req, res){
  login(req,res).catch(console.error());
});

app.post('/register',function(req, res){
  register(req, res).catch(console.error());
 });

app.get("/add_to_cart/:product/:desc", function(req, res){
  add_to_cart(req, res, req.params.product, req.params.desc).catch(console.error());
  });

async function delete_from_cart(req, res, product){
  await client.connect();
  var user = await client.db('Project').collection('Users').findOne({"username":req.session.username});
  const products = user.products;
  var index = 0;
  for (var i = 0; i < products.length ; i++)
  {
    if (products[i].name == product)
      index = i;
  }
  products.splice(index,1);
  await client.db('Project').collection('Users').updateOne({"username":req.session.username},{"$set":{"products":products}});
  res.redirect('/cart');
  await client.close();
}

app.get("/logout", function (req, res){
  // Session["username"] = null;
  req.session.destroy();
  res.redirect("/");
})

app.get('/delete/:product', function(req, res){
  delete_from_cart(req, res, req.params.product).catch(console.error());
});

async function view_cart(req, res){
  await client.connect();
  var user = await client.db('Project').collection('Users').findOne({"username":req.session.username});
  const products = user.products;
  res.render('cart', {r : products});
  await client.close();
};
app.get("/register", function(req, res){
  res.render("registration", {name:req.session.username, message:""});
})
app.get('/:page', function(req, res){
  var page = req.params.page;
    if (req.session.username || page.toLocaleLowerCase() == 'register'){
      if (page == 'cart'){
        view_cart(req, res).catch(console.error());
        return;
      }
      if (page[page.length-1] == '3')
      {
        page = page.substring(0,page.length-1);
        res.render(`${page}`, {name:req.session.username, m:"This item is already in your cart"});
      }
      else
      {
        res.render(`${page}`, {name:req.session.username, m:""});
      }
  }
  else{
    res.render('login',{message:"You have to login first"})
  }
});

app.post('/search',async function(req, res){
  const search = req.body.Search;
  await client.connect();
  const items = await client.db('Project').collection('Products').find().toArray();
  //const items = [{i:"galaxy",name:"Galaxy S21 Ultra"},{i:"leaves",name:"Leaves of Grass"},{i:"iphone",name:"iPhone 13 Pro"},{i:"boxing",name:"Boxing Bag"},{i:"tennis",name:"Tennis Racket"},{i:"sun",name:"The Sun and Her Flowers"}];
  const r = [];
  items.forEach(item =>{
    var name = item.name.toUpperCase();
    var s = search.toUpperCase();
    if (name.includes(s)){
      r.push(item);
    }
  });
  res.render('searchresults',{r:r, s : search});
  await client.close();
})

if (process.env.PORT){
  app.listen(process.env.PORT, function(){console.log("Server Started")});
}
else
{
  app.listen(3000, function(){console.log("Server Started")});
}