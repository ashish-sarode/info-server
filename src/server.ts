import app from './app';

const PORT = app.get("port");
const ENV_MODE = app.get("mode");

const server = app.listen(PORT, () => {
    console.log("API are successfully running on http://localhost:%d in %s mode", PORT, ENV_MODE);
})

export default server;