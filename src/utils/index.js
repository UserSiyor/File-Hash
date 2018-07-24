const cryptoJS = require('crypto-js')

/**
 * TODO 该方法当前不支持IE9以下版本
 * 数据请求结构  
 * @param file - file对象
 * @param method - 方法（默认MD5)
 * 目前方法包括：MD5、SHA1、RIPEMD-160、SHA-256、SHA-512、SHA-224、SHA-384、SHA3-224、SHA3-256、SHA3-384、SHA3-512
 * @returns String 文件hash值
 */

export function getHash(file,method) {
    return new Promise(function(resolve,reject) {

        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        let reader = new FileReader()
        let chunkSize = 1048576;
        let chunks = Math.ceil(file.size / chunkSize)
        let currentChunk = 0
        let hash = null
        
        let time = 0
        let timer = setInterval(function(){
            time ++
        },1000)

        switch (method) {
            case 'MD5':
                hash = cryptoJS.algo.MD5.create()
                break
            case 'SHA1':
                hash = cryptoJS.algo.SHA1.create()
                break
            case 'RIPEMD-160':
                hash = cryptoJS.algo.RIPEMD160.create()
                break
            case 'SHA-256':
                hash = cryptoJS.algo.SHA256.create()
                break
            case 'SHA-512':
                hash = cryptoJS.algo.SHA512.create()
                break
            case 'SHA-224':
                hash = cryptoJS.algo.SHA224.create()
                break
            case 'SHA-384':
                hash = cryptoJS.algo.SHA384.create()
                break
            case 'SHA3-224':
                hash = cryptoJS.algo.SHA3.create({ outputLength: 224 })
                break
            case 'SHA3-256':
                hash = cryptoJS.algo.SHA3.create({ outputLength: 256 })
                break
            case 'SHA3-384':
                hash = cryptoJS.algo.SHA3.create({ outputLength: 384 })
                break
            case 'SHA3-512':
                hash = cryptoJS.algo.SHA3.create({ outputLength: 512 })
                break
            default:
                hash = cryptoJS.algo.MD5.create()
                break
        }

        loadNext()

        reader.onloadend = ((e) => {
            let data = arrayBufferToWordArray(e.target.result)
            hash.update(data)
            currentChunk ++  
            
            console.log('完成度:' +  Math.floor(currentChunk/chunks*100) + '%')

            if(currentChunk < chunks) {
                loadNext()
            }
            else {
                clearInterval(timer)
                console.log('用时:' + time + 's')
                resolve(hash.finalize().toString())
            }
        })

        reader.onerror = ((e) => {
            resolve('error')
        })

        function loadNext() {
            var start = currentChunk * chunkSize;
            var end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
            reader.readAsArrayBuffer(blobSlice.call(file, start, end));
          }
    })
}


function arrayBufferToWordArray(arrayBuffer) {
    var fullWords = Math.floor(arrayBuffer.byteLength / 4);
    var bytesLeft = arrayBuffer.byteLength % 4;
    var u32 = new Uint32Array(arrayBuffer, 0, fullWords);
    var u8 = new Uint8Array(arrayBuffer);
    var cp = [];
    
    for (var i = 0; i < fullWords; ++i) {
        cp.push(swapendian32(u32[i]));
    }

    if (bytesLeft) {
        var pad = 0;
        for (var i = bytesLeft; i > 0; --i) {
            pad = pad << 8;
            pad += u8[u8.byteLength - i];
        }

        for (var i = 0; i < 4 - bytesLeft; ++i) {
            pad = pad << 8;
        }

        cp.push(pad);
    }

    return cryptoJS.lib.WordArray.create(cp, arrayBuffer.byteLength);
}

function swapendian32(val) {
    return (((val & 0xFF) << 24) |
        ((val & 0xFF00) << 8) |
        ((val >> 8) & 0xFF00) |
        ((val >> 24) & 0xFF)) >>> 0;
}