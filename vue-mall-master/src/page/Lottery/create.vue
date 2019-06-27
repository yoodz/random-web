<template>
  <div>
    <y-header :showNav="false"></y-header>
    <y-shelf class="w" title="创建抽取">
      <!-- <div slot="right"> </div> -->
      <div slot="content" class=content>
        <div class="content-first" v-if="pageIndex === 1">
          <b-input-group class="every-one" prepend="名称"><b-form-input :maxlength="50" v-model="typeInfo.title"></b-form-input></b-input-group>
          <b-input-group class="every-one" prepend="描述"><b-form-textarea :maxlength="50" v-model="typeInfo.descripe" :rows="3"></b-form-textarea></b-input-group>
          <b-input-group class="every-one" prepend="开始日期"><b-form-input v-model="typeInfo.date" type="date"></b-form-input><b-form-input v-model="typeInfo.time" type="time"></b-form-input></b-input-group>
          <span class="category">抽取类别</span>
          <b-form-group class="display-inline-block">
            <b-form-checkbox-group id="checkboxes1" name="flavour1" v-model="typeInfo.selected" :options="options">
            </b-form-checkbox-group>
          </b-form-group>
          <div>
            <b-btn class="button-right" variant="primary" @click="next(2)">下一步</b-btn>
          </div>
        </div>
         <div class="content-first" v-if="pageIndex === 2">
            <div class="every-select-style" v-if="typeInfo.selected.indexOf('技术类') !== -1">
              <p>技术类</p>
              <div class="multiselect-style">
              参加人员
              <multiselect
                placeholder="选择或搜索添加"
                v-model="typeInfo.t.inputMemberT"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                :custom-label="textWithValue"
                track-by="value"
                :options="typeInfo.t.optionsT"
                >
              </multiselect>
              </div>
              <b-input-group class="every-one" prepend="抽取" append="人"><b-form-input v-model="typeInfo.t.extractT" type=number></b-form-input></b-input-group>
              <b-form-checkbox
                v-model="typeInfo.t.specifyT"
                value="true"
                :disabled="getBooleanT"
                unchecked-value="false">
                是否指定中奖人
              </b-form-checkbox>
              <multiselect v-if="typeInfo.t.specifyT==='true'"
                placeholder="选择或搜索添加"
                v-model="typeInfo.t.specifyMemberT"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                :custom-label="textWithValue"
                track-by="value"
                :max="parseInt(typeInfo.t.extractT)"
                :options="typeInfo.t.inputMemberT"
                >
              </multiselect>
            </div>
            <div class="every-select-style" v-if="typeInfo.selected.indexOf('经济类') !== -1">
              经济类
              <div class="multiselect-style">
              参加人员
              <multiselect
                placeholder="选择或搜索添加"
                v-model="typeInfo.j.inputMemberJ"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                :custom-label="textWithValue"
                track-by="value"
                :options="typeInfo.j.optionsJ"
                >
              </multiselect>
              </div>
              <b-input-group class="every-one" prepend="抽取" append="人"><b-form-input v-model="typeInfo.j.extractJ" type=number></b-form-input></b-input-group>
              <b-form-checkbox
                v-model="typeInfo.j.specifyJ"
                value="true"
                :disabled="getBooleanJ"
                unchecked-value="false">
                是否指定中奖人
              </b-form-checkbox>
              <multiselect v-if="typeInfo.j.specifyJ==='true'"
                placeholder="选择或搜索添加"
                v-model="typeInfo.j.specifyMemberJ"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                :custom-label="textWithValue"
                track-by="value"
                :max="parseInt(typeInfo.j.extractJ)"
                :options="typeInfo.j.inputMemberJ"
                >
              </multiselect>
            </div>
            <div class="every-select-style" v-if="typeInfo.selected.indexOf('法律类') !== -1">
              法律类
              <div class="multiselect-style">
              参加人员
              <multiselect
                placeholder="选择或搜索添加"
                v-model="typeInfo.f.inputMemberF"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                :custom-label="textWithValue"
                track-by="value"
                :options="typeInfo.f.optionsF"
                >
              </multiselect>
              </div>
              <b-input-group class="every-one" prepend="抽取" append="人"><b-form-input v-model="typeInfo.f.extractF" type=number></b-form-input></b-input-group>
              <b-form-checkbox
                v-model="typeInfo.f.specifyF"
                value="true"
                :disabled="getBooleanF"
                unchecked-value="false">
                是否指定中奖人
              </b-form-checkbox>
              <multiselect v-if="typeInfo.f.specifyF==='true'"
                placeholder="选择或搜索添加"
                v-model="typeInfo.f.specifyMemberF"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                :custom-label="textWithValue"
                track-by="value"
                :max="parseInt(typeInfo.f.extractF)"
                :options="typeInfo.f.inputMemberF"
                >
              </multiselect>
            </div>
            <div class="every-select-style" v-if="typeInfo.selected.indexOf('造价类') !== -1">
              造价类
              <div class="multiselect-style">
              参加人员
              <multiselect
                placeholder="选择或搜索添加"
                v-model="typeInfo.z.inputMemberZ"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                :custom-label="textWithValue"
                track-by="value"
                :options="typeInfo.z.optionsZ"
                >
              </multiselect>
              </div>
              <b-input-group class="every-one" prepend="抽取" append="人"><b-form-input v-model="typeInfo.z.extractZ" type=number></b-form-input></b-input-group>
              <b-form-checkbox
                v-model="typeInfo.z.specifyZ"
                value="true"
                :disabled="getBooleanZ"
                unchecked-value="false">
                是否指定中奖人
              </b-form-checkbox>
              <multiselect v-if="typeInfo.z.specifyZ==='true'"
                placeholder="选择或搜索添加"
                v-model="typeInfo.z.specifyMemberZ"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                :custom-label="textWithValue"
                track-by="value"
                :max="parseInt(typeInfo.z.extractZ)"
                :options="typeInfo.z.inputMemberZ"
                >
              </multiselect>
            </div>
          <div>
            <b-btn class="" variant="primary" @click="next(1)">上一步</b-btn>
            <b-btn class="float-right" variant="primary" @click="createLottery">创建</b-btn>
          </div>
        </div>
      </div>
    </y-shelf>
    <y-footer></y-footer>
  </div>
</template>
<script>
import YShelf from '/components/shelf'
import YHeader from '/common/header'
import YFooter from '/common/footer'
import Multiselect from 'vue-multiselect'
import { getList } from '/api/random'
import { add, update } from '/api/lottery'

export default {
  created () {
    let query = this.$route.query
    if (JSON.stringify(query) !== '{}') {
      this.typeInfo = query
      this.edit = true
    }
  },
  data () {
    return {
      perPage: 999999999,
      textarea1: '',
      pageIndex: 1,
      edit: false,
      test: {
        name: 'dasf'
      },
      options: [
        {text: '技术类', value: '技术类'},
        {text: '经济类', value: '经济类'},
        {text: '法律类', value: '法律类'},
        {text: '造价类', value: '造价类'}
      ],
      typeInfo: {
        title: '',
        descripe: '',
        date1: '',
        time: '',
        selected: [],
        t: {
          inputMemberT: [],
          optionsT: [],
          specifyT: 'false',
          specifyMemberT: [],
          extractT: 0
        },
        j: {
          inputMemberJ: [],
          optionsJ: [],
          specifyJ: 'false',
          specifyMemberJ: [],
          extractJ: 0
        },
        f: {
          inputMemberF: [],
          optionsF: [],
          specifyF: 'false',
          specifyMemberF: [],
          extractF: 0
        },
        z: {
          inputMemberZ: [],
          optionsZ: [],
          specifyZ: 'false',
          specifyMemberZ: [],
          extractZ: 0
        }
      }
    }
  },
  computed: {
    getBooleanT () {
      if (this.typeInfo.t.inputMemberT.length === 0 || this.typeInfo.t.extractT === 0) {
        return true
      }
      return false
    },
    getBooleanJ () {
      if (this.typeInfo.j.inputMemberJ.length === 0 || this.typeInfo.j.extractJ === 0) {
        return true
      }
      return false
    },
    getBooleanF () {
      if (this.typeInfo.f.inputMemberF.length === 0 || this.typeInfo.f.extractF === 0) {
        return true
      }
      return false
    },
    getBooleanZ () {
      if (this.typeInfo.z.inputMemberZ.length === 0 || this.typeInfo.z.extractZ === 0) {
        return true
      }
      return false
    }
  },
  methods: {
    createLottery () {
      if (this.edit) {
        update(this.typeInfo).then(res => {
          if (res.status === 0) {
            this.$router.push({path: '/lottery'})
          }
        })
      } else {
        add(this.typeInfo).then(res => {
          if (res.status === 0) {
            this.$router.push({path: '/lottery'})
          }
        })
      }
    },
    textWithValue ({ text, value }) {
      let newValue = value.substr(-5)
      return `${text} — [${newValue}]`
    },
    next (number) {
      if (number === 2) {
        if (this.typeInfo.title === '' || this.typeInfo.date === '' || this.typeInfo.time === '' || this.typeInfo.selected.length === 0) {
          return
        }
        this.getListDiy()
      }
      this.pageIndex = number
    },
    getListDiy () {
      let param = {
        pageSize: this.perPage,
        keywords: this.typeInfo.selected
      }
      getList(param).then(res => {
        this.prepareData(res.result.data)
      })
    },
    prepareData (data) {
      this.typeInfo.t.optionsT = []
      this.typeInfo.j.optionsJ = []
      this.typeInfo.f.optionsF = []
      this.typeInfo.z.optionsZ = []
      for (let j = 0; j < this.typeInfo.selected.length; j++) {
        let type = this.typeInfo.selected[j]
        for (let i = 0; i < data.length; i++) {
          if (data[i].type === this.typeInfo.selected[j]) {
            let tmp = {
              'text': data[i].name,
              'value': data[i].number
            }
            if (type === '技术类') {
              this.typeInfo.t.optionsT.push(tmp)
            }
            if (type === '经济类') {
              this.typeInfo.j.optionsJ.push(tmp)
            }
            if (type === '法律类') {
              this.typeInfo.f.optionsF.push(tmp)
            }
            if (type === '造价类') {
              this.typeInfo.z.optionsZ.push(tmp)
            }
          }
        }
      }
    }
  },
  components: {
    YShelf,
    YHeader,
    YFooter,
    Multiselect
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.every-select-style{
  box-shadow: 0 2px 2px rgba(0,0,0,0.05), 0 15px 100px 0 rgba(0,0,75,0.125);
  padding: 10px;
  margin-bottom: 30px;
}

.multiselect-style {
  margin-bottom: 20px;
}

.display-inline-block {
  display: inline-block;
}

.category {
  margin-right: 10px;
  color: #495057;
}

.float-right {
  float: right;
}

.button-right {
  display: block;
  margin: 0px 0 0px auto;
}

.every-one {
  margin-bottom: 20px;
}

.content-first {
  width: 50%;
  margin: 20px auto;
}

.no-data-class {
  text-align: center;
}

.add-person-modal {
  position: fixed;
  top: 50%; left: 50%;
  z-index: 9999;
  box-shadow: 0 0 0 50vmax  rgba(0,0,0,.8);
}
.content {
  padding-top: 30px;
  padding-bottom: 30px;
}

.form-control-diy {
  margin-bottom: 10px;
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
