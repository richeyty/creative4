<template>
  <div class="upload">

    <div id="users">
      <h2> Choose user </h2>
      <button :class="{selected: active(user)}" v-for="user in users" :key=user.id @click=selectUser(user)>{{user.name}}</button>
    </div>
    <form @submit.prevent="createUser">
      <h2> Create User </h2>
      <input v-model="name" placeholder="Your Name">
        <p></p>
      <input v-model="phone" placeholder="Your Phone Number">
        <p></p>
      <input v-model="city" placeholder="Your City">
        <p></p>
      <button type="submit">Create</button>
    </form>


    <div class="add">
      <h2>List Your Item</h2>
      <div class="form">
        <input v-model="title" placeholder="Product Title">
          <p></p>
        <input v-model="price" placeholder="Price">
          <p></p>
        <textarea v-model="description" placeholder="Description">
          <p></p>
        </textarea>
        <input type="file" name="photo" @change="fileChanged">
        <button @click="upload">Upload</button>
      </div>

      <div class="submit" v-if="addItem">
        <h2>{{addItem.title}}</h2>
        <h3>{{addItem.description}}</h3>
        <img :src="addItem.path" />
      </div>
  </div>

  <div class="edit">
      <div class="form">
        <input v-model="findTitle" placeholder="Search">
        <div class="suggestions" v-if="suggestions.length > 0">
          <div class="suggestion" v-for="s in suggestions" :key="s._id" @click="selectItem(s)">{{s.title}}
          </div>
        </div>
      </div>
      <div class="editInfo">
        <div class="submit" v-if="findItem">
          <p></p>
          <input v-model="findItem.title">
          <p></p>
          <input v-model="findItem.price">
          <textarea v-model="findItem.description">
          </textarea>
          <img :src="findItem.path" />
        </div>

        <div class="actions" v-if="findItem">
          <button @click="deleteItem(findItem)">Delete</button>
          <button @click="editItem(findItem)">Edit</button>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import axios from 'axios';
export default {
  name: 'Upload',
  data() {
    return {
      title: "",
      description: "",
      city: "",
      phone: "",
      name: "",
      price: "",
      file: null,
      addUser: null,
      addItem: null,
      items: [],
      users: [],
      user: null,
      findTitle: "",
      findItem: null,
    }
  },
  computed: {
    suggestions() {
      let items = this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      return items.sort((a, b) => a.title > b.title);
    }
  },
  created() {
    this.getUsers();
    this.getItems();
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0]
    },
    async createUser() {
      try {
        await axios.post('/api/users', {
          name: this.name,
          city: this.city,
          phone: this.phone
        });
        await this.getUsers();
      } catch (error) {
        console.log(error);
      }
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name)
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/users/' + this.user._id + '/items', {
          title: this.title,
          user: this.user,
          description: this.description,
          price: this.price,
          path: r1.data.path
        });
        this.addItem = r2.data;
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
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    async deleteItem(item) {
      try {
        await axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async editItem(item) {
      try {
        await axios.put("/api/items/" + item._id, {
          title: this.findItem.title,
          description: this.findItem.description,
          name: this.findItem.name,
          phone: this.findItem.phone,
          price: this.findItem.price,
          city: this.findItem.city,
        });
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    active(user) {
      return (this.user && user._id === this.user._id);
    },
    selectUser(user) {
      this.user = user;
      this.getUsers();
    },
  }
}
</script>

<style scoped>

input {
  height: 30px;
}

button {
  margin-right: 3px;
  padding: 4px;
}
button.selected {
  border-bottom: 2px solid #000;
  background-color: #f7ecda;
}

.editInfo {
  display: block;
}

textarea {
  height: 80px;
}

.add {
  margin-top: 40px;
}

.upload {
  padding: 30px;
}

.edit {
  margin-top: 50px;
  display: flex;
}

img {
  width: 30%
}

.submit {
  display: block;
  margin: 20px;
}
.suggestions {
  width: 150px;
  border: 1px solid black;
}

.suggestion:hover {
  background-color: #f7ecda;
}

</style>
