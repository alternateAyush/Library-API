require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/libraryModel");
const app = express();
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;
const cors=require('cors')

//middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ 
      "all books link": "https://library-api-v1.onrender.com/books",
      "all books link by query": "https://library-api-v1.onrender.com/books/search/query",
      "all books link a-z": "https://library-api-v1.onrender.com/books/a-z",
      "all books link z-a": "https://library-api-v1.onrender.com/books/z-a",
      "all books link asce-price": "https://library-api-v1.onrender.com/books/asce-price",
      "all books link desce-price": "https://library-api-v1.onrender.com/books/desce-price",
      "by author's name":"https://library-api-v1.onrender.com/books/author/author's-name",
      "by book's title":"https://library-api-v1.onrender.com/books/title/book's-title",
      "by book's genre":"https://library-api-v1.onrender.com/books/genre/book's-genre",
    });
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json({"count":books.length,"array":books});
  } catch (error) {
    console.log("error in get /books", error.message);
    res.status(500).json({ message: error.message });
  }
});
app.get("/books/search/:query", async (req, res) => {
  try {
    const query=req.params.query;
    const books1 = await Book.find({
      title: { $regex: `${query}`, $options: "i" },
    }).limit(5);
    const books2 = await Book.find({
      author: { $regex: `${query}`, $options: "i" },
    }).limit(5);
    const books = [];
    if(books1.length==5){
      for(let i=0; i<books1.length; i++){
        books.push({id: books1[i].id, author:books1[i].author, title: books1[i].title})
      }
    }else if(books2.length==5){
      for(let i=0; i<books2.length; i++){
        books.push({id: books2[i].id, author:books2[i].author, title: books2[i].title})
      }
    }
    else if(books1.length<5 && books2.length<5)
    {
      for(let i=0; i<books1.length; i++){
        books.push({id: books1[i].id, author:books1[i].author, title: books1[i].title})
      }
      for(let i=0; i<books2.length; i++){
        books.push({id: books2[i].id, author:books2[i].author, title: books2[i].title})
      }
    }    
    res.status(200).json({"count":books.length,"array":books});
  } catch (error) {
    console.log("error in get /books", error.message);
    res.status(500).json({ message: error.message });
  }
});
app.get("/books/a-z", async (req, res) => {
  try {
    const books = await Book.find({}).sort({ title:1});
    res.status(200).json({"count":books.length,"array":books});
  } catch (error) {
    console.log("error in get /books", error.message);
    res.status(500).json({ message: error.message });
  }
});
app.get("/books/z-a", async (req, res) => {
  try {
    const books = await Book.find({}).sort({ title:-1});
    res.status(200).json({"count":books.length,"array":books});
  } catch (error) {
    console.log("error in get /books", error.message);
    res.status(500).json({ message: error.message });
  }
});
app.get("/books/desce-price", async (req, res) => {
  try {
    const books = await Book.find({}).sort({ price:-1});
    res.status(200).json({"count":books.length,"array":books});
  } catch (error) {
    console.log("error in get /books", error.message);
    res.status(500).json({ message: error.message });
  }
});
app.get("/books/asce-price", async (req, res) => {
  try {
    const books = await Book.find({}).sort({ price:1});
    res.status(200).json({"count":books.length,"array":books});
  } catch (error) {
    console.log("error in get /books", error.message);
    res.status(500).json({ message: error.message });
  }
});
app.get("/books/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const books = await Book.find({
      author: { $regex: `${author}`, $options: "i" },
    });
    res.status(200).json({"count":books.length,"array":books});
    console.log("params ", author);
  } catch (error) {
    console.log("error in get /books/author/:author", error.message);
    res.status(500).json({ message: error.message });
  }
});
app.get("/books/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const books = await Book.find({
      title: { $regex: `${title}`, $options: "i" },
    });
    res.status(200).json({"count":books.length,"array":books});
    console.log("params ", title);
  } catch (error) {
    console.log("error in get /books/title/:title", error.message);
    res.status(500).json({ message: error.message });
  }
});
app.get("/books/genre/:genre", async (req, res) => {
  try {
    const genre = req.params.genre;
    const books = await Book.find({
      genre: { $regex: `${genre}`, $options: "i" },
    });
    res.status(200).json({"count":books.length,"array":books});
    console.log("params ", genre);
  } catch (error) {
    console.log("error in get /books/genre/:genre", error.message);
    res.status(500).json({ message: error.message });
  }
});
app.get("/books/publish/:date", async (req, res) => {
  try {    
    const target_date=new Date(`${req.params.date}`);
    const books = await Book.find({"publish_date": {"$gt": target_date}})
    res.status(200).json({"count":books.length,"array":books});
    console.log("params ", target_date);
    // const target_year = req.params.date;
    // const pipeline = [
    //   {
    //     $addFields: {
    //       year: { $year: "$publish_date" },
    //     },
    //   },
    //   {
    //     $match: {
    //       year: target_year,
    //     },
    //   },
    // ];
    // const books = Book.aggregate(pipeline);
    // res.status(200).json(books);
    // console.log("params ", target_year);
  } catch (error) {
    console.log("error in get /books/publish/:date", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.post("/books/:password", async (req, res) => {
  try {
    if(apiKey!=req.params.password){
      throw {message: "incorrect password"}
    }
    const book = await Book.create(req.body);
    res.status(200).json(book);
  } catch (error) {
    console.log("error in /book ", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.put("/books/buy/:password/:id", async (req, res) => {
  try {
    if(apiKey!=req.params.password){
      throw {message: "incorrect password"}
    }
    const id = req.params.id;
    const book = await Book.findByIdAndUpdate(id, req.body);
    if (!book) {
      res.status(400).json({ message: `Book with id ${id} not found.` });
    }
    const newBook = await Book.findById(id);
    res.status(200).json(newBook);
    console.log("params ", id);
  } catch (error) {
    console.log("error in put /books/buy/:id", error.message);
    res.status(500).json({ message: error.message });
  }
});

app.delete("/books/:password/:id", async (req, res) => {
  try {
    if(apiKey!=req.params.password){
      throw {message: "incorrect password"}
    }
    const id = req.params.id;
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      res.status(400).json({ message: `Book with id ${id} not found.` });
    }
    res
      .status(200)
      .json({ status: 200, message: `Book with id ${id} deleted.` });
  } catch (error) {
    console.log("error in delete /books/:id", error.message);
    res.status(500).json({ message: error.message });
  }
});

mongoose
  .connect(`${dbUrl}`)
  .then(() => {
    console.log("Successfuly connected to mongoDb");
    app.listen(3030, () => {
      console.log("app is running on port 3000");
    });
  })
  .catch((error) => {
    console.log("Failed to connect to mongoDb: ", error);
  });
