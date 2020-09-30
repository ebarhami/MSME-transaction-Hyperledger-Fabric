<template>
  <v-card
    max-width="600"
    class="my-asset"
  >

    <v-container>
      <v-row dense>
        <v-col cols="12">
          <v-card
            color="#385F73"
            dark
          >
            <v-card-title class="headline">My Asset</v-card-title>

          </v-card>
        </v-col>

        <v-col
          v-for="(item, i) in items"
          :key="i"
          cols="12"
        >
          <v-card
            :color="item.color"
            dark
          >
            <div class="d-flex flex-no-wrap justify-space-between">
              
                <v-card-title
                  class="headline"
                  v-text="item.name"
                ></v-card-title>
                <label>ID :</label>
                <b>{{item.id}}</b>
                <br> 
                <label>Category :</label>
                <b>{{item.category}}</b>
                <br> 
                <label>Price : Rp.</label>
                <b>{{item.price}}</b>
                <br>
                <label>Status :.</label>
                <b>{{item.status}}</b>
                <br>
                <label>Owner :.</label>
                <b>{{item.owner}}</b>
                <br>
                <br> 
            </div>
          </v-card>
        </v-col>
        <br>
        <span v-if="postResponse">
          <b>{{ postResponse.data }}</b>
        </span>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
  
  import StorageService from "@/services/localStorageService";
  import PostsService from "@/services/apiService";

  export default {
    name: "response",
    data() {
      return {
        card: 0,  
        category: "",
        name: "",
        price: 0,
        apiResponse: "",
        username: "",
        identity: "",
        postResponse: "",
        getResponse: "",
        items: [],
      };
    },

    beforeMount(){
      this.getMyAsset();
    },

    methods : {
      async getMyAsset(){
        this.username = StorageService.getUsername();
        this.identity = StorageService.getIdentity();

        console.log(this.username);
        console.log(this.identity);
        console.log("GET ASSET")
        if (!this.username || !this.identity) {
          console.log("!thislogin");
        
          let response = 'Please login first to access this page';
          this.postResponse.data = response;
        } else {
          const apiResponse = await PostsService.myAsset(
            this.username,
            this.identity
          );
          console.log("apiResponse");
          console.log(apiResponse.data);

          var response = [];
          for (let iter in apiResponse.data) {
              var datum = apiResponse.data[iter];
              console.log(datum);
              console.log(datum['Record']);
              console.log(datum['Record']['Name']);
              response.push({
                  id: datum['Record']['ID'],
                  category: datum['Record']['Category'],
                  name: datum['Record']['Name'],
                  price: datum['Record']['Price'],
                  owner: datum['Record']['Owner'],
                  status: datum['Record']['Status'],
              })
          }

          this.items = await response;

          if (apiResponse.data.error) {
            // console.log(apiResponse);
            console.log(apiResponse.data.error);
            this.getResponse = apiResponse;
          } else {
            this.getResponse = apiResponse;
          }
        }
      },
    }
  }
</script>
