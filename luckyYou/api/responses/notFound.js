/**
 * 404 (Not Found) Handler
 
 * return res.notFound()
 * NOTE:
 * If a request doesn't match any explicit routes (i.e. `config/routes.js`)
 * or route blueprints (i.e. "shadow routes", Sails will call `res.notFound()`
 * automatically.
 */

module.exports = function notFound (data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // Set status code
  res.status(404);

  // Log error to console
  if (data !== undefined) {
    sails.log.verbose('Sending 404 ("Not Found") response: \n',data);
  }
  else sails.log.verbose('Sending 404 ("Not Found") response');

  if (sails.config.environment === 'production') {
    data = undefined;
  }

  // If the user-agent wants JSON, always respond with JSON
  if (req.wantsJSON) {
    return res.jsonx(data);
  }

  options = (typeof options === 'string') ? { view: options } : options || {};

  if (options.view) {
    return res.view(options.view, { data: data });
  }

  else return res.view('404', { data: data }, function (err, html) {

    // If a view error occured, fall back to JSON(P).
    if (err) {
      if (err.code === 'E_VIEW_FAILED') {
        sails.log.verbose('res.notFound() :: Could not locate view for error page (sending JSON instead).  Details: ',err);
      }
      else {
        sails.log.warn('res.notFound() :: When attempting to render error page view, an error occured (sending JSON instead).  Details: ', err);
      }
      return res.jsonx(data);
    }

    return res.send(html);
  });

};

