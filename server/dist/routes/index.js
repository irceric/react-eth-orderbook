"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get('/ping', (req, res) => {
    res.send({ response: 'I am alive' }).status(200);
});
exports.default = router;
//# sourceMappingURL=index.js.map