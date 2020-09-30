<template>
    <section>
      <div class="create-asset">
        <v-card
            color="#385F73"
            dark
          >
            <v-card-title class="headline">Create Asset</v-card-title>

          </v-card>
          <br>
          <br>

        <b-field label="Category">
            <b-input placeholder="insert category" v-model="category" rounded></b-input>
        </b-field>
        <b-field label="Name">
            <b-input placeholder="insert product name" v-model="name" rounded></b-input>
        </b-field>
        <b-field label="Price">
            <b-numberinput placeholder="insert price" v-model="price" :min="0"></b-numberinput>
        </b-field>
        <b-button type="is-primary" @click="createAsset">Create Asset</b-button>
        <br>
        <br>
        <span v-if="getResponse">
          <b>Success Create Asset</b>
        </span>
        <br>
        <vue-instant-loading-spinner id='loader' ref="Spinner"></vue-instant-loading-spinner>
      </div>
    </section>
</template>

<script>
import PostsService from "@/services/apiService";
import StorageService from "@/services/localStorageService";
import VueInstantLoadingSpinner from "vue-instant-loading-spinner/src/components/VueInstantLoadingSpinner.vue";

export default {
  name: "response",
  data() {
    return {
      category: "",
      name: "",
      price: 0,
      apiResponse: "",
      getResponse: ""
    };
  },
  components: {
    VueInstantLoadingSpinner
  },
  methods: {
    async createAsset() {
      await this.runSpinner();
      this.username = StorageService.getUsername();
      this.identity = StorageService.getIdentity();

      if (!this.username || !this.identity) {
        console.log("!thislogin");
      
        let response = 'Please Login First';
        this.postResponse.data = response;
      } else {
        const apiResponse = await PostsService.createAsset(
          this.username,
          this.identity,
          this.category,
          this.name,
          this.price
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
      await this.hideSpinner();
    },
    async runSpinner() {
      this.$refs.Spinner.show();
    },
    async hideSpinner() {
      this.$refs.Spinner.hide();
    }
  }
};
</script>
