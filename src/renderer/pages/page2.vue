<template>
    <section class="page-signIn">
        <div class="lt-main">
            <nav class="signIn-nav">
                <div :class="{active: isActive}" @click="switchNav()">首页</div>
                <div v-for="(item, index) in data" :class="{active: item.isActive}" @click="switchNav(index)">{{item.name}}</div>
            </nav>
            <div>
                <div class="content">
                    <div class="home">
                        <div class="content-left">
                            <div v-for="item in app" :id="item.id" @click="weChatClick(item)">
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
                <div v-for="item in data">{{item.name}}</div>
            </div>
            <webview v-for="(item, index) in data" :class="{active: item.isActive}" @click="switchNav(index)">{{item.name}}</webview>
            <!--<a class="weChatBtn" @click="login">登录</a>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <div v-for="item in data">{{item}}</div>-->
            <!--<webview src="http://www.weibo.com" partition="persist:electron" style="height:300px"></webview>-->
    
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
            <!--<el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>-->
        </div>
    </section>
</template>
<script>
import { mapActions } from 'vuex'
import fs from 'fs'
import path from 'path'
// import { dialog } from 'electron'
// const dialog = require('electron').dialog

export default {
    data() {
        return {
            btn: false,
            isActiveInputClose: false,
            mobile: '',
            password: '',
            data: [],
            dialogVisible: false,
            editVisible: false,
            editIndex: '',
            editInput: '',
            input: '',      // 当前点击应用的名称放入这里
            url: '',        // 当前点击应用的链接放入这里
            iconClass: '',   // 当前点击应用的图标放入这里
            index: 0,
            isActive: true,
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
        mobile() {
            this.showInputClose()
        }
    },
    mounted() {
        fs.readFile(path.join(__dirname, '../../../history.text'), (err, data) => {
            if (err) console.log(err.stack)
            this.data = JSON.parse(data.toString())
        })
    },
    methods: {
        ...mapActions([
            'postLogin',
            'showToast'
        ]),
        weChatClick(app) {
            this.input = app.name
            this.url = app.url
            this.iconClass = app.iconClass
            this.dialogVisible = true
            // console.log(dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }))
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
            if (index === undefined) {
                this.isActive = true
                this.reset()
                return
            }
            if (!this.data[index]) return
            this.isActive = false
            this.reset()
            this.data[index].isActive = true
            this.index = index
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
        editPop() {           // 编辑弹框的确认事件
            this.data[this.editIndex].name = this.editInput
            this.writeFile(this.data)
            this.editVisible = false
        },
        handleDelete(index) {
            this.data.splice(index, 1)
            this.writeFile(this.data)
        }
    }
}
</script>
