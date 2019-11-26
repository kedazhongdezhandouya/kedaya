<template>
  <div id="app">
    <div>
      <router-link :to="{name: 'home', params: {id: 456}}">
        <a href="">home</a>
      </router-link>
      <router-link to='about'>
        <a href="">about</a>
      </router-link>
      <p>{{ $route.name }}</p>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

</style>
