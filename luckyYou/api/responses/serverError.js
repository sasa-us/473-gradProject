/**
 * 500 (Server Error) Response
 
 * If something throws in a policy or controller, or an internal
 * error is encountered, Sails will call `res.serverError()`
 * automatically.
 */

module.exports = function serverError (data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // Set status code
  res.status(500);

  // Log error to console
  if (data !== undefined) {
    sails.log.error('Sending 500 ("Server Error") response: \n',data);
  }
  else sails.log.error('Sending empty 500 ("Server Error") response');

  if (sails.config.environment === 'production') {
    data = undefined;
  }

  if (req.wantsJSON) {
    return res.jsonx(data);
  }

  options = (typeof options === 'string') ? { view: options } : options || {};

  if (options.view) {
    return res.view(options.view, { data: data });
  }

  else return res.view('500', { data: data }, function (err, html) {

    if (err) {
      
      if (err.code === 'E_VIEW_FAILED') {
        sails.log.verbose('res.serverError() :: Could not locate view for error page (sending JSON instead).  Details: ',err);
      }
      else {
        sails.log.warn('res.serverError() :: When attempting to render error page view, an error occured (sending JSON instead).  Details: ', err);
      }
      return res.jsonx(data);
    }

    return res.send(html);
  });

};

