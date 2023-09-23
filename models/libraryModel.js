const mongoose = require("mongoose");
const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter book title."],
    },
    author:{
      type:String,
      required:[true,"Please enter author name."],
    },
    synopsis:{
      type:String,
      required:true,
      default:"Not Available"
    },
    publish_date:{
      type:Date,
      required:[true,"Please enter publish date"]
    },
    genre:{
      type:[],
      required:true,
      default:["NA"]
    },
    copies: {
      type: Number,
      required: true,
      default: 0,
      min:0,
    },
    availability:{
      type:Boolean,
      required:true,
      default:false
    },    
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Book", productSchema);
module.exports = Product;
