<template>
  <div id="app">
    <router-link to="/">
    <div class="header">
      <h1> iShop </h1>
    </div>
    </router-link>
    <router-view />
    <div class = "footer">
      <p> Here is the link to my gitHub: <a href="https://github.com/richeyty/creative4"> GitHub </a>  </p>
    </div>
  </div>
</template>

<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}



.header, .footer {
  background-color: #d9d9d9;
  text-align: center;
  padding: 20px 0px 20px 0px;
  font-size: 30px;
}

a {
  color: black;
  text-decoration: none;
}


</style>
