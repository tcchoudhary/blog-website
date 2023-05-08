const express= require('express');
const request= require('request');
const fs= require('fs');
const lodash = require('lodash')
const app = express();


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

//End point
const defaultpra= 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit molestiae id laborum repellendus, corporis dolorem ducimus omnis illum consequatur nam, similique cum provident atque vero sunt accusantium magni aliquid. Voluptate alias repellat id, facilis quia omnis dicta! Vero id debitis alias porro distinctio repudiandae nesciunt quas illum accusamus, nemo tempore.';
let todaysquote;
let posts=[];
let blogdata="";
let searchdata=[];
let newarry=[];
if(fs.existsSync("blogs.txt")){
    blogdata= fs.readFileSync('blogs.txt', 'utf-8')
    // console.log(blogdata);
    const objdata= JSON.parse(blogdata);
    // console.log(objdata);
    posts.push(...objdata);
}



app.get('/', (req,res)=>{
    request('https://type.fit/api/quotes', (err,response,body)=>{
        if(err){
            return;
        }else{
          const quotes= JSON.parse(body);
          const size= quotes.length;
          const random= Math.trunc(Math.random()* size) +1;
          todaysquote= quotes[random].text;
        //   console.log(todaysquote);
        }
    })
    res.render('home', {today:todaysquote,post:posts})
    // console.log(req.bod);
});



app.post('/',(req,res)=>{
    // console.log(req.body.field);
    for(let post of posts){
        if (lodash.lowerCase(req.body.field)=== lodash.lowerCase(post.title)) {
            // console.log('find it');
        //    newarry.push(post) 
        //    console.log(newarry);
           res.render('blogpost', {singlepost:post});
           break;
         }
       
    } 
  
});


// app.get('*', (req,res)=>{
//             if (lodash.lowerCase(req.body.field)!== lodash.lowerCase(post.title)){
//                 res.render('404')
//             }
// })



app.get('/search/:field', (req,res)=>{

    console.log(req.params.field);
    for(let post of posts){
        if (lodash.lowerCase(req.params.field)=== lodash.lowerCase(post.title)) {
            console.log('find it');
            res.render('blogpost', {singlepost:post})
            break;
        }
    } 
});



app.get('/edit', (req,res)=>{
    res.render('edit',)
});




app.post('/edit', (req,res)=>{
    const dateformet= {
        weekdat:"long",
        day:"numeric",
        month:"long",
    }
    const today = new Date().toLocaleDateString('en-US',dateformet )
    const post={
        date:today,
        title:req.body.titleEntery,
        data:req.body.postEntery,
    }
    posts.unshift(post);
    console.log(posts);
    const data_string = JSON.stringify(posts);
    fs.writeFile('blogs.txt', data_string, (err)=>{
        if(err)
        console.log(err)
    });
    res.redirect('/');
    // console.log(data_string)
    
});


app.get('/contact', (req,res)=>
    res.render('contact', {homedata:defaultpra})
);



app.get('/blog', (req,res)=>
    res.render('blog', {post:posts})
);


app.get('/about', (req,res)=>
    res.render('about',{homedata:defaultpra})
);


app.listen(80, ()=>
console.log('ready')
);