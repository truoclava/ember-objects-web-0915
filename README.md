# Ember Objects
While you may never have to write your own Ember Object, you should know how they work since everything you'll be working with inherits from it.

**Ember Models**
![Models Inherit from Ember.Object](https://readme-pics.s3.amazonaws.com/ember-model-from-object.png)
**Ember Controllers**
![Controllers Inherit from Ember.Object](https://readme-pics.s3.amazonaws.com/ember-controller-from-object.png)
**Ember Services**
![Services Inherit from Ember.Object](https://readme-pics.s3.amazonaws.com/ember-service-from-object.png)

Because of this, knowing how to work with Ember Objects is kind of a big deal. Let's get started.

## Creating Instances
Creating a new instance of a generic Ember Object is easy.

```javascript
var obj = Ember.Object.create({name: "Bob"});
obj.get("name"); // "Bob"
obj.get("age"); // undefined
obj.set("age", 35);
obj.get("age"); // 35
```

Ember Objects expect you to interact with properties using the `get` and `set` methods. These methods allow Ember to update dependent properties, as we'll see later in the `Computed Properties` section.

Ember Objects are like JavaScript objects, in that they are open. You can add any property to an object, no need to define setters.

What if we don't want a generic object? What if we want to design an object with functions an properties? Enter the `extend` keyword.

```javascript
var Person = Ember.Object.extend({
  name: null,
  greet: function(){
    return `${this.get("name")} says "Hi!"`;
  }
});

var bob = Person.create({name: "Bob", age: 35});
bob.greet();
```

Here we create a `Person` Object. We can pass `create` properties, even if they're not defined in the prototype. It's a good idea to set the expected properties to null to let users of your Object know what it expects. It's not required though.

In the test you will see your classes imported like  this:

```javascript
export default Ember.Object.extend();
```

This is the same as saying:
```javascript
var MyObject = Ember.Object.extend();
export default MyObject;
```

It's a shortcut.

## Computed Properties

Computed properties are a super power in Ember and the fact that they're in EVERY OBJECT should get you excited. A computed property is a property that gets updated as you object changes. You define a list of properties you depend on, and when one of those change (meaning someone called `set` on it), your computed property will also change. It's lazy so it won't regenerate the value every time, only when there's a change. Here's a simple example.

Let's say we want to have the total price of an item update based on the price &times; the quantity. In regular javascript you might define a function called total that will multiply price and quantity, but this would run every time. We only need it to run once, and only when it's changed after that.
Here's the Ember code for that:

```javascript
var Item = Ember.Object.extend({
  price: 0,
  quantity: 0,
  total: Ember.computed("price", "quantity", function(){
    return this.get("price") * this.get("quantity");
  })
})

var ham  = Item.create({price: 3, quantity: 1});
ham.get("total"); // 3
ham.set("quantity", 5)
ham.get("total"); //15
```

Be sure to look at the created ones ember makes for you [here](http://emberjs.com/api/classes/Ember.computed.html).

### Working with collections

Ember lets you monitor changes to the properties in a collection too. Let's setup a shopping cart with items. The shopping cart will hold a series of items.

```javascript
var ShoppingCart = Ember.Object.extend({
  items: [],
  total: Ember.computed("items.@each.total", function(){
    return this.get("items").reduce(function(memo, item){
      return memo + item.get('total');
    }, 0);
  })
});

var Item = Ember.Object.extend({
  price: 0,
  quantity: 0,
  total: Ember.computed("price", "quantity", function(){
    return this.get("price") * this.get("quantity");
  })
});
var ham     = Item.create({price: 3, quantity: 1});
var cheese  = Item.create({price: 5, quantity: 1});
var bread   = Item.create({price: 2, quantity: 1});
var cart = ShoppingCart.create();
cart.get("total"); // 0

cart.get('items').pushObjects([ham, cheese, bread]);
cart.get("total"); // 10

```
This function will run only when the `total` property of an item is changed. We used that weird `items.@each.total` property to say just that. Notify me when any of the item's total changes.

What if we wanted to update when an item is added or removed? Say we wanted a total number of items in the cart:

```javascript
var ShoppingCart = Ember.Object.extend({
  items: [],
  total: Ember.computed("items.@each.total", function(){
    return this.get("items").reduce(function(memo, item){
      return memo + item.get('total');
    }, 0);
  }),
  numberOfItems: Ember.computed("items.[]", function(){
    return this.get('items.length');
  })
});

var Item = Ember.Object.extend({
  price: 0,
  quantity: 0,
  total: Ember.computed("price", "quantity", function(){
    return this.get("price") * this.get("quantity");
  })
});
var ham     = Item.create({price: 3, quantity: 1});
var cheese  = Item.create({price: 5, quantity: 1});
var bread   = Item.create({price: 2, quantity: 1});
var cart = ShoppingCart.create();
cart.get("numberOfItems"); // 0

cart.get('items').pushObjects([ham, cheese, bread]);
cart.get("numberOfItems"); // 3
```

Here we did 2 things. One is the use of `items.[]`. This means update the computed property if the number of elements changes. You won't be notified of changes to properties. The other thing we did is `return this.get('items.length')`. Ember lets you chain messages inside of `get`s and `sets`s. You can use a short hand for this though, by using one of Ember's built in computed properties. Basically what we're doing is creating an alias for `items.length` that updates. Instead of the function we have for `numberOfItems`, we can have this instead:

```javascript
var ShoppingCart = Ember.Object.extend({
  items: [],
  total: Ember.computed("items.@each.total", function(){
    return this.get("items").reduce(function(memo, item){
      return memo + item.get('total');
    }, 0);
  }),
  numberOfItems: Ember.computed.alias("items.length")
});

var Item = Ember.Object.extend({
  price: 0,
  quantity: 0,
  total: Ember.computed("price", "quantity", function(){
    return this.get("price") * this.get("quantity");
  })
});
var ham     = Item.create({price: 3, quantity: 1});
var cheese  = Item.create({price: 5, quantity: 1});
var bread   = Item.create({price: 2, quantity: 1});
var cart = ShoppingCart.create();
cart.get("numberOfItems"); // 0

cart.get('items').pushObjects([ham, cheese, bread]);
cart.get("numberOfItems"); // 3
```

So nice!
