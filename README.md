Install all dependecies with `npm install`.

The entry point for any app is `src/index.ts`.
If you wish to change it you can do so by editing the `"build:live": "nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/your-entry-point.ts"` property in `package.json`.

This project uses `dotenv` to help you work with environment variables.
Just add a `.env` file to the root directory with all your environment variables and they will be automatically loaded into `process.env`.  
**Do not commit your `.env` file.**

**Start the development environment:** `npm run dev`  
**Run Jest tests:** `npm test`  
**Build the project:** `npm run build`  
