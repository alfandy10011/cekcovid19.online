function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } const _arr = []; let _n = true; let _d = false; let _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const app = new Vue({
  el: '#app',
  data: {
    negara: 'Indonesia',
    sumber: 'Badan Nasional Penanggulangan Bencana',
    detail: {
      confirmed: 0,
      active: 0,
      recovered: 0,
      deaths: 0,
      lastUpdate: ''
    },
    world: {
      confirmed: 0,
      active: 0,
      recovered: 0,
      deaths: 0
    },
    listProvince: [
      {
        province:'',
        confirmed:0,
        deaths:0
      }
    ],
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
    loadingPercentage() {
      let persen = Math.ceil(this.refCount/10 * 100)
      persen -= 100
      return Math.abs(persen)
    }
  },
  methods: {
    ambilDetail: function ambilDetail() {
      // terkonfirmasi
      axios.get(`https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/Statistik_Perkembangan_COVID19_Indonesia/FeatureServer/0/query?f=json&where=Tanggal%3E%3Dtimestamp%20%272020-03-18%2016%3A00%3A00%27%20AND%20Tanggal%3C%3Dtimestamp%20%272020-03-19%2015%3A59%3A59%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Jumlah_Kasus_Kumulatif%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&cacheHint=true
      `).then((response)=>{
        this.detail.confirmed = response.data.features[0].attributes.value
      }).catch((err)=>console.log(err))

      // dalam perawatan
      axios.get(`https://services8.arcgis.com/mpSDBlkEzjS62WgX/arcgis/rest/services/Kasus_COVID19_Indonesia_gsheet/FeatureServer/0/query?f=json&where=(Provinsi%20%3D%20%27Indonesia%27)%20OR%20(Provinsi%20%3C%3E%20%27Indonesia%27)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Dalam_Perawatan_%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true
      `).then((response)=>{
        this.detail.active = response.data.features[0].attributes.value
      }).catch((err)=>console.log(err))

      // sembuh
      axios.get(`https://services8.arcgis.com/mpSDBlkEzjS62WgX/arcgis/rest/services/Kasus_COVID19_Indonesia_gsheet/FeatureServer/0/query?f=json&where=(Provinsi%20%3D%20%27Indonesia%27)%20OR%20(Provinsi%20%3C%3E%20%27Indonesia%27)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Sembuh_%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true`).then((response)=>{
        this.detail.recovered = response.data.features[0].attributes.value
      }).catch((err)=>console.log(err))

      // meninggal
      axios.get(`https://services8.arcgis.com/mpSDBlkEzjS62WgX/arcgis/rest/services/Kasus_COVID19_Indonesia_gsheet/FeatureServer/0/query?f=json&where=(Provinsi%20%3D%20%27Indonesia%27)%20OR%20(Provinsi%20%3C%3E%20%27Indonesia%27)&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=*&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%22onStatisticField%22%3A%22Meninggal_%22%2C%22outStatisticFieldName%22%3A%22value%22%7D%5D&outSR=102100&cacheHint=true
      `).then((response)=>{
        this.detail.deaths = response.data.features[0].attributes.value
      }).catch((err)=>console.log(err))

    },
    getListProvince: function getListProvince(){
      axios.get(`https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=%7B%22xmin%22%3A10018754.17139158%2C%22ymin%22%3A-2504688.54284646%2C%22xmax%22%3A12523442.714239955%2C%22ymax%22%3A0.000001914799213409424%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*&orderByFields=Kasus_Terkonfirmasi_Akumulatif%20DESC&outSR=102100&resultType=tile`).then((response)=>{
        const d = new Date(response.data.features[0].attributes.Pembaruan)
        const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false}) 
        const [{ value: mo },,{ value: da },,{ value: ye },,{value:hour},,{value:minute},,{value:second}] = dtf.formatToParts(d) 
        
        this.detail.lastUpdate = `${da} ${mo} ${ye} ${hour}:${minute}:${second}`

        let arr = []
        for(let i = 0; i < response.data.features.length; i++){
          arr.push({
            province: response.data.features[i].attributes.Provinsi,
            confirmed: response.data.features[i].attributes.Kasus_Terkonfirmasi_Akumulatif,
            recovered: response.data.features[i].attributes.Kasus_Sembuh_Akumulatif,
            deaths: response.data.features[i].attributes.Kasus_Meninggal_Akumulatif
          })
        }
        this.listProvince = arr
      }).catch((err)=>console.log(err))
    },
    worldCase: function worldCase() {
      const _this2 = this;

      const link = "https://covid19.mathdro.id/api";
      axios.get(link).then(response => {
        _this2.world.confirmed = response.data.confirmed.value;
        _this2.world.active = response.data.confirmed.value - (response.data.recovered.value+response.data.deaths.value);
        _this2.world.recovered = response.data.recovered.value;
        _this2.world.deaths = response.data.deaths.value;
      }).catch(err => {
        return console.log(err);
      });
    },
    getListCountry: function getListCountry() {
      const _this3 = this;

      const link = "https://covid19.mathdro.id/api/confirmed";
      axios.get(link).then(response => {
        const arr = [];

        const _loop = function _loop(i) {
          if (!arr.find(item => {
            return item.country === response.data[i].countryRegion;
          })) {
            arr.push({
              country: response.data[i].countryRegion,
              active: response.data[i].active,
              confirmed: response.data[i].confirmed,
              recovered: response.data[i].recovered,
              deaths: response.data[i].deaths
            });
          } else {
            arr.map(item => {
              if (item.country === response.data[i].countryRegion) {
                item.confirmed += response.data[i].confirmed;
                item.active += response.data[i].active;
                item.recovered += response.data[i].recovered;
                item.deaths += response.data[i].deaths;
              }
            });
          }          
        };
        for (let i = 0; i < response.data.length; i++) {
          _loop(i);
        }

        _this3.listCountry = arr;
        _this3.dbListCountry = _this3.listCountry;

      }).catch(err => {
        return console.log(err);
      });
    },
    cari: function cari(event) {
      const val = event.target.value;
      this.sumber = 'John Hopkins University CSSE'

      if (val == '') {
        this.negara = "🌎";
        this.detail.confirmed = this.world.confirmed;
        this.detail.active = this.world.active;
        this.detail.recovered = this.world.recovered;
        this.detail.deaths = this.world.deaths;
        this.listCountry = this.dbListCountry;
      }else {
        const newVal = val[0].toUpperCase() + val.slice(1, val.length);
        const valReg = new RegExp("^".concat(newVal, ".*"), "g");
        const arr = this.dbListCountry.filter(item => {
          return item.country.match(valReg);
        });
        this.listCountry = arr;

        if (arr.length === 1) {
          if(newVal == 'Indonesia'){
            alert("Ada perubahaan data. Data beralih sumber menjadi John Hopkins University, refresh atau matikan hidupkan kembali app untuk mengembalikan sumber menjadi Badan Nasional Penanggulangan Bencana")
            this.negara = newVal;
            // this.sumber = 'Badan Nasional Penanggulangan Bencana'
          }else{
            this.negara = newVal;
            this.detail.confirmed = arr[0].confirmed;
            this.detail.active = arr[0].active;
            this.detail.recovered = arr[0].recovered;
            this.detail.deaths = arr[0].deaths;
          }
        }
      }
    },
    
    searchMenu: function searchMenu() {
      const navbar = document.querySelector('.navbar');
      navbar.classList.add('show');
    },
    closeSearchMenu: function closeSearchMenu() {
      const navbar = document.querySelector('.navbar');
      navbar.classList.remove('show');
    },
    menu: function menu() {
      const navigation = document.querySelector('.navigation');
      navigation.classList.add('show');
    },
    closeMenu: function closeMenu() {
      const navigation = document.querySelector('.navigation');
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
    this.getListProvince();
    this.worldCase();
    this.getListCountry();
  },
  updated: function updated(){    

    if(this.negara !== 'Indonesia'){
      document.querySelector('.daftar-provinsi').style.display = 'none'
    }else{
      document.querySelector('.daftar-provinsi').style.display = 'block'
    }

  }
});

const progress = document.querySelector('#progress')
const progressBar = document.querySelector('#progress-bar')
const items = document.querySelector('#items')

if(progressBar.style.width == '100%'){
  setTimeout(()=>{
    progress.style.display = 'none'
    items.style.display = 'flex'
  }, 1000)
}
