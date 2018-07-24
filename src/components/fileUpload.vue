<template>
<div class="content">
    <input type="file" @change='getFile'>
    <button @click="Hash('MD5')">MD5</button>
    <button @click="Hash('SHA1')">SHA1</button>
    <button @click="Hash('RIPEMD-160')">RIPEMD-160</button>
    <button @click="Hash('SHA-256')">SHA-256</button>
    <button @click="Hash('SHA-512')">SHA-512</button>
    <button @click="Hash('SHA-224')">SHA-224</button>
    <button @click="Hash('SHA-384')">SHA-384</button>
    <button @click="Hash('SHA3-224')">SHA3-224</button>
    <button @click="Hash('SHA3-256')">SHA3-256</button>
    <button @click="Hash('SHA3-384')">SHA3-384</button>   
    <button @click="Hash('SHA3-512')">SHA3-512</button>
    <p v-for="item in hashList" :key="item.key">{{item.content}}</p>
</div>
</template>

<script>

import { getHash } from "@/utils";

export default {
    name: 'fileUpload',
    data() {
        return {
            hashList: [],
            file: ''
        }
    },
    methods: {

        //TODO 该方法当前不支持IE9以下版本
        //引用的是crypto-js
        //gitHub：https://github.com/brix/crypto-js
        //Api:https://code.google.com/p/crypto-js
        getFile(e) {
            if(e.target.files[0] && e.target.files[0] != '') {
                this.file = e.target.files[0]
            }
            else {
                this.file = ''
            }
        },
        Hash(method) {
            if(this.file != '') {
                this.hashList = this.hashList.concat({ content: '正在计算中...' })
                getHash(this.file,method).then(res => {
                    this.hashList[this.hashList.length - 1].content = res
                })
            }
        }
    }
}
</script>

<style scoped>
.content {
    text-align: left;
}
</style>
