<template>
  <div>
    <y-header :showNav="false"></y-header>
    <y-shelf title="抽取页面(仅显示当天)">
      <!-- <div slot="right">By Reuben</div> -->
      <div slot="content" class="content" v-bind:style="{height: screenHeight}">
        <div class="content-warp">
          <div class="text-center" v-if="lotteryList.length === 0">今天没有活动哦,赶紧<router-link to="/createLottery">创建</router-link>一个吧</div>
          <div class="every-item" v-for="(item,i) in lotteryList" :key="i">
            <div class="descripe" v-bind:title="item.title">名称：{{item.title}}</div>
            <div v-if="item.descripe" class="descripe" v-bind:title="item.descripe">描述：{{item.descripe}}</div>
            <div>开始时间： {{item.date}} {{item.time}}</div>
            <div>抽取类别： {{item.selected.join(',')}}</div>
            <div>状态： {{item.finish ? '已完成' : '未开始'}}</div>
            <div v-if="item.finish" class="modal-random-height">
              抽取结果:
              <div v-for="(item1,i) in item.showData" :key="i">
                <div class="every-show-item">{{item1.name}}: {{item1.value}}</div>
              </div>
            </div>
            <div class="button-style">
              <button :disabled="item.finish" type="submit" @click="showModal(item)" class="btn btn-primary">开始抽取</button>
            </div>
          </div>
        </div>
      </div>
    </y-shelf>
    <y-footer></y-footer>
    <b-modal ref="getRandom" hide-footer title="">
      <div v-if="scrolling !== 'finish'" class="modal-random-height center">{{scrollValue}}</div>
      <div v-if="scrolling === 'finish'" class="modal-random-height">
        <div v-for="(item,i) in tmpItem.showData" :key="i">
          <div>{{item.name}}: {{item.value}}</div>
        </div>
      </div>
      <div class="center">
        <b-btn v-if="scrolling === 'init'" variant="primary" @click="startScroll">开始</b-btn>
        <b-btn v-if="scrolling === 'running'" variant="primary" @click="stopScroll">停止</b-btn>
        <b-btn v-if="scrolling === 'finish'" variant="primary" @click="hideModal">已结束</b-btn>
      </div>
    </b-modal>
  </div>
</template>
<script>
import YShelf from '/components/shelf'
import YHeader from '/common/header'
import YFooter from '/common/footer'
import { getTodayLottery } from '/api/random'
import { update } from '/api/lottery'

export default {
  created () {
    this.start()
    this.screenHeight = screen.height * 0.06 + 'vh'
  },
  data () {
    return {
      lotteryList: [],
      scrollValue: '请点击开始按钮',
      tmpList: [],
      tmpItem: {},
      intervalId: '',
      scrolling: 'init',
      screenHeight: '50vh'
    }
  },
  methods: {
    stopScroll () {
      clearInterval(this.intervalId)
      this.scrolling = 'finish'
      this.updateLottery()
    },
    startScroll () {
      let that = this
      that.scrolling = 'running'
      that.intervalId = setInterval(function () {
        let num = Math.floor(Math.random() * that.tmpList.length)
        let newValue = that.tmpList[num].value.substr(-5)
        that.scrollValue = that.tmpList[num].text + '-' + newValue
      }, 30)
    },
    showModal (item) {
      this.scrolling = 'init'
      this.scrollValue = '请点击开始按钮'
      this.tmpItem = JSON.parse(JSON.stringify(item))
      console.log(this.tmpItem)
      let b = item.t.inputMemberT.concat(item.j.inputMemberJ)
      let c = b.concat(item.f.inputMemberF)
      let d = c.concat(item.z.inputMemberZ)
      this.tmpList = d.slice(0)
      console.log(this.tmpList)
      this.getRandomKey(item)
      this.$refs.getRandom.show()
    },
    hideModal () {
      this.$refs.getRandom.hide()
    },
    updateLottery () {
      let param = {
        _id: this.tmpItem._id,
        finish: this.tmpItem.finish,
        finnalResult: this.tmpItem.finnalResult,
        showData: this.tmpItem.showData
      }
      update(param).then(res => {
        this.start()
      })
    },
    start () {
      getTodayLottery().then(res => {
        console.log(res)
        this.lotteryList = res.result.data
      })
    },
    getRandomKey (item) {
      let select = item.selected
      let finnalResult = []
      for (let i = 0; i < select.length; i++) {
        if (select[i] === '技术类') {
          let tmp = this.getFinnalResut('技术类', item.t.specifyT, item.t.inputMemberT, item.t.specifyMemberT, item.t.extractT)
          finnalResult.push(tmp)
        }
        if (select[i] === '经济类') {
          let tmp = this.getFinnalResut('经济类', item.j.specifyJ, item.j.inputMemberJ, item.j.specifyMemberJ, item.j.extractJ)
          finnalResult.push(tmp)
        }
        if (select[i] === '法律类') {
          let tmp = this.getFinnalResut('法律类', item.f.specifyF, item.f.inputMemberF, item.f.specifyMemberF, item.f.extractF)
          finnalResult.push(tmp)
        }
        if (select[i] === '造价类') {
          let tmp = this.getFinnalResut('造价类', item.z.specifyZ, item.z.inputMemberZ, item.z.specifyMemberZ, item.z.extractZ)
          finnalResult.push(tmp)
        }
      }
      this.tmpItem.finish = true
      let showData = this.prepareShowData(finnalResult)
      this.tmpItem.finnalResult = finnalResult
      this.tmpItem.showData = showData
      console.log(this.tmpItem)
    },
    prepareShowData (finnalResult) {
      let arr = []
      for (let i = 0; i < finnalResult.length; i++) {
        let tmpValue = finnalResult[i].value
        let tmpString = ''
        for (let j = 0; j < tmpValue.length; j++) {
          tmpString = tmpString + tmpValue[j].text + '-' + tmpValue[j].value.substr(-5) + ' '
        }
        let tmp = {
          name: finnalResult[i].name,
          value: tmpString
        }
        arr.push(tmp)
      }
      return arr
    },
    getFinnalResut (name, specify, inputMember, specifyMember, extract) {
      // 如果指定人，需要把指定的人先移除数组
      let arr = []
      if (specify) {
        arr = this.removeFormArr(inputMember, specifyMember)
      }
      let newArr = specify ? arr : inputMember
      let result = this.getRandomArrayElements(newArr, extract)
      let resultSplice = []
      if (specify) {
        result.splice(0, specifyMember.length)
        resultSplice = result.concat(specifyMember)
      }
      let tmpArr = specify ? resultSplice : result
      let tmp = {
        'name': name,
        'value': tmpArr
      }
      return tmp
    },
    getRandomArrayElements (arr, count) {
      let shuffled = arr.slice(0)
      let i = arr.length
      let min = i - count
      while (i-- > min) {
        let index = Math.floor((i + 1) * Math.random())
        let temp = shuffled[index]
        shuffled[index] = shuffled[i]
        shuffled[i] = temp
      }
      return shuffled.slice(min)
    },
    removeFormArr (arr, removeItem) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < removeItem.length; j++) {
          if (arr[i].text === removeItem[j].text && arr[i].value === removeItem[j].value) {
            arr.splice(i, 1)
          }
        }
      }
      return arr
    }
  },
  components: {
    YShelf,
    YHeader,
    YFooter
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.text-center {
  justify-content: center;
  width: 100%;
}

.every-show-item {
  padding-left: 20px;
}
.center {
  text-align: center;
}
.modal-random-height {
  min-height: 100px;
}

.base-center {
  text-align: center;
  display: block;
}

.content-warp {
  display: flex;
}

.descripe {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.every-item {
  width: 24%;
  display: inline-block;
  margin-right: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.every-item:hover {
  box-shadow: 0 2px 2px rgba(0,0,0,0.05), 0 15px 100px 0 rgba(0,0,75,0.125);
  // transition: box-shadow ease-out .5s;
  // transition-delay: .2s;
}

.button-style {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.content {
  min-height: 300px!important;
  padding: 30px;
}

.btn-size {
  width: 30%;
  margin: auto;
}

.row {
  justify-content: center;
  margin: 20px 0;
}

.conten-content {
  width: 80%;
  text-align: center;
  margin: auto;
  height: 400px;
}
</style>
