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
                <label>Owner :.</label>
                <b>{{item.owner}}</b>
                <br>
                <v-card-actions>
                  <b-button type="is-primary is-light" @click.native="buyAsset(item.id)">Buy Asset</b-button>
                </v-card-actions>
              
                <!-- <b-message title="Success" type="is-success" aria-close-label="Close message">
                    Success purchased asset
                </b-message> -->
            </div>
          </v-card>
        </v-col>
        <br>
        <span v-if="postResponse">
          <b>{{ postResponse }}</b>
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
        items: [
        {
          id: 'a5a09791-3bd8-4115-a297-b63f42e732ab',
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

            var response = [];
            for (let iter in apiResponse.data) {
                console.log("ENSOFFFF");
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

            this.getResponse = apiResponse;
          }
        }
      },
      async buyAsset(id) {
        this.username = StorageService.getUsername();
        this.identity = StorageService.getIdentity();
        console.log("BUY ASSET :" + id);
        if (!this.username || !this.identity) {
          console.log("!thislogin");
        
          let response = 'Please login first to access this page';
          this.postResponse.data = response;
        } else {
          const apiResponse = await PostsService.buy(
            this.username,
            this.identity,
            id
          );

          if (apiResponse.data.error) {
            // console.log(apiResponse);
            console.log(apiResponse.data.error);
            this.postResponse = "Failed to to buy asset : " + apiResponse.data.error;
          } else {
            this.postResponse = "success buy asset";
            this.getAvailableAsset();
          }
        }
      }
    }
  }
</script>
