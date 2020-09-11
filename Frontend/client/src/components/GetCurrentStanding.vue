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
            <v-card-title class="headline">Available Asset to buy</v-card-title>

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
                <v-card-actions>
                  <b-button type="is-primary is-light" @click="buyAsset(item.id)">Buy Asset</b-button>
                </v-card-actions>
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
        items: [
        {
          id: '12931r3n1F7087',
          category: 'panganan',
          name: 'Indomie',
          price: '5000',
        },
        {
          id: '12931r3n1F7087',
          category: 'panganan',
          name: 'Indomie',
          price: '5000',
        },
        {
          id: '12931r3n1F7087',
          category: 'panganan',
          name: 'Indomie',
          price: '5000',
        },
        {
          id: '12931r3n1F7087',
          category: 'panganan',
          name: 'Indomie',
          price: '5000',
        },
        ],
      };
    },

    beforeMount(){
      this.getAvailableAsset();
    },

    methods : {
      async getAvailableAsset(){
        this.username = StorageService.getUsername();
        this.identity = StorageService.getIdentity();

        if (!this.username || !this.identity) {
          console.log("!thislogin");
        
          let response = 'Please login first to access this page';
          this.postResponse.data = response;
        } else {
          const apiResponse = await PostsService.issuedAsset(
            this.username,
            this.identity
          );
          console.log("apiResponse");
          console.log(apiResponse.data);

          if (apiResponse.data.error) {
            // console.log(apiResponse);
            console.log(apiResponse.data.error);
            this.getResponse = apiResponse;
          } else {
            this.getResponse = apiResponse;
          }
        }
      },
      async buyAsset(id) {
        this.username = StorageService.getUsername();
        this.identity = StorageService.getIdentity();

        if (!this.username || !this.identity) {
          console.log("!thislogin");
        
          let response = 'Please login first to access this page';
          this.postResponse.data = response;
        } else {
          const apiResponse = await PostsService.buyAsset(
            this.username,
            this.identity,
            id
          );

          if (apiResponse.data.error) {
            // console.log(apiResponse);
            console.log(apiResponse.data.error);
            this.postResponse = "Failed to to buy asset : " + apiResponse.data.error;
          } else {
            this.postResponse = "success buy asset" + apiResponse.data.error;
          }
        }
      }
    }
  }
</script>
