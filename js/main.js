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
        listCountry: [
            {
                country: '',
                confirmed: 0,
                recovered: 0,
                deaths: 0
            }
        ],
        dbListCountry: []
    },
    methods: {
        ambilDetail(){
            let link = `https://covid19.mathdro.id/api/countries/${this.negara}`
            axios.get(link).then((response)=>{
                this.detail.confirmed = response.data.confirmed.value
                this.detail.recovered = response.data.recovered.value
                this.detail.deaths = response.data.deaths.value
                const d = new Date(response.data.lastUpdate)
                const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: '2-digit' }) 
                const [{ value: mo },,{ value: da },,{ value: ye }] = dtf.formatToParts(d) 
                this.detail.lastUpdate = `${da} ${mo} ${ye}`
            }).catch((err)=>console.log(err))
        },
        worldCase(){
            let link = `https://covid19.mathdro.id/api`
            axios.get(link).then((response)=>{
                this.world.confirmed = response.data.confirmed.value
                this.world.recovered = response.data.recovered.value
                this.world.deaths = response.data.deaths.value
            }).catch((err)=>console.log(err))
        },
        getListCountry(){
            let link = `https://covid19.mathdro.id/api/confirmed`
            axios.get(link).then((response)=>{
                let arr = []
                for(let i = 0; i < response.data.length; i++){                            
                    if(!arr.find(item => item.country === response.data[i].countryRegion)){
                        arr.push(
                            {
                                country: response.data[i].countryRegion,
                                confirmed:  response.data[i].confirmed,
                                recovered:  (response.data[i].recovered + response.data[i].active ),
                                deaths:  response.data[i].deaths
                            }
                        )
                    }else{
                        arr.map(item => {
                            if(item.country === response.data[i].countryRegion){
                                item.confirmed += response.data[i].confirmed
                                item.recovered += (response.data[i].recovered + response.data[i].active)
                                item.deaths += response.data[i].deaths
                            }
                        })
                    }
                }                        
                this.listCountry = arr
                this.dbListCountry = this.listCountry
            }).catch((err)=>console.log(err))
        },
        cari(event){
            let val = event.target.value
            if(val == ''){
                this.negara = "Seluruh Dunia"
                this.detail.confirmed = this.world.confirmed
                this.detail.recovered = this.world.recovered
                this.detail.deaths = this.world.deaths
                this.listCountry = this.dbListCountry
            }else{
                let newVal = val[0].toUpperCase() + val.slice(1, val.length)
                let valReg = new RegExp(`^${newVal}.*`, "g")
                const arr = this.dbListCountry.filter(item => item.country.match(valReg))
                this.listCountry = arr
                if(arr.length === 1){
                    this.negara = newVal
                    this.detail.confirmed = arr[0].confirmed
                    this.detail.recovered = arr[0].recovered
                    this.detail.deaths = arr[0].deaths
                }
            }
        },
        searchMenu(){
            const navbar = document.querySelector('.navbar')
            navbar.classList.add('show')
        },
        closeSearchMenu(){
            const navbar = document.querySelector('.navbar')
            navbar.classList.remove('show')
        },
        menu(){
            const navigation = document.querySelector('.navigation')
            navigation.classList.add('show')
        },
        closeMenu(){
            const navigation = document.querySelector('.navigation')
            navigation.classList.remove('show')
        }
    },
    created() {
        this.ambilDetail()
        this.worldCase()
        this.getListCountry()
    }
})