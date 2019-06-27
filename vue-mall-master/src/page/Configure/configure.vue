<template>
  <div>
    <y-header :showNav="false"></y-header>
    <y-shelf class="w" title="人员列表页面">
      <div slot="right">
        <b-btn v-b-modal.modal1 variant="primary">创建</b-btn>
      </div>
      <div slot="content" class="content">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>姓名</th>
              <th>性别</th>
              <th>手机号码</th>
              <th>类别</th>
              <th>职称</th>
            </tr>
          </thead>
           <tbody>
            <tr v-for="(item,i) in userList" :key="i">
              <td>{{item.name}}</td>
              <td>{{item.gender || '-'}}</td>
              <td>{{item.number}}</td>
              <td>{{item.type}}</td>
              <td>{{item.certificate}}</td>
              <td>
                <span class="scrmfont i-common-edit" aria-label="Left Align" @click="editUser(item)" aria-hidden="true"></span>&nbsp;&nbsp;
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
    <b-modal @hide="focusMyElement" ref="myModalRef" hide-footer id="modal1" title="添加人员">
      <form class="form-horizontal">
        <div class="form-group">
          <input type="text" v-model="info.name" class="form-control form-control-diy" placeholder="姓名">
          <b-form-select placeholder="xuanze" v-model="info.gender" :options="options" class="mb-3" />
          <input type="number" v-model="info.number" class="form-control form-control-diy" placeholder="手机号码">
          <input type="text" v-model="info.idCard" class="form-control form-control-diy" placeholder="身份证号码">
          <b-form-select v-model="info.type" :options="typeOptions" class="mb-3" />
          <input type="text" v-model="info.certificate" class="form-control form-control-diy" placeholder="职称证">
        </div>
      </form>
      <div class="two-button">
        <button @click="closeMyModalRef" class="btn btn-cancel">取消</button>
        <button @click="addUser" class="btn btn-primary">提交</button>
      </div>
    </b-modal>
    <b-modal ref="myModalDelete" hide-footer title="确认删除">
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
import { add, getList, update } from '/api/random'

export default {
  created () {
    this.getListDiy()
  },
  data () {
    return {
      info: {
        gender: null,
        name: '',
        number: '',
        idCard: '',
        certificate: '',
        type: ''
      },
      showDismissibleAlert: false,
      options: [
        { value: null, text: '性别' },
        { value: '男', text: '男' },
        { value: '女', text: '女' }
      ],
      typeOptions: [
        { value: '', text: '类别' },
        { value: '技术类', text: '技术类' },
        { value: '经济类', text: '经济类' },
        { value: '法律类', text: '法律类' },
        { value: '造价类', text: '造价类' }
      ],
      userList: [],
      currentPage: 1,
      totalRows: 0,
      perPage: 10,
      noData: false,
      edit: false,
      deleteId: ''
    }
  },
  methods: {
    focusMyElement (e) {
      this.info = {
        gender: null,
        name: '',
        number: '',
        idCard: '',
        certificate: '',
        type: ''
      }
    },
    closeMyModalRef () {
      this.$refs.myModalRef.hide()
    },
    openModal (deleteId) {
      this.deleteId = deleteId
      this.$refs.myModalDelete.show()
    },
    closeModal () {
      this.$refs.myModalDelete.hide()
    },
    linkGen (page) {
      this.currentPage = page
      this.getListDiy()
    },
    addUser () {
      if (this.info.name === '' || this.info.number === '') {
        return
      }
      if (this.edit) {
        this.updateData()
      } else {
        add(this.info).then(res => {
          if (res.status === 0) {
            this.$refs.myModalRef.hide()
            this.getListDiy()
            this.info = {
              gender: null,
              name: '',
              number: '',
              idCard: '',
              certificate: '',
              type: ''
            }
          }
        })
      }
    },
    editUser (item) {
      this.edit = true
      this.info = item
      this.$refs.myModalRef.show()
    },
    getListDiy () {
      let param = {
        page: this.currentPage,
        pageSize: this.perPage
      }
      getList(param).then(res => {
        this.userList = res.result.data
        this.currentPage = res.result.page
        this.totalRows = res.result.totalRows
        this.noData = res.result.totalRows === 0
      })
    },
    updateData () {
      update(this.info).then(res => {
        this.getListDiy()
        this.edit = false
        this.$refs.myModalRef.hide()
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
        this.$refs.myModalDelete.hide()
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
.width-15 {
  width: 15%;
}
.confirm-message {
  text-align: center;
  margin-bottom: 20px;
}

.two-button {
  justify-content: space-around;
  display: flex;
}

.no-data-class {
  text-align: center;
}

td, th {
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
