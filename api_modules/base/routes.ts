import * as express from 'express';

const router = express.Router();

/**
 * Default Routes
 * */

router.get('/', function (req, res) {
    res.send('Welcome to info-server API\'s')
})

export default router;