const axios = require('axios');

const configUrl = '/api/v1/configs';
const modelUrl = '/api/v1/models/User';
const configAndModelUrl = '/api/v1/configsandmodel/User';

const errMissingCoreUrl = 'Missing coreurl';
const errAccessDenied = 'Access denied!';
const errMiddleware = 'Issue with config middleware: #';

const authHeaderKey = 'app-authentication';

const handleError = (str, message) => str.replace('#', message);

module.exports = (coreUrl) => {
  if (!coreUrl) throw new Error(errMissingCoreUrl);

  const getPreConfiguredAxios = (req, res) => {
    if (!req.headers[authHeaderKey]) return res.status(401).json({ message: errAccessDenied });
    axios.defaults.headers.common[authHeaderKey] = req.headers[authHeaderKey];
    return axios;
  };

  return {
    getClientConfig: (req, res, next) => {
      const url = `${coreUrl}${configUrl}`;
      const ax = getPreConfiguredAxios(req, res);
      return ax.get(url)
        .then(({ data }) => {
          req.appConfig = data;
          next();
        })
        .catch(e => res.status(500).json({ message: handleError(errMiddleware, e.message) }));
    },

    getClientConfigAndModel: (req, res, next) => {
      const url = `${coreUrl}${configAndModelUrl}`;
      const ax = getPreConfiguredAxios(req, res);
      return ax.get(url)
        .then(({ data }) => {
          req.appConfig = data.config;
          req.appModel = data.model;
          next();
        })
        .catch(e => res.status(500).json({ message: handleError(errMiddleware, e.message) }));
    },

    getClientModel: (req, res, next) => {
      const url = `${coreUrl}${modelUrl}`;
      const ax = getPreConfiguredAxios(req, res);
      return ax.get(url)
        .then(({ data }) => {
          req.appConfig = data.config;
          req.appModel = data.model;
          next();
        })
        .catch(e => res.status(500).json({ message: handleError(errMiddleware, e.message) }));
    },
  };
};
