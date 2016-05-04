/**
 * 200 (OK) Response
 */

module.exports = function sendOK (data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  sails.log.silly('res.ok() :: Sending 200 ("OK") response');

  // Set status code
  res.status(200);

  if (req.wantsJSON) {
    return res.jsonx(data);
  }

  options = (typeof options === 'string') ? { view: options } : options || {};

  if (options.view) {
    return res.view(options.view, { data: data });
  }

  else return res.guessView({ data: data }, function couldNotGuessView () {
    return res.jsonx(data);
  });

};
