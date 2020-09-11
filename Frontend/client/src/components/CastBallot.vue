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
        <span v-if="postResponse">
          <b>{{ postResponse.data }}</b>
        </span>
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
      postResponse: ""
    };
  },
  components: {
    VueInstantLoadingSpinner
  },
  methods: {
    async createAsset() {
      // await this.runSpinner();

      StorageService.setUsername("RUDIII");

      console.log("ENSOF BARHAMI");
      console.log(this.category);
      console.log(this.name);
      console.log(this.price);
      console.log(StorageService.getUsername())

      
      // await this.hideSpinner();
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
