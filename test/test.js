const expect = require('expect.js');

const appToken = process.env.APP_TOKEN;
const core = require('../index')(process.env.CORE_URL);

// Dummy request
const request = () => ({
  params: {
    model: 'User',
  },
  headers: {
    'app-authentication': appToken,
  },
});

// Dummy response
const res = done => ({
  status: status => ({
    json: (obj) => {
      console.log(obj.message); // eslint-disable-line no-console
      expect(status).to.be.equal(200);
      done();
    },
  }),
});

describe('index', () => {
  describe('#getClientConfig()', () => {
    it('should return config', (done) => {
      const req = request();
      core.getClientConfig(req, res(done), () => {
        expect(req).to.have.key('appConfig');
        expect(req.appConfig.token).to.be.equal(appToken);
        done();
      });
    });
  });

  describe('#getClientConfigAndModel()', () => {
    it('should return config and model', (done) => {
      const req = request();
      core.getClientConfigAndModel(req, res(done), () => {
        expect(req).to.have.keys(['appConfig', 'appModel']);
        expect(req.appConfig.token).to.be.equal(appToken);
        expect(req.appModel.name).to.be.equal('User');
        done();
      });
    });
  });

  describe('#getClientModel()', () => {
    it('should return model', (done) => {
      const req = request();
      core.getClientModel(req, res(done), () => {
        expect(req).to.have.keys(['appModel']);
        expect(req.appModel.name.type).to.be.equal('string');
        done();
      });
    });
  });
});
