// success response
const ReS = (res, data, code) => {
    if (typeof code !== 'undefined') res.status(code);
    else res.status(200);
    return res.json(data);
}

// error response
const ReE = (res, err, code) => {
    if (typeof code !== 'undefined') res.status(code);
    else res.status(400);
    return res.json(err);
}

module.exports = { ReS, ReE }