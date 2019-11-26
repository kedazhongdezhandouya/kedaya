<!--
 * @Author: your name
 * @Date: 2019-11-26 15:01:20
 * @LastEditTime: 2019-11-26 19:28:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \public_htmld:\own_practice\kedaya\vue-router\src\components\Home.vue
 -->
<template>
  <div>
    <h1>Home</h1>
    <p>{{ $route.params.id }}</p>
    <p>{{ msg }}</p>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        msg: 'Hello, vue router!'
      }
    }
  }
</script>