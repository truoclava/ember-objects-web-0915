import Ember from 'ember';

export default Ember.Object.extend({
  firstName: null,
  lastName: null,
  nickName: null,
  age: null,
  authorOf: null,
  conferences: [],
  greet: function(){
    return `Hi, My name is ${this.get("firstName")} ${this.get("lastName")}. You can call me ${this.get("nickName")}`;
  },
  isOld: Ember.computed.gte('age', 30),
  wroteRuby: Ember.computed.equal('authorOf', 'Ruby'),

  addConference: function(conf) { 
    this.get('conferences').push(conf);    
    // var fullName = `${this.get("firstName")} ${this.get("lastName")}`;
  }

});



  // isOld: Ember.computed("age", function(){
  //   if (this.get("age") > 30) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }),
