<template>
  <div class="posts">
    <h1>MSME DAPP</h1>
    <h3>If you have been registered, enter your username and identity below</h3>
    <!--span><b>{{ response }}</b></span><br /-->
    <form v-on:submit="login">
      <input type="text" v-model="loginData.username" placeholder="Enter username">
      <br>
      <label>upload identity : 
      <input type="file" id="file" ref="file" v-on:change="handleFileUpload()">
      </label>
      <br>
      <br>
      <input type="submit" value="Login">
      <br>
      <br>
      <span v-if="loginReponse">
        <b>{{ loginReponse.data }}</b>
      </span>
      <br>
    </form>

    <br>
    <h3>Otherwise, fill out the form below to register!</h3>
    <form v-on:submit="register">
      <input type="text" v-model="registerData.username" placeholder="Enter Username">
      <br>
      <input type="text" v-model="registerData.firstName" placeholder="Enter First Name">
      <br>
      <input type="text" v-model="registerData.lastName" placeholder="Enter Second Name">
      <br>
      <input type="submit" value="Register">
    </form>
    <br>
    <span v-if="registerReponse">
      <b>{{ registerReponse.data }}</b>
    </span>
    <br>
    <vue-instant-loading-spinner id='loader' ref="Spinner"></vue-instant-loading-spinner>
  </div>
</template>

<script>
import PostsService from "@/services/apiService";
import VueInstantLoadingSpinner from "vue-instant-loading-spinner/src/components/VueInstantLoadingSpinner.vue";

export default {
  name: "response",
  data() {
    return {
      loginData: {},
      registerData: {},
      registerReponse: {
        data: ""
      },
      loginReponse: {
        data: ""
      },
      file: ""
    };
  },
  components: {
    VueInstantLoadingSpinner
  },
  methods: {
    handleFileUpload(){
      this.file = this.$refs.file.files[0];

      var fil = this.file,
          read = new FileReader();      

      read.readAsBinaryString(fil);

      console.log("ENSOF1");
      console.log(read.result);

      read.onload = function(){
        console.log("ENSOF2");
        var cek = read.result
        console.log(cek)
        this.loginData.identity = cek;
        console.log("ENSOF SUCCESS");
      }
    },

    async register() {
      console.log("ENSOF BARHAMI");
      await this.runSpinner();
      const apiResponse = await PostsService.register(
        this.registerData.username,
        this.registerData.firstName,
        this.registerData.lastName
      );
      
      var str = JSON.stringify(apiResponse.data);

      var a = document.createElement("a");
      var file = new Blob([str], {type: 'application/json'});
      a.href = URL.createObjectURL(file);
      a.download = 'ensof.id';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // const a = window.document.createElement('a');
      // a.href = window.URL.createObjectURL(blob, { type: 'text/plain' });
      // a.download = filename;
      // document.body.appendChild(a);
      // a.click(); // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
      // document.body.removeChild(a);

      if (apiResponse.status == 200) {
        console.log(apiResponse);
        this.registerReponse = apiResponse;
        await this.hideSpinner();
      } else {
        console.log(apiResponse);
        this.registerReponse = {error: 'error'};
        await this.hideSpinner();
      }
      

    },

    async login() {
      await this.runSpinner();

      if (!this.loginData.username || !this.loginData.identity) {
        console.log("!thislogin");
        let response = 'Please enter a username and identity';
        this.loginReponse.data = response;
        await this.hideSpinner();
      } else {
        const apiResponse = await PostsService.login(
          this.loginData.username,
          this.loginData.identity
        );
        console.log("apiResponse");
        console.log(apiResponse.data);

        if (apiResponse.data.error) {
          // console.log(apiResponse);
          console.log(apiResponse.data.error);
          this.loginReponse = apiResponse.data.error;
        } else {
          this.$router.push("castBallot");
        }

        console.log(apiResponse);
        this.loginReponse = apiResponse;
        // this.$router.push('castBallot')
        await this.hideSpinner();
      }
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
