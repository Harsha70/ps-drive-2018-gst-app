const express = require('express');
const mysql = require('mysql');

const app = express();
app.set('view engine','ejs');

app.use(express.static(__dirname+'/public'))
// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'gsts'
});

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

// Create DB
/*app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE gsts';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Database created...');
    });
});*/

app.get('/',function(req,res){
        res.render('home')
    });
    
app.get('/staff', (req, res) => {
    let sql = 'CREATE TABLE staff(name VARCHAR(20), email VARCHAR(255), mobile INT(20), password VARCHAR(20) )';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('staff table created...');
    });
})

app.get('/producttable', (req, res) => {
    let sql = 'CREATE TABLE product(product_code VARCHAR(20), product_name VARCHAR(25), product_price INT(20), product_gst VARCHAR(20) )';
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('product table created...');
    });
})

app.get('/Alter', (req, res) => {
    let sql = 'ALTER TABLE product ADD PRIMARY KEY (product_code)';
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        //res.render('dochome');
    });
})
app.get('/signupsubmit', (req, res) => {
    let post = {name: req.query.firstname, email: req.query.email, mobile:req.query.mobile, password:req.query.pwd};
    let sql = 'INSERT INTO staff SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.render('home');
    });
});

app.get('/product', (req, res) => {
    let post = {product_code: req.query.product_code, product_name: req.query.product_name, product_price:req.query.product_price, product_gst:req.query.product_gst};
    let sql = 'INSERT INTO product SET ?';
    let query = db.query(sql, post, (err, result) => {
        if(err) throw err;
        console.log(result);
        
        let sql = `SELECT * FROM product WHERE product_code= '${req.query.product_code}' `;
        let query =db.query(sql,(err, result1) => {
            if (err) {
                res.send('do not write duplicate values for product code')
            }
            else {
            res.render('staffportal',{result:result1});
        }
        
        })
    
        });

       // res.render('staffportal');
   // });
});

var resul=[]
/*var g=[]
var p=[]
var tp=[]
var i=0*/
app.get('/placetable',function(req,res){
 
    let sql = `SELECT * FROM product WHERE product_name= '${req.query.search}' `;
    let query =db.query(sql,(err, result1) => {
            if (err) {
                res.send('Error in placetable')
            }
            else if (result1.length>0)  {

                resul.push(result1[0])
               // g.push(result1[0].product_gst)
                //p.push(result1[0].product_price)
                //tp.push(i)
                //i=i+1;

               /*console.log('resul='+JSON.stringify(resul[0]))
               console.log(resul)
               console.log('resul==='+resul[1])
               console.log('resul product_name==='+JSON.stringify(resul[1].product_name))*/
               //console.log('resul==='+g)
            res.render('proSer',{result:resul});

        }else{
            res.send("PRODUCT is NOT there in DATABASE ")
        }
        
        })
})

app.get('/Billing',function(req,res){
   var result=[{
        product_code:'pls search',
        product_name:'pls search',
        product_price:0,
        product_gst:0
    }]
    //console.log(result[0].product_name)
    console.log('billing result:'+JSON.stringify(result[0]))
    res.render('proSer',{result:result})
})

app.get('/Edit/:product_code',function(req,res){
    res.render('Edit',{result:req.params.product_code})
    /*let sql = `UPDATE patappoint SET patname = '${req.query.updatename}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        //console.log(result);
        res.send('Post updated...');
    });*/
})

app.get('/Edited/:product_code',function(req,res){
    let sql = `UPDATE product SET product_name = '${req.query.product_name}' WHERE product_code = ${req.params.product_code}`;
    let sql2 = `UPDATE product SET product_price = '${req.query.product_price}' WHERE product_code = ${req.params.product_code}`;
    let sql3 = `UPDATE product SET product_gst = '${req.query.product_gst}' WHERE product_code = ${req.params.product_code}`;

   let query = db.query(sql, (err, result) => {
        if(err){
            console.log("error is" + err);
        }
        //console.log(result);
        else{
            let query = db.query(sql2, (err, result) => {
        if(err) throw err;
        else{
            let query=db.query(sql3,(err,result)=>{
                if(err) console.log("error is" + err);
                res.send('product_name updated...')
            })
        }
    })
        }
        
    });
})

app.get('/select',function(req,res){
    let sql = `SELECT * FROM staff WHERE email = '${req.query.email}' AND password = '${req.query.password}'`;
    let query = db.query(sql, (err, result) => {
        if(err) console.log("error is" + err);
        console.log(result);
        if(result.length>0){
        res.render('select')
    }else{res.send('name or password is wrong')}
        });
    
})


app.get('/loginsubmit', (req, res) => {
    let sql = `SELECT * FROM product `;
        let query =db.query(sql,(err, result1) => {
            res.render('staffportal',{result:result1});
        })
    
});

app.get('/showall',function(req,res){
let sql = `SELECT * FROM product `;
        let query =db.query(sql,(err, result1) => {
            if (result1.length>0) {
            res.render('staffportal',{result:result1});
        }else{res.send('products r empty')}
        })
})

app.get('/bill',function(req,res){
    res.render('Select')
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

//app.set('port',process.env.PORT||3000)