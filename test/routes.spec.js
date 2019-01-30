const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server.js');
const states = require('../data/states.js');
const festivals = require('../data/festivals.js');

chai.use(chaiHttp);

describe('Client Routes', () => {
  // happy path
  it('should return the homepage with text', done => {
    chai.request(server)
      .get('/')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.should.equal('US Music Festivals API');
        done();
      });
  });

  // sad path
  it('should return 404 for nonexisting routes', done => {
    chai.request(server)
      .get('/sad')
      .end((err, response) => {
        response.should.have.status(404)
        done();
      });
  });
});

describe('API Routes', () => {
  before(done => {
    // Run migrations and seeds for test database
    done();
  });

  beforeEach((done) => {
    // Would normally run your seed(s), which includes clearing all records
    // from each of the tables
    server.locals.states = states;
    server.locals.festivals = festivals;
    done();
  });

  describe('/api/v1/states', () => {
    it('GET should return all states', done => {
      chai.request(server)
        .get('/api/v1/states')
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body[0].should.have.property('state')
          response.body[0].should.have.property('number_of_music_festivals')
          response.body[0].should.have.property('major_airport')
          response.body[0].should.have.property('tourism_website')
          done();
        })
    });

    //happy path
    it('POST should create a new state', done => {
      chai.request(server)
        .post('/api/v1/states')
        .send({
          state: 'New Jersey',
          number_of_music_festivals: 5,
          major_airport: 'Newark Liberty International Airport',
          tourism_website: 'https://www.visitnj.org'
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('state');
          response.body.state.should.equal('New Jersey');
          response.body.should.have.property('number_of_music_festivals');
          response.body.number_of_music_festivals.should.equal(5);
          response.body.should.have.property('major_airport');
          response.body.major_airport.should.equal('Newark Liberty International Airport');
          response.body.should.have.property('tourism_website');
          response.body.tourism_website.should.equal('https://www.visitnj.org');
          done();
        })
    });

    // sad path
    it('POST should return a 422 error when creating a new state', done => {
      chai.request(server)
        .post('/api/v1/states')
        .send({
          state: 'New Jersey',
          number_of_music_festivals: 5,
          major_airport: 'Newark Liberty International Airport'
          //tourism_website information is missing
        })
        .end((err, response) => {
          response.should.have.status(422);
          response.body.error.should.equal('You are missing data! Expected format: {  state: <string>, number_of_music_festivals: <number>, major_airport: <string>, tourism_website: <string> }');
          done();
        });
    });
  });

  // describe('/api/v1/festivals', () => {
  //   it('GET should return all festivals', done => {

  //   });

  //   it('POST should create a festival', done => {

  //   });

  //   it('POST should return a 422 error when creating a new festival', done => {

  //   });
  // });

  // describe('/api/v1/states/:stateID', () => {
  //   it('PATCH should update a state's data', done => {

  //   });

  //   it('PATCH should return a 404 error if state is not found in database', () => {

  //   });

  //   it('DELETE should delete a state', done => {

  //   });

  //   it('DELETE should return a 404 error if state is not found', () => {

  //   });
  // });

  // describe('/api/v1/states/:stateID/festivals', () => {
  //   it('GET should return all festivals by state', done => {

  //   });

  //   it('GET should return a 404 error if state not found', done => {

  //   });
  // });

  // describe('/api/v1/festivals/:festivalID', () => {
  //   it('GET should return a festival by id', done => {

  //   });

  //   it('should PATCH to festivals', done => {

  //   });

  //   it('PATCH should return a 404 error', done => {

  //   });

  //   it('should DELETE a festival by id', done => {

  //   });

  //   it('DELETE should return a 404 error', done => {

  //   });

  // });
})