import express from 'express';
import cors from 'cors';
import camisetasRouter from './routes/camisetas.routes.js';
import comandasRouter from './routes/comandas.routes.js';

const app = express();
const PORT = 3001;

const corsOptions = {
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'], 
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions))
app.use(express.json());

// Middleware de log
app.use((req, res, next) => {
   console.log(req.method, req.url);
   next();
});


// Montar rutas
app.use('/api/camisetas', camisetasRouter);
app.use('/api/comandas', comandasRouter);

// Middleware de errores global
app.use((err, req, res, next) => {
   console.error(err.message);
   res.status(500).json({ message: "Error interno" });
});

app.listen(PORT, () => {
   console.log(`Servidor corriendo en http://localhost:${PORT}/`);
});