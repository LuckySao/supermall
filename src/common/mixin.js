import {debounce} from './utils/utils.js'
import {POP, NEW, SELL} from "./const";

export const itemListenerMixin = {
  data(){
    return {
      itemImgListener:null,
      refresh:null
    }
  },
  mounted() {
   this.refresh = debounce(this.$refs.scroll.refresh, 500);

    this.itemImgListener = () => {
      this.refresh()
    }

    this.$bus.$on('itemImgLoad', this.itemImgListener)
  }
}
export const tabControlMixin = {
	data: function () {
		return {
			currentType: POP
		}
	},
	methods: {
		tabClick(index) {
			switch (index) {
				case 0:
					this.currentType = POP
					break
				case 1:
					this.currentType = NEW
					break
				case 2:
					this.currentType = SELL
					break
			}
			console.log(this.currentType);
		}
	}
}
