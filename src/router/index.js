import Vue from 'vue'
import Router from 'vue-router'
import fileUpload from '@/components/fileUpload'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'fileUpload',
      component: fileUpload
    }
  ]
})
