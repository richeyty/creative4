<template>
  <div class="listings">
    <div class="header">
      <h2>Listings</h2>
    </div>


    <div class="image" v-for="item in items" :key="item.id">

      <img :src="item.path" />

      <h2>{{item.title}}</h2>
      <h2>${{item.price}}</h2>
      <h3>{{item.description}}</h3>
      <div class="person" v-for="user in users" :key="user.id">

        <template v-if="user._id === item.user">
          <h2> Seller: {{user.name}} </h2>
          <h2> Phone #: {{user.phone}} </h2>
          <h2> City: {{user.city}} </h2>
        </template>
      </div>


    </div>




  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios';

export default {
  name: 'Listings',
  data() {
    return {
     items: [],
     users: []
    }
  },
  created() {
    this.getItems();
    this.getUsers();
  },
  methods: {
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getUsers() {
      try {
        let response = await axios.get("/api/users");
        this.users = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  }
}
</script>


<style scoped>

.image {
  border-bottom: solid 5px black;

}

.image img {
  width: 30%;
}

.listings {
  background-color: #f7ecda;
  align-text: center;
  padding: 30px;
}

</style>
