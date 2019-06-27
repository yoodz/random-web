const express     = require('express');
const router      = express.Router()
const RandomUser  = require('../models/randomUser')
const Lottery  = require('../models/lottery')

router.get('/list', async (req, res, next) => {
    let sort = req.query.sort || 'desc';
    let keywords = req.query.keywords || [];
    let page = +req.query.page || 1;
    let pageSize = +req.query.pageSize || 10;
    let skip = (page - 1) * pageSize;//跳过多少条
    let params = {};
    if (keywords.length !== 0) {
        let arr = []
        for (let i = 0; i < keywords.length; i++) {
            let tmp = {
                type : {$regex: keywords[i]}
            }
            arr.push(tmp)
        }

        params = {
            $or: arr
        }
    }
    params.deleted = false
    console.log(params)
    let randomUserModal = RandomUser.find(params).skip(skip).limit(pageSize);
    let totalRows = await RandomUser.count(params);
    console.log(totalRows)
    // 1 升序 -1 降序
    sort && randomUserModal.sort({'updateDate': sort})
    randomUserModal.exec(function (err, doc) {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,
                result: ''
            })
        } else {
            res.json({
                status: '0',
                msg: 'successful',
                result: {
                    page: page,
                    count: doc.length,
                    data: doc,
                    totalRows: totalRows
                }
            })
        }
    })
})

//  新增人员
router.post('/add',  async (req, res) => {

    let { name, number } = req.body;
    const randomUser = await RandomUser.findOne({name, number});
    if (!randomUser) {
        RandomUser.create(req.body, function (err, data) {
            if (err) throw err;
            res.json({
                status: 0,
                msg: '添加成功',
                result: 'suc'
            })
        })
    }
})

// 更新人员
router.post('/update',  async (req, res) => {

    let { _id } = req.body;
    console.log(req.body)
    if (!_id) {
        return
    }
    req.body.updateDate = new Date()
    RandomUser.findByIdAndUpdate(_id, req.body, function (err, data) {
        if (err) throw err;
        res.json({
            status: 0,
            msg: '更新成功',
            result: 'suc'
        })
    })
})

router.get('/getTodayLottery', async (req, res, next) => {
    var date1 = new Date()
    let monthTody = date1.getMonth() + 1
    if (monthTody < 10) {
        monthTody = '0' + monthTody
    }
    let getDate = date1.getDate();
    if (getDate < 10) {
        getDate = '0' + getDate
    }
    let todayDate = date1.getFullYear() + '-' + monthTody + '-' + getDate
    console.log(todayDate)
    // Lottery.find({'title': '第一条数据'}, function (err3, doc) {
    Lottery.find({'date': todayDate, 'deleted': false}, function (err3, doc) {
        res.json({
            status: '0',
            msg: 'successful',
            result: {
                data: doc
            }
        })
    })
})

module.exports = router
