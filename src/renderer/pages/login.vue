<template>
    <section class="page-signIn">
        <div class="lt-main">
            <nav class="signIn-nav">
                <div class="navIcon el-icon-arrow-left"></div>
                <div class="navIcon el-icon-arrow-right"></div>
                <swiper :options="swiperOption">
                    <swiper-slide class="item">
                        <div class="item" :class="{active: isActive}" @click="switchNav(null)">首页</div>
                    </swiper-slide>
                    <swiper-slide v-for="(item, index) in data" :key="index">
                        <div class="item" :class="{active: item.isActive}" @click="switchNav(index)">
                            {{item.name}}
                        </div>
                    </swiper-slide>
                </swiper>
            </nav>
    
            <div class="main">
                <div class="content" :class="{active: isActive}">
                    <div class="home">
                        <div class="content-left">
                            <div v-for="(item, index) in app" :key="index" :id="item.id" @click="weChatClick(item)">
                                <i :class="item.iconClass"></i>
                                <span>{{item.name}}</span>
                            </div>
                        </div>
                        <div class="content-right">
                            <template>
                                <el-table :data="this.data" border style="width: 100%">
                                    <el-table-column label="应用" width="260">
                                        <template scope="scope">
                                            <i :class="scope.row.iconClass" style="font-size: 20px"></i>
                                            <span style="margin-left: 10px; font-size: 15px">{{ scope.row.name }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template scope="scope">
                                            <el-button size="small" @click="handleEdit(scope.$index)">编辑</el-button>
                                            <el-button size="small" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="content" v-for="(item, index) in data" :key="index" :class="{active: item.isActive}">
                    <webview :src="item.url" :partition="'persist:electron'+index" :id="'electron'+index" style="width:100%;height:100%"></webview>
                </div>
            </div>
    
            <el-dialog title="填写应用的信息" :visible.sync="dialogVisible" size="tiny">
                <p class="pop-p">
                    <span>名称:</span>
                    <el-input v-model="input"></el-input>
                </p>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="popBtn">确 定</el-button>
                </span>
            </el-dialog>
    
            <el-dialog title="编辑应用的信息" :visible.sync="editVisible" size="tiny">
                <p class="pop-p">
                    <span>名称:</span>
                    <el-input v-model="editInput"></el-input>
                </p>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editPop">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </section>
</template>
<script>
import fs from 'fs'
import path from 'path'
import { mysql } from '@/data'

export default {
    data() {
        return {
            btn: false,
            isActiveInputClose: false,
            mobile: '',
            password: '',
            data: [],
            dialogVisible: false,
            index: null,
            isActive: true,
            swiperOption: {
                pagination: '.swiper-pagination',
                slidesPerView: 4,
                paginationClickable: true,
                spaceBetween: 10,
                freeMode: true,
                nextButton: '.el-icon-arrow-left',
                prevButton: '.el-icon-arrow-right'
            },
            editVisible: false,
            editIndex: '',
            editInput: '',
            input: '',      // 当前点击应用的名称放入这里
            url: '',        // 当前点击应用的链接放入这里
            iconClass: '',   // 当前点击应用的图标放入这里
            app: [                   // 应用的信息
                {
                    iconClass: 'icon-weixin',
                    id: 'weChat',
                    name: '微信',
                    url: 'https://mp.weixin.qq.com/'
                }, {
                    iconClass: 'icon-tengxunqq',
                    id: 'QQ',
                    name: 'QQ',
                    url: 'http://mp.qq.com/'
                }, {
                    iconClass: 'icon-weibo',
                    id: 'SinaMicroblog',
                    name: '新浪微博',
                    url: 'http://weibo.com/u/3506196561/home?wvr=5'
                }
            ]
        }
    },
    watch: {
    },
    mounted() {
        this.$nextTick(() => {
            fs.readFile(path.join(__dirname, '../../../history.text'), (err, data) => {
                if (err) console.log(err.stack)
                this.data = JSON.parse(data.toString())

                // webview.addEventListener('dom-ready', () => {
                //     webview.openDevTools()
                // })
            })
        })
        mysql()
    },
    methods: {
        weChatClick(app) {
            this.input = app.name
            this.url = app.url
            this.iconClass = app.iconClass
            this.dialogVisible = true
        },
        popBtn() {
            let name = this.input
            let url = this.url
            let iconClass = this.iconClass
            this.dialogVisible = false
            this.data.push({ name: name, url: url, isActive: false, iconClass: iconClass })
            this.writeFile(this.data)
        },
        writeFile(data) {
            fs.writeFileSync(path.join(__dirname, '../../../history.text'), JSON.stringify(data))
        },
        switchNav(index) {
            if (index === null) {
                this.isActive = true
                this.reset()
                return
            }
            if (!this.data[index]) return
            this.isActive = false
            this.reset()
            this.data[index].isActive = true
            this.index = index
            this.getIndex()
        },
        reset() {
            for (let i = 0, len = this.data.length; i < len; i++) {
                this.data[i].isActive = false
            }
        },
        handleEdit(index) {
            console.log('index', index)
            this.editVisible = true
            this.editInput = this.data[index].name
            this.editIndex = index
        },
        editPop() {
            this.data[this.editIndex].name = this.editInput
            this.writeFile(this.data)
            this.editVisible = false
        },
        handleDelete(index) {
            this.data.splice(index, 1)
            this.writeFile(this.data)
        },
        getIndex() {
            let webview = document.getElementById(`electron${this.index}`)
            console.log(webview)
            webview.addEventListener('dom-ready', () => {
                let webContents = webview.getWebContents()
                webContents.session.cookies.get({ url: 'http://mp.weixin.qq.com' }, (error, cookies) => {
                    console.log(error, cookies)
                })
                webContents.executeJavaScript(`
                    var account, pwd
                    document.querySelector('#account').value = 'xcvxccvxcvxcv'
                    document.querySelector('#pwd').value = '21112'
                    $('#account').on('keyup', function(){
                        $(this).val()
                    })
                    $('#pwd').on('keyup', function(){
                        $(this).val()
                    })
                    var a = {'account': account, pwd: pwd}
                    a
                `, (data) => { console.log(data) })
            })
        }
    }
}
</script>
