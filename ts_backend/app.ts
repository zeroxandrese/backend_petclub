// Assuming models/server.ts exists and exports the Server class
import Server from './models/server';

// Access environment variables through process.env
import * as dotenv from 'dotenv';
dotenv.config();

const server = new Server();

server.listen();
