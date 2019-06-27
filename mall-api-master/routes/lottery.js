const express     = require('express');
const router      = express.Router()
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
    let randomUserModal = Lottery.find(params).skip(skip).limit(pageSize);
    let totalRows = await Lottery.count(params);
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

router.post('/add',  async (req, res) => {
    Lottery.create(req.body, function (err, data) {
        if (err) throw err;
        res.json({
            status: 0,
            msg: '添加成功',
            result: 'suc'
        })
    })
})

router.post('/update',  async (req, res) => {

    let { _id } = req.body;
    if (!_id) {
        return
    }
    req.body.updateDate = new Date()
    Lottery.findByIdAndUpdate(_id, req.body, function (err, data) {
        if (err) throw err;
        res.json({
            status: 0,
            msg: '更新成功',
            result: 'suc'
        })
    })
})

module.exports = router
