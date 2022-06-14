import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

const db = mysql.createConnection({
    host:'localhost',
    port:8889,
    user:'root',
    password:'root',
    database:'FacebookPosts'
  })


const server = express();
server.use(cors());
server.use(express.json());


db.connect(error=>{
    if(error) console.log('Sorry cannot connect to db: ' , error);
    else console.log('Connected to mysql db');
  })



  const storage = multer.diskStorage({
    // creating configuration here
    // allocating destination and giving file name (original)
    destination: function (req, file, cb) {
      cb(null, './uploads')
      // this is the name of the folder where you want the images to store 
    },
    filename: function (req, file, cb) {
     
      cb(null, file.originalname )
    // cb(null, Date.now() + '-' + file.originalname );

    }
  })

const fileupload = multer({storage: storage})


server.post('/uploads', fileupload.single("img"), (req, res)=>{
    // sending file details in file
    console.log(req.file);
    res.json({ fileupload: true });


});

server.use(express.static('uploads'));

server.get('/posts',(req, res)=>{
    let allProducts = "CALL `AllPosts`()";

    db.query(allProducts, (error, data)=>{

     if(error){
         res.json({ErrorMessage:error});
     }else{
         res.json(data[0]);
     }

    })
 
})


server.post('/posts',(req, res)=>{
    let newPost = "CALL `NewPost`(?, ?)";
    db.query(newPost,[req.body.description, req.body.image], (error, data)=>{

        if(error){
            res.json({ErrorMessage:error});
        }else{
            res.json(data[0][0]);
        }

    })
})


server.put('/posts', (req, res)=>{
    let query = " CALL `updatePost`(?, ?, ?)"
    db.query(query, [req.body.id, req.body.description, req.body.image], (error, data)=>{
        if(error){
            res.json({ErrorMessage});

        }else{
            res.json({
                data:data[0][0]
            })
        }
    })
})


server.delete('/posts/:id', (req, res)=>{
    let deletePost = "CALL `DeletePost`(?)"
    db.query(deletePost, [req.params.id], (error, data)=>{
        if(error){
            res.json({message:error});
        }else{
            if(data[0][0].DEL_SUCCESS === 0){
            res.json({message:data[0][0].DEL_SUCCESS})
            }else{
                res.json({message:data[0][0].DEL_SUCCESS})
            }
        }
    })
})

server.get('/posts/:id', (req,res)=>{
    let query =  "CALL `postById`(?)";
    db.query(query, [req.params.id], (error, data)=>{
        if(error){
            res.json({message:error})
        }else{
            res.json({data:data})
        }
    })

})


server.listen(4800, function(){



    console.log("Node Express server is now running on port 4800");

})