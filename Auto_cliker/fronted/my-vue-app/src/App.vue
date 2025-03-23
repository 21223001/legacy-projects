<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      message: ''  // サーバーから取得したメッセージを格納する変数
    }
  },
  created() {
    // バックエンドからデータを取得
    axios.get('http://localhost:3000')  // バックエンドのAPIエンドポイント
      .then(response => {
        this.message = response.data;  // 取得したデータをmessageに格納
      })
      .catch(error => {
        console.error("There was an error:", error);
      });
  }
}
</script>



<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
