[
  '{{repeat(5, 7)}}',
  {
    id:'{{index()}}',
    name: '{{firstName()}} {{surname()}}',
    username: function(){
      return 'user'+this.id;
    },
    email: function(){
      return this.username+'@gmail.com';
    },
    password:'pass',
    img:'http://via.placeholder.com/200/{{integer(700,999)}}/fff',
    animals:[
      '{{repeat(5, 15)}}',
      {
        id:'{{index()}}',
        name:'{{company()}}',
        type:'{{random("cat", "dog", "horse")}}',
        breed:function(tags){
          var breeds = {
            cat:["siamese","shorthair","ginger"],
            dog:["husky","shnouzer","beagle"],
            horse:["white","black","brown","andalusian"]
          };
          var breed_array = breeds[this.type];
          var chosen_index =
              tags.integer(0,breed_array.length-1);
          return breed_array[chosen_index];
        },
        img:function(tags){
          return 'http://via.placeholder.com/200/'+
            tags.integer(700,999)+'/fff?text='+this.name;
        },
        locations:[
          '{{repeat(5, 15)}}',
          {
            id:'{{index()}}',
            lat:'{{floating(37.807116, 37.696057)}}',
            lng:'{{floating(-122.509472, -122.362914)}}',
            description:'{{lorem(2,"sentences")}}',
            date:'{{date(new Date(2018, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}'
          }
        ]
      }
    ]
  }
]


/*
[
  '{{repeat(5, 7)}}',
  {
    _id: '{{objectId()}}',
    index: '{{index()}}',
    guid: '{{guid()}}',
    isActive: '{{bool()}}',
    balance: '{{floating(1000, 4000, 2, "$0,0.00")}}',
    picture: 'http://placehold.it/32x32',
    age: '{{integer(20, 40)}}',
    eyeColor: '{{random("blue", "brown", "green")}}',
    name: '{{firstName()}} {{surname()}}',
    gender: '{{gender()}}',
    company: '{{company().toUpperCase()}}',
    email: '{{email()}}',
    phone: '+1 {{phone()}}',
    address: '{{integer(100, 999)}} {{street()}}, {{city()}}, {{state()}}, {{integer(100, 10000)}}',
    about: '{{lorem(1, "paragraphs")}}',
    registered: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss Z")}}',
    latitude: '{{floating(-90.000001, 90)}}',
    longitude: '{{floating(-180.000001, 180)}}',
    tags: [
      '{{repeat(7)}}',
      '{{lorem(1, "words")}}'
    ],
    friends: [
      '{{repeat(3)}}',
      {
        id: '{{index()}}',
        name: '{{firstName()}} {{surname()}}'
      }
    ],
    greeting: function (tags) {
      return 'Hello, ' + this.name + '! You have ' + tags.integer(1, 10) + ' unread messages.';
    },
    favoriteFruit: function (tags) {
      var fruits = ['apple', 'banana', 'strawberry'];
      return fruits[tags.integer(0, fruits.length - 1)];
    }
  }
]
*/