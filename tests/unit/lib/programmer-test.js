/* jshint expr:true */
import { expect } from 'chai';
import { describe, it, beforeEach} from 'mocha';
import Programmer from 'ember-objects/lib/programmer';
import Conference from 'ember-objects/lib/conference';

describe("Programmer", function(){
  var matz;
  beforeEach(function(){
    Conference.create();
    matz = Programmer.create({
      firstName: "Yukihiro",
      lastName: "Matsumoto",
      nickName: "Matz",
      age: 50,
      authorOf: "Ruby",
      conferences: []
    });
  });
  describe("Regular functions", function(){
    it("knows how to greet", function(){
      expect(matz.greet()).to.eq("Hi, My name is Yukihiro Matsumoto. You can call me Matz");
    });
  });

  describe("Computed Properties", function(){
    it("isOld if older than 30", function(){
      // use gte computed property
      expect(matz.get('isOld')).to.eq(true);
      matz.set('age', 29);
      expect(matz.get('isOld')).to.eq(false);
    });

    it("knows if they wroteRuby", function(){
      // use equal computed property
      expect(matz.get('wroteRuby')).to.eq(true);
      let steven = Programmer.create({authorOf: "This lab"});
      expect(steven.get('wroteRuby')).to.eq(false);
    });

    it("knows what conferences the programmer is the keynote for", function(){
      // You'll have to use a computed property on aggregated data
      // http://guides.emberjs.com/v2.1.0/object-model/computed-properties-and-aggregate-data/
      let rubyConf = Conference.create({name: "Ruby Conf", keyNote: "Yukihiro Matsumoto"});
      let elixirConf = Conference.create({name: "Elixir Conf", keyNote: "Jose Valim"});
      matz.addConference(rubyConf);
      matz.addConference(elixirConf);

      expect(matz.get('conferences.length')).to.eq(2);
      expect(matz.get('keyNoteConferences')).to.include(rubyConf);
      expect(matz.get('keyNoteConferences')).to.not.include(elixirConf);

      elixirConf.set("keyNote", "Yukihiro Matsumoto");
      expect(matz.get('keyNoteConferences')).to.include(elixirConf);
    });
    it("returns all conference names", function(){
      let elixirConf = Conference.create({name: "Elixir Conf", keyNote: "Jose Valim"});
      let rubyConf = Conference.create({name: "Ruby Conf", keyNote: "Yukihiro Matsumoto"});

      matz.addConference(elixirConf);
      matz.addConference(rubyConf);

      expect(matz.get('conferenceNames')).to.contain('Ruby Conf');
      expect(matz.get('conferenceNames')).to.contain('Elixir Conf');
    });

    it("counts the number of conferences they are speaking at", function(){
      let elixirConf = Conference.create({name: "Elixir Conf", keyNote: "Jose Valim"});
      let rubyConf = Conference.create({name: "Ruby Conf", keyNote: "Yukihiro Matsumoto"});

      matz.addConference(elixirConf);
      matz.addConference(rubyConf);

      expect(matz.get("conferenceTotal")).to.eq(2);
      expect(matz.get("itinerary")).to.eq("Matz is speaking at 2 conferences");
    });

    it("has a valid email address", function(){
      matz.set('email', "notValid");
      expect(matz.get('hasValidEmail')).to.eq(false);

      matz.set('email', "matz@example.com");
      expect(matz.get('hasValidEmail')).to.eq(true);
    });

    it("is invalid unless it has firstName, lastName, age, and valid email", function(){
      let steven = Programmer.create();
      expect(steven.get('isInvalid')).to.eq(true);
      expect(steven.get('errors')).to.contains("firstName cannot be blank");
      expect(steven.get('errors')).to.contains("lastName cannot be blank");
      expect(steven.get('errors')).to.contains("age cannot be blank");
      expect(steven.get('errors')).to.contains("email must be valid");
    });

    it("object can be made valid",function(){
      expect(matz.get("isInvalid")).to.eq(true);
      expect(matz.get("errors.length")).to.eq(1);
      expect(matz.get('errors')).to.contains("email must be valid");
      expect(matz.get("hasErrors")).to.eq(true);

      matz.set('email', "matz@example.com");
      expect(matz.get("isValid")).to.eq(true);
      expect(matz.get("errors.length")).to.eq(0);
      expect(matz.get("hasErrors")).to.eq(false);
    });
  });
});
