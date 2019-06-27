<template>
  <div>
    <y-header :showNav="false"></y-header>
    <y-shelf class="w" title="抽取列表">
      <div slot="right">
        <b-btn v-b-modal.modal1 variant="primary" @click="toCreate">创建抽取</b-btn>
      </div>
      <div slot="content" class=content>
        <table class="table table-hover">
          <thead>
            <tr>
              <th>名称</th>
              <th>描述</th>
              <th>开始时间</th>
              <th>类别</th>
              <th>状态</th>
              <th>抽取结果</th>
            </tr>
          </thead>
           <tbody>
            <tr v-for="(item,i) in userList" :key="i">
              <td class="descripe-width">{{item.title}}</td>
              <td class="descripe-width" v-bind:title="item.descripe">{{item.descripe || '-'}}</td>
              <td>{{item.date}} {{item.time}}</td>
              <td>{{item.selected.join(",")}}</td>
              <td>{{item.finish ? '已完成' : '未开始'}}</td>
              <td class="descripe-width" v-if="item.showData">
                <div class="float-left" v-for="(item1,j) in item.showData" :key="j">{{item1.name}} {{item1.value}}</div>
              </td>
              <td class="descripe-width"  v-if="!item.showData">-</td>
              <td class="descripe-width-10">
                <span v-if="!item.finish" class="scrmfont i-common-edit" aria-label="Left Align" @click="editUser(item)" aria-hidden="true"></span>&nbsp;&nbsp;
                <span class="scrmfont i-common-delete" aria-label="Left Align" @click="openModal(item._id)" aria-hidden="true"></span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="no-data-class" v-if="noData">暂无数据</div>
        <b-pagination align="right" :total-rows="totalRows" :per-page="perPage" :current="currentPage" @change="linkGen"></b-pagination>
      </div>
    </y-shelf>
    <y-footer></y-footer>
    <b-modal ref="myModalRef" hide-footer id="modal1" title="确认删除">
      <div class="confirm-message">确认删除吗？</div>
      <div class="two-button">
        <b-btn variant="primary" @click="closeModal">取消</b-btn>
        <b-btn class="float-right" variant="primary" @click="deleteData">确定</b-btn>
      </div>
    </b-modal>
  </div>
</template>
<script>
import YShelf from '/components/shelf'
import YHeader from '/common/header'
import YFooter from '/common/footer'
import { getList, update } from '/api/lottery'

export default {
  created () {
    this.getListDiy()
  },
  data () {
    return {
      showDismissibleAlert: false,
      userList: [],
      currentPage: 1,
      totalRows: 0,
      perPage: 10,
      noData: false,
      deleteId: ''
    }
  },
  methods: {
    openModal (deleteId) {
      this.deleteId = deleteId
      this.$refs.myModalRef.show()
    },
    closeModal () {
      this.$refs.myModalRef.hide()
    },
    toCreate () {
      this.$router.push({path: '/createLottery'})
    },
    linkGen (page) {
      this.currentPage = page
      this.getListDiy()
    },
    editUser (item) {
      this.$router.push({path: '/createLottery', query: item})
    },
    getListDiy () {
      let param = {
        page: this.currentPage,
        pageSize: this.perPage
      }
      getList(param).then(res => {
        console.log(res)
        this.userList = res.result.data
        this.currentPage = res.result.page
        this.totalRows = res.result.totalRows
        this.noData = res.result.totalRows === 0
      })
    },
    deleteData () {
      let param = {
        _id: this.deleteId,
        deleted: true
      }
      update(param).then(res => {
        this.getListDiy()
        this.deleteId = ''
        this.$refs.myModalRef.hide()
      })
    }
  },
  components: {
    YShelf,
    YHeader,
    YFooter
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.two-button {
  display: flex;
  justify-content: space-around;
}
.descripe-width-10 {
  width: 10%;
}

.descripe-width {
  width: 15%;
}

.float-left {
  float: left;
}

.confirm-message {
  text-align: center;
  margin-bottom: 20px;
}

td, th {
  text-align: center;
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
  min-height: 200px!important;
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
