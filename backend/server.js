import express from "express"
import dotenv from "dotenv"
import connectDB from "./database/db.js"
import userRoute from "./routes/user.route.js"
import blogRoute from "./routes/blog.route.js"
import commentRoute from "./routes/comment.route.js"
import cookieParser from 'cookie-parser';
import cors from 'cors'
import path from "path"

dotenv.config()
const app = express()

const PORT = process.env.PORT || 5000


// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
const allowedOrigins = [
    "https://blog-9j4h.onrender.com",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
];

app.use(cors({
    origin: (origin, callback) => {
        const isDev = process.env.NODE_ENV !== 'production';
        if (isDev) return callback(null, true);
        if (!origin) return callback(null, true);
        if (
            allowedOrigins.includes(origin) ||
            origin?.startsWith('http://localhost') ||
            origin?.startsWith('http://127.0.0.1')
        ) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 204
}))

const _dirname = path.resolve()

// apis
 app.use("/api/v1/user", userRoute)
 app.use("/api/v1/blog", blogRoute)
 app.use("/api/v1/comment", commentRoute)

 app.use(express.static(path.join(_dirname,"/frontend/dist")));
 app.get("*", (_, res)=>{
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
 });

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server listening at port ${PORT}`);
    })
}).catch((err)=>{
    console.error("Failed to connect to MongoDB", err);
});
