"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var app = new Vue({
  el: '#app',
  data: {
    negara: 'Indonesia',
    detail: {
      confirmed: 0,
      recovered: 0,
      deaths: 0,
      lastUpdate: ''
    },
    world: {
      confirmed: 0,
      recovered: 0,
      deaths: 0
    },
    listCountry: [{
      country: '',
      confirmed: 0,
      recovered: 0,
      deaths: 0
    }],
    dbListCountry: [],
    refCount: 0,
    isLoading: false
  },
  computed: {
    loadingPercentage: function(){
      let persen = Math.ceil(this.refCount/3 * 100)
      persen -= 100
      return Math.abs(persen)
    }
  },
  methods: {
    ambilDetail: function ambilDetail() {
      var _this = this;

      var link = "https://covid19.mathdro.id/api/countries/".concat(this.negara);
      axios.get(link).then(function (response) {
        _this.detail.confirmed = response.data.confirmed.value;
        _this.detail.recovered = response.data.recovered.value;
        _this.detail.deaths = response.data.deaths.value;
        var d = new Date(response.data.lastUpdate);
        var dtf = new Intl.DateTimeFormat('en', {
          year: 'numeric',
          month: 'long',
          day: '2-digit'
        });

        var _dtf$formatToParts = dtf.formatToParts(d),
            _dtf$formatToParts2 = _slicedToArray(_dtf$formatToParts, 5),
            mo = _dtf$formatToParts2[0].value,
            da = _dtf$formatToParts2[2].value,
            ye = _dtf$formatToParts2[4].value;

        _this.detail.lastUpdate = "".concat(da, " ").concat(mo, " ").concat(ye);
      }).catch(function (err) {
        return console.log(err);
      });
    },
    worldCase: function worldCase() {
      var _this2 = this;

      var link = "https://covid19.mathdro.id/api";
      axios.get(link).then(function (response) {
        _this2.world.confirmed = response.data.confirmed.value;
        _this2.world.recovered = response.data.recovered.value;
        _this2.world.deaths = response.data.deaths.value;
      }).catch(function (err) {
        return console.log(err);
      });
    },
    getListCountry: function getListCountry() {
      var _this3 = this;

      var link = "https://covid19.mathdro.id/api/confirmed";
      axios.get(link).then(function (response) {
        var arr = [];

        var _loop = function _loop(i) {
          if (!arr.find(function (item) {
            return item.country === response.data[i].countryRegion;
          })) {
            arr.push({
              country: response.data[i].countryRegion,
              confirmed: response.data[i].confirmed,
              recovered: response.data[i].recovered,
              deaths: response.data[i].deaths
            });
          } else {
            arr.map(function (item) {
              if (item.country === response.data[i].countryRegion) {
                item.confirmed += response.data[i].confirmed;
                item.recovered += response.data[i].recovered;
                item.deaths += response.data[i].deaths;
              }
            });
          }
        };

        for (var i = 0; i < response.data.length; i++) {
          _loop(i);
        }

        _this3.listCountry = arr;
        _this3.dbListCountry = _this3.listCountry;
      }).catch(function (err) {
        return console.log(err);
      });
    },
    cari: function cari(event) {
      var val = event.target.value;

      if (val == '') {
        this.negara = "🌎";
        this.detail.confirmed = this.world.confirmed;
        this.detail.recovered = this.world.recovered;
        this.detail.deaths = this.world.deaths;
        this.listCountry = this.dbListCountry;
      } else {
        var newVal = val[0].toUpperCase() + val.slice(1, val.length);
        var valReg = new RegExp("^".concat(newVal, ".*"), "g");
        var arr = this.dbListCountry.filter(function (item) {
          return item.country.match(valReg);
        });
        this.listCountry = arr;

        if (arr.length === 1) {
          this.negara = newVal;
          this.detail.confirmed = arr[0].confirmed;
          this.detail.recovered = arr[0].recovered;
          this.detail.deaths = arr[0].deaths;
        }
      }
    },
    searchMenu: function searchMenu() {
      var navbar = document.querySelector('.navbar');
      navbar.classList.add('show');
    },
    closeSearchMenu: function closeSearchMenu() {
      var navbar = document.querySelector('.navbar');
      navbar.classList.remove('show');
    },
    menu: function menu() {
      var navigation = document.querySelector('.navigation');
      navigation.classList.add('show');
    },
    closeMenu: function closeMenu() {
      var navigation = document.querySelector('.navigation');
      navigation.classList.remove('show');
    },
    setLoading(isLoading) {
      if (isLoading) {
        this.refCount++;
        this.isLoading = true;
      } else if (this.refCount > 0) {
        this.refCount--;
        this.isLoading = (this.refCount > 0);
      }
    }
  },
  created: function created() {
    axios.interceptors.request.use((config) => {
      // trigger 'loading=true' event here
      this.setLoading(true);
      return config;
    }, (error) => {
      // trigger 'loading=false' event here
      this.setLoading(false);
      return Promise.reject(error);
    });
  
    axios.interceptors.response.use((response) => {
      // trigger 'loading=false' event here
      this.setLoading(false);
      return response;
    }, (error) => {
      // trigger 'loading=false' event here
      this.setLoading(false);
      return Promise.reject(error);
    });
    this.ambilDetail();
    this.worldCase();
    this.getListCountry();
  }
});
const progress = document.querySelector('#progress')
const progressBar = document.querySelector('#progress-bar')

if(progressBar.style.width == '100%'){
  setTimeout(()=>{
    progress.style.display = 'none'
  }, 1000)
}
