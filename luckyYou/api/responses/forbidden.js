/**
 * 403 (Forbidden) Handler
 */

module.exports = function forbidden (data, options) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // Set status code
  res.status(403);

  // Log error to console
  if (data !== undefined) {
    sails.log.verbose('Sending 403 ("Forbidden") response: \n',data);
  }
  else sails.log.verbose('Sending 403 ("Forbidden") response');

  if (sails.config.environment === 'production') {
    data = undefined;
  }
  if (req.wantsJSON) {
    return res.jsonx(data);
  }

  // If second argument is a string, we take that to mean it refers to a view.
  // If it was omitted, use an empty object (`{}`)
  options = (typeof options === 'string') ? { view: options } : options || {};

  if (options.view) {
    return res.view(options.view, { data: data });
  }

  else return res.view('403', { data: data }, function (err, html) {

    // If a view error occured, fall back to JSON(P).
    if (err) {
      if (err.code === 'E_VIEW_FAILED') {
        sails.log.verbose('res.forbidden() :: Could not locate view for error page (sending JSON instead).  Details: ',err);
      }
      
      else {
        sails.log.warn('res.forbidden() :: When attempting to render error page view, an error occured (sending JSON instead).  Details: ', err);
      }
      return res.jsonx(data);
    }

    return res.send(html);
  });

};

