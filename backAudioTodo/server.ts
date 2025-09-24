import express, { Request, Response } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

const app = express();
app.use(cors(
    {
        origin: "*"
    }
));
app.use(express.json());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dbfhej7xk",
    api_key: process.env.CLOUDINARY_API_KEY || "873141682942693",
    api_secret: process.env.CLOUDINARY_API_SECRET || "plaYnfEB8JSoRUbophOGAHNK4n0",
    secure: true
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => ({
        folder: "taches_audio",
        resource_type: "auto",
        public_id: `${Date.now()}-${file.originalname}`
    })
});

const upload = multer({ storage });

app.post("/upload-audio", upload.single("audio"), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" });

    const file = req.file as Express.Multer.File & { path: string, filename: string };
    console.log(file)
    res.json({
        url: file.path,
        public_id: file.filename
    });
});

app.get("/", (req: Request, res: Response) => {
    res.send("Backend audio prêt ");
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`   Serveur démarré sur http://localhost:${PORT}`);
});
