Vue.config.devtools = true;

var randomValues = function() {
  var values = [];
  for (var i = 0; i < 64; i++) {
    values.push(Math.random());
  }
  return values;
};

var QuicksortComponent = Vue.extend({
  template: '' +
    '<div id="quicksort">' +
      '<div class="items">' +
        '<div v-for="item in items" :style="{ height: (item.value * 100) + \'%\' }" :class="{item: true, checking: item.checking, pivot: item.pivot}">' +
          '<div class="inner"></div>' +
        '</div>' +
      '</div>' +
      '<div class="ops">' +
        '<button @click="sort" :disabled="sorting">sort</button>' +
        '<button @click="reset">reset</button>' +
        '<select v-model="speed">' +
          '<option value="0" selected>fast</option>' +
          '<option value="100">medium</option>' +
          '<option value="1000">slow</option>' +
        '</select>' +
      '</div>' +
    '</div>',

  data: function() {
    var values = randomValues();
    var items = [];

    for (var i in values) {
      items.push({
        value: values[i],
        pivot: false,
        checking: false
      });
    }

    return {
      items: items,
      pivotIndex: null,
      checking: null,
      speed: 0,
      checkTimer: null,
      swapTimer: null,
      sorting: false
    };
  },

  methods: {
    sort: function(e) {
      e.preventDefault();
      var self = this;
      self.sorting = true;
      self.quicksort(0, self.items.length - 1, function() {
        self.sorting = false;
      });
    },

    quicksort: function(l, r, done) {
      var self = this;

      if (l >= r) {
        if (done) done();
        return;
      }

      self.items[r].pivot = true;
      var pivot = self.items[r].value;

      var check = function(x, k, done) {
        if (x >= r) {
          self.checkTimer = setTimeout(function() {
            done(k);
          }, self.speed);
          return;
        }

        self.items[x].checking = true;

        self.checkTimer = setTimeout(function() {

          if (self.items[x].value < pivot) {
            self.swap(x, k, function() {
              self.items[k].checking = false;
              self.checkTimer = null;
              check(x + 1, k + 1, done)
            });
          } else {
            self.items[x].checking = false;
            self.checkTimer = null;
            check(x + 1, k, done);
          }
        }, self.speed);
      }

      check(l, l, function(k) {
        self.swap(k, r, function() {
          self.items[k].pivot = false;
          self.quicksort(l, k - 1, function() {
            self.quicksort(k + 1, r, done);
          });
        });
      });
    },

    swap: function(x, y, done) {
      var self = this;
      self.swapTimer = setTimeout(function() {
        var temp = self.items[x];
        self.items.$set(x, self.items[y]);
        self.items.$set(y, temp);
        self.swapTimer = null;
        if (done) done();
      }, self.speed);
    },

    reset: function() {
      if (this.checkTimer) {
        clearTimeout(this.checkTimer);
        this.checkTimer = null;
      }

      if (this.swapTimer) {
        clearTimeout(this.swapTimer);
        this.swapTimer = null;
      }

      var values = randomValues();
      var items = [];

      for (var i in values) {
        items.push({
          value: values[i],
          pivot: false,
          checking: false
        });
      }

      this.items = items;
      this.sorting = false;
    }
  }
});

new QuicksortComponent().$mount('#quicksort');
