import env from'dotenv'
import { connectToDB } from './DB/index';
import app from './app'


env.config();

const PORT = process.env.PORT || 3001;

connectToDB().then(()=> {
    const server = app.listen(PORT,() => {
        console.log(`Somehting is cooking very hot at: ${PORT}`)
    })
    server.on('error',(error)=> {
        console.error(`server failed to run: ${error}`)
    })
}).catch((error)=> {
    console.error(`DB connection failed: ${error}`)
});

