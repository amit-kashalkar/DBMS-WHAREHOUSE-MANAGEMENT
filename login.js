 var mysql = require('mysql');
        var express = require('express');
        var session = require('express-session');
        var bodyParser = require('body-parser');
        var admin_id;
        var path = require('path');
        var router=express.Router();
        global.admin_id;
        var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'amit',
        password : '',
        database : 'project1'
        });

        var app = express();
        app.set('html');
        app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
        }));
        app.use(bodyParser.urlencoded({extended : true}));
        app.use(bodyParser.json());
        app.set('views', __dirname + '/view');
        app.use(express.static( __dirname +'/public/css'));
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');

        app.get('/', function(request, response) {
        response.sendFile(path.join(__dirname + '/login1.html'));

        app.post('/auth', function(request, response) {
            
        username = request.body.username;
        password = request.body.password;
        console.log('logged in status'+request.session.loggedin)

        if (username && password) {
        connection.query('SELECT * FROM EMPLOYEE WHERE ename = ? AND epass = ?', [username, password] , function(error, results, fields) {
        if (results.length > 0) {

           console.log(results);
           request.session.loggedin = true;
           console.log('logged in status'+request.session.loggedin)
           request.session.username = results[0].ename;
           console.log('logged in username '+request.session.username)
           request.session.password=results.password;
           id=results[0].eid;
           
           console.log(username);
           console.log(password);
           console.log(id);
           response.redirect('/home');
        } else {
           response.send('Incorrect Username and/or Password!');
        }        
        // console.log(results.username);

        response.end();
        });
        } else {
        response.send('Please enter Username and Password!');
        response.end();
        }
        });

app.get('/sales', function(req, res) {
  console.log('/sales');
   connection.query('');
    res.render('sales.html');
  });

app.get('/delEmp', function(req, res) {
  console.log('/delEmp');
  console.log(req.query['category']);
  connection.query('delete FROM EMPLOYEE WHERE eid=?', req.query['category'] , function(error, results, fields) {
    if(error) throw error;
    console.log(results);
    res.redirect('/rouEmployees');
  
  });
  });
app.get('/customer', function(req, res) {
  console.log('/customer');
  var prisoners=[];
  connection.query('select * from CUSTOMER',function(errors,results,fields){
    if(errors)console.log(errors);
    console.log(results);
    res.render('customerdetails.html',{prisoners:results});
   /* for(var i=0;i<=results.length-1;i++)
        {prisoners.push(results[i]);
                //priso.push(results[i].prisoner_id);
            }
  });
  console.log(prisoners);
  */
  });});
 
app.get('/suppliers', function(req, res) {
  console.log('/suppliers');
  connection.query('select * from SUPPLIER' , function(error, results, fields) {
  if (error)  throw error;
  console.log(results);
  res.render('supplierdeatils.html',{sup:results});
  });});
  router.get('/home', function(request, response) {
        console.log("inside homme");
        console.log('in home user:'+request.session.username);
        var prisoners=[];
        var priso=[];

        // response.sendFile(path.join(__dirname + '/home.html'));
        if (request.session.loggedin) 
        {
        console.log(id);
        connection.query('SELECT * FROM EMPLOYEE where eid= ?',[id],
        function(error, results, fields) {
        console.log(results);
        console.log('wtf is'+id);
        for(var i=0;i<=results.length-1;i++)
        {prisoners.push(results[i]);
                //priso.push(results[i].prisoner_id);
            }
          console.log(prisoners);
          for(var i=0;i<=1;i++)
           console.log(prisoners[i]);   
        response.render('home1.html',{username:username,prisoners:prisoners,sid:prisoners[0].eid});

        });

        } else {
        response.send('Please login to view this page!');

        }
        });

        });
        app.get('/here', function(req, res) {
        console.log('Category: ' + req.query['category']);
        connection.query('SELECT * FROM prisoners WHERE prisoner_id=?', req.query['category'] , function(error, results, fields) {
        res.render('prisoner.html',{prisoner:results});

        });
        });
        app.get('/appoint', function(req, res) {

        connection.query('SELECT * FROM visitors WHERE visitor_id in (select visitor_id from has where prisoner_id=?)', req.query['category'] , function(error, results, fields) {
        console.log(results);
        res.render('visitors.html',{visitors:results,id:req.query['category']});

        });
        });
        app.get('/rouInventory', function(req, res) {
        console.log("inside rou inventory");
        connection.query('SELECT * FROM PRODUCTS ', function(error, results, fields) {
         res.render('inve.html',{products:results});
         });

        });
        app.get('/rouCust', function(req, res) {
        console.log("inside roucust");
        res.render('customer.html');
        });
        app.post('/addVis',function(request,response){
        fname=request.body.fname;
        lname=request.body.lname;
        vid=request.body.vid;
        pid=request.body.id;
        var res=[];
        if (fname && lname && vid) {                                                                                                                            
        connection.query('insert into visitors values (?,?,?)', [vid,fname,lname] , function(error, results, fields) {
        if(error)console.log("error");
         connection.query('insert into has values(?,?)',[vid,pid],function(error,result,fields){
        if(error)console.log("error");
        connection.query('SELECT * FROM visitors WHERE visitor_id in (select visitor_id from has where prisoner_id=?)', pid , function(error, results, fields) {
         });
         });
        });
        }
        });
    
        // console.log(results.username);

       

      app.post('/addCriminal',function(request,response){
            console.log("inside addCust");
            cname=request.body.cname;
            cadd=request.body.cadd;
            ccont=request.body.ccont;
            eid=id;
            var res=[];
            if (cname && ccont &&cadd) {                                                                                                                            
                connection.query('insert into CUSTOMER values (?,?,?,?,?)', ['default',cname,cadd,ccont,eid] , function(error, results, fields){
                    if(error)console.log("error");
        //response.render('order.html',{cname:cname});
        //  connection.query('insert into commited values(?,?)',[cid,pid],function(error,result,fields){
        //   if(error)console.log("error");     
        //  }
        //);
        //      connection.query('SELECT * FROM visitors ', function(error, results, fields) {// console.log(results);
        console.log("here");
        response.redirect('back');  
        response.end();     
        });
            }else {
              response.send('Please enter Username and Password!');
              response.end();
          }
        });

   app.post('/addCust',function(request,response){ 
        console.log("inside addCust");
        cname=request.body.cname;
        cadd=request.body.cadd;
        ccont=request.body.ccont;
        eid=id;
        trial=request.body.trial;
        console.log("trial is "+trial);
        var res=[];
        if (cname && ccont &&cadd) { 
        console.log("jst before");                                                                                                                           
        connection.query('insert into CUSTOMER values (default,?,?,?,?)', [cname,ccont,cadd,eid] , function(error, results, fields) {
        if(error)console.log(error);
        console.log("cname:"+cname);
         connection.query('select * from CUSTOMER ' ,function(errors,results,fields){
            if(errors)console.log(errors);
            console.log("results cid in customer"+results[results.length-1].cid);
            cid=results[results.length-1].cid;
 connection.query('insert into ORDERTABLE value(default,CURDATE(),?,?,?)',[0,cid,eid], function(error, results, fields){
                if(error)console.log("error");
            });


        });
        });
    //response.redirect('back');
            response.redirect("/rouOrder");
    }
        else {
        response.send('Please enter Username and Password!');
        response.end();
        }
       // response.render('/rouOrder');
        });


        app.get('/rouOrder',function(request,response){
            var orderList=[];
           console.log("inside rou ouder");
           eid=id;
        connection.query('select * from CUSTOMER ' ,function(errors,results,fields){
            if(errors)console.log(errors);
            console.log("results cid in customer"+results[results.length-1].cid);
            cid=results[results.length-1].cid;
            //console.log("fields customer:"+fields);
           
                connection.query('select *from ORDERTABLE',function(errors,results,fields){
                if(errors)console.log(errors);
            console.log("results oid in customer"+results[results.length-1].oid);
            oid=results[results.length-1].oid;
        
            connection.query('SELECT * FROM ORDERLIST WHERE oid=? ',[oid],
            function(errors, results, fields) {
             console.log(results);
            for(var i=0;i<=results.length-1;i++)
                {orderList.push(results[i]);
                    //priso.push(results[i].prisoner_id);
             }
        //console.log(prisoners);
         //for(var i=0;i<=1;i++)
                console.log(orderList);  
     
             connection.query('select *from CUSTOMER',function(errors,results,fields){
                if(errors)console.log(errors);
            console.log("results oid in customer"+oid+" and cid ");
            connection.query('select sum(tprice)from ORDERLIST group by oid',function(errors,results,fields){
                console.log("sum results :"+results[0].sum);
            })
            response.render('order.html',{orderList:orderList,cid:cid,oid:oid,cname:results[results.length-1].cname,cadd:results[results.length-1].cadd,ccont:results[results.length-1].contact});
response.end(); 
        });
         });
                                
            
           
                })  ;   
       
            
            
        });    


});

        //      connection.query('SELECT * FROM visitors ', function(error, results, fields) {
        // console.log(results);
     
app.post('/addProdOrder',function(request,response){
           pid=request.body.pid;
           oid=request.body.oid;
           qty=request.body.qty;
           cid=request.body.cid;
           //eid=id;
           var tprice;
           var price;
           console.log("inside addProdOrder");
           console.log("pid is "+pid);
           connection.query('select *from PRODUCT where pid=?',[pid], function(error, results, fields){
            if(error)console.log('FIRST SELECT '+error);
            console.log('results:'+results[0].Mprice);
            tprice=qty*results[0].Mprice;  
           connection.query('insert into ORDERLIST value(?,?,?,?,?)',[pid,oid,qty,results[0].Mprice,tprice], function(error, results, fields){
            if(error)console.log('SELECT SECOND '+error);
            response.redirect('back');  
        response.end(); 
        });   
        });
           
           

          
        });  
app.post('/searchProduct', function(req, res) {
    search=req.body.check;
    attribute=req.body.attribute;
    console.log(search);
    console.log(attribute);

  console.log(search);
  
  console.log(search);
   if(attribute == 'pid'){
    console.log('inside pid');
     connection.query('select * from PRODUCTS where pid=?',[search] , function(error, results, fields) {
        if(error) throw error;
        console.log(results);
    //  if(results==null) popup.alert({content:' no match found'})
        res.render('inve.html',{products:results});
    });
    }
    else if(attribute == 'pname'){
        console.log('inside pname');
         connection.query('select * from PRODUCTS where pname=?',[search] , function(error, results, fields) {
            if(error) throw error;
            console.log(results);
            res.render('inve.html',{products:results});
        });
        }
        else if(attribute == 'qty'){
            console.log('inside qty');
             connection.query('select * from PRODUCTS where qty>=?',[search] , function(error, results, fields) {
                if(error) throw error;
                console.log(results);
                res.render('inve.html',{products:results});
            });
            }
            else if(attribute == 'cost'){
                  console.log('inside cost');
                  connection.query('select * from PRODUCTS where pprice>=?',[search] , function(error, results, fields) {
                    if(error) throw error;
                    console.log(results);
                    res.render('inve.html',{products:results});
                });
                }
                else if(attribute == 'sprice'){
                    console.log('inside pname');
                     connection.query('select * from PRODUCTS where sprice>=?',[search] , function(error, results, fields) {
                        if(error) throw error;
                        console.log(results);
                        res.render('inve.html',{products:results});
                    });
                    }
                    else if(attribute == 'category'){
                        console.log('inside pname');
                         connection.query('select * from PRODUCTS where category=?',[search] , function(error, results, fields) {
                            if(error) throw error;
                            console.log(results);
                            res.render('inve.html',{products:results});
                        });
                        }
    else{
        console.log('inside default');
        
         connection.query('select * from PRODUCTS ',function(error, results, fields) {
            if(error) throw error;
            console.log(results);
            res.render('inve.html',{products:results});
        });
    }
    });
app.get('/rouSupplier',function(res,res){
    console.log("inside rousupplier");
    connection.query('SELECT * FROM SUPPLIER', function(error, results, fields) {
         res.render('supplier_info.html',{supplier:results});
         });
});
app.post('/searchSupplier', function(req, res) {
    search=req.body.check;
    attribute=req.body.attribute;
    console.log(search);
    console.log(attribute);

   console.log(search);
   if(attribute == 'sid'){
    console.log('inside pid');
     connection.query('select * from SUPPLIER where sid=?',[search] , function(error, results, fields) {
        if(error) throw error;
        console.log(results);
    //  if(results==null) popup.alert({content:' no match found'})
        res.render('supplier_info.html',{supplier:results});
    });
    }
    else if(attribute == 'sname'){
        console.log('inside pname');
         connection.query('select * from SUPPLIER where sname=?',[search] , function(error, results, fields) {
            if(error) throw error;
            console.log(results);
            res.render('supplier_info.html',{supplier:results});
        });
        }
        else if(attribute == 'scontact'){
            console.log('inside contact');
             connection.query('select * from SUPPLIER where scontact=?',[search] , function(error, results, fields) {
                if(error) throw error;
                console.log(results);
                res.render('supplier_info.html',{supplier:results});
            });
            }
           
              
                  
    else{
        console.log('inside default');
        
         connection.query('select * from SUPPLIER ',function(error, results, fields) {
            if(error) throw error;
            console.log(results);
            res.render('supplier_info.html',{products:results});
        });
    }
    });
 app.post('/addProdIn',function(request,response){
    console.log("inside add prodIN");
           pqty=request.body.pqty;
          console.log("pqty =",pqty);
           //eid=id;
           var tprice;
           var price;
         
           console.log("pid is "+pid);
           connection.query('select *from PRODUCTS where pid=?',[pid], function(error, results, fields){
            if(error)console.log('FIRST SELECT '+error);
            console.log('results:'+results[0].Mprice);
            tprice=qty*results[0].Mprice;  
           connection.query('insert into ORDERLIST value(?,?,?,?,?)',[pid,oid,qty,results[0].Mprice,tprice], function(error, results, fields){
            if(error)console.log('SELECT SECOND '+error);
            response.redirect('back');  
        response.end(); 
        });   
        });
       });



    

 
        app.get('/rousupplyorder',function(request,response){
          sid=request.query['sid'];
          eid=id;
           connection.query('insert into ORDERSUPPLYTABLE value(default,CURDATE(),?,?,?)',[0,sid,eid], function(error, results, fields){
                if(error)console.log("first"+error);
               
                connection.query('SELECT *FROM ORDERSUPPLYTABLE ', function(error, results, fields){
                if(error)console.log("second"+error);
                  oid=results[results.length-1].oid;
                connection.query('SELECT *FROM PRODUCTS WHERE sid=?',[sid], function(error, results, fields){
                if(error)console.log("thirrd "+error);
                  pid=results[0].pid;
                  console.log("pid sid oid id "+pid+" "+sid+" "+oid);
       connection.query('SELECT *FROM ORDERSUPPLYLIST WHERE oid=?',[sid], function(error, results, fields){
                if(error)console.log("fourth "+error);
                console.log(results);
            response.render("supply_order.html",{pid:pid,sid:sid,oid:oid});
            });


});

 });  });});;
 app.post('/supplyorderdata',function(req,res){
  qty=req.body.qty;
  pid=req.body.pid;
  sid=req.body.sid;
  oid=req.body.oid;
   console.log(" in supply data pid sid oid id "+pid+" "+sid+" "+oid);
  connection.query('select *from PRODUCTS where pid=?',[pid],function(error,results,fields){
    console.log(results);
    tprice=qty*results.price;
    
  connection.query('insert into ORDERSUPPLYLIST values (?,?,?,?,?)',[pid,oid,qty,results[0].price,tprice], function(error, results, fields){
            if(error)console.log('SELECT SECOND '+error);
            console.log("RESULTS IN SUPPLIER"+results);
            connection.query('select * from ORDERSUPPLYLIST ', function(error, results, fields){
            if(error)console.log('SELECT SECOND '+error);
            oid=results[results.length-1].oid;
          });});});
  res.redirect('back');
 });

        app.get('/editEmpF', function(req, res) {
    console.log('/editEmp');
    console.log(req.query['category']);
    connection.query('select * from employee WHERE eid=?', req.query['category'] , function(error, results, fields) {
      if(error) throw error;
      console.log(results);
      res.render('editEmp.html',{emp:results});
    });
    });

app.post('/editEmp',function(request,response){
  eid=request.body.eid;
  ename=request.body.ename;
  eadd=request.body.eadd;
  econt=request.body.econt;
  salary=request.body.salary;
  console.log(eid);
  if(ename && eid)
    connection.query('UPDATE employee set ename=? where eid=?',[ename,eid]); 
    if(eadd && eid) 
    connection.query('UPDATE employee set eadd=? where eid=?',[eadd,eid]);
  if(econt && eid) 
    connection.query('UPDATE employee set scontact=? where eid=?',[econt,eid]);
  if(salary && eid) 
    connection.query('UPDATE employee set salary=? where eid=?',[salary,eid]);
     response.redirect('/rouEmployees');
  });



  app.get('/addEmpF',function(request,response){
    response.render('addEmp.html');
  }
  );


  app.post('/addEmp',function(request,response){
    ename=request.body.ename;
    eadd=request.body.eadd;
    econt=request.body.econt;
    salary=request.body.salary;
    connection.query('insert into EMPLOYEE values(default,?,?,?,?)', [ename,eadd,econt,salary] , function(error, results, fields) {
      console.log(results);  
       if(error)throw error;
       response.redirect('/rouEmployees')
         });
    });
  
  
app.get('/rouEmployees', function(req, res) {
console.log('/emplyoees');
connection.query('select * from EMPLOYEE', 
  function(error, results, fields) {
    if(error) throw error;
    console.log(results)
      res.render('employees.html',{emp:results});
       });
});
app.get('/rouStats', function(request,response) {
  console.log('/rouStats');
  var date='2019-10-30';
  connection.query('select sum(ototal) as sum from ORDERTABLE where  odate=?', [date] , function(error, results, fields) {
    if (error)  throw error;
    console.log(results[0].sum);
     response.render('stats.html',{profit:results[0].sum,profit2:null});
   });
});
      app.use('/', router);

        app.listen(8800);