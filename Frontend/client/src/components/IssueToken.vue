<template>
  
  <div class="table">
    <v-card
      color="#385F73"
      dark
    >
    <v-card-title class="headline">Issue Token</v-card-title>

    </v-card>
    <br>
    <br>

    <b-field label="Issue Token">
        <b-numberinput placeholder="insert token amount" v-model="amountIssue" :min="0"></b-numberinput>
    </b-field>
    <b-button type="is-primary" @click="issueToken">Issue Token</b-button>
    <br>
    <span v-if="postResponse1">
        <b>{{postResponse1}}</b>
    </span>
    <br>

    <b-field label="Send Token">
        <b-numberinput placeholder="insert token amount" v-model="amountSend" :min="0"></b-numberinput>
    </b-field>
    <b-field label="Username">
        <b-input placeholder="insert username" v-model="receiver" rounded></b-input>
    </b-field>
    <b-button type="is-primary" @click="sendToken">Send Token</b-button>
    <br>
    <br>
    <span v-if="postResponse2">
        <b>{{postResponse2}}</b>
    </span>
    <br>
    <vue-instant-loading-spinner id='loader' ref="Spinner"></vue-instant-loading-spinner>
  </div>  
</template>

<script>
    import PostsService from "@/services/apiService";
    import StorageService from "@/services/localStorageService";
    import VueInstantLoadingSpinner from "vue-instant-loading-spinner/src/components/VueInstantLoadingSpinner.vue";
    export default {
        data() {
            return {
                amountSend: 0,
                amountIssue: 0,
                apiResponse1: "",
                apiResponse2: "",
                postResponse1: "",
                postResponse2: "",
                username:"",
                identity: "",
                receiver:""
            }
        }, 
        components: {
            VueInstantLoadingSpinner
        },
        methods: {
            async issueToken() {
                this.username = StorageService.getUsername();
                this.identity = StorageService.getIdentity();

                if (this.username && this.username != 'admin') {
                    this.postResponse1 = "this page is only for admin";
                    return;
                }
                await this.runSpinner();

                if (!this.username || !this.identity) {
                    console.log("!thislogin");
                
                    let response = 'Please Login First';
                    this.postResponse1.data = response;
                } else {
                    const apiResponse1 = await PostsService.issueToken(
                        this.username,
                        this.identity,
                        this.amountIssue,
                    );
                    console.log("apiResponse");
                    console.log(apiResponse1.data);

                    if (apiResponse1.data.error) {
                    // console.log(apiResponse);
                        console.log(apiResponse1.data.error);
                        this.postResponse1 = apiResponse1;
                    } else {
                        this.postResponse1 = apiResponse1;
                    }
                }      
                await this.hideSpinner();
            },

            async sendToken() {
                this.username = StorageService.getUsername();
                this.identity = StorageService.getIdentity();

                if (this.username && this.username != 'admin') {
                    this.postResponse2 = "this page is only for admin";
                    return;
                }
                console.log('ENSOFFF');
                await this.runSpinner();

                if (!this.username || !this.identity) {
                    console.log("!thislogin");
                
                    let response = 'Please Login First';
                    this.postResponse2.data = response;
                } else {
                    console.log("ENSOFFFFF");
                    console.log(this.username);
                    console.log(this.identity);
                    console.log(this.amountSend.toString());
                    console.log(this.receiver);
                    const apiResponse2 = await PostsService.sendToken(
                        this.username,
                        this.identity,
                        this.amountSend,
                        this.receiver,
                    );
                    console.log("apiResponse");
                    console.log(apiResponse2.data);

                    if (apiResponse2.data.error) {
                    // console.log(apiResponse);
                        console.log(apiResponse2.data.error);
                        this.postResponse2 = apiResponse2;
                    } else {
                        this.postResponse2 = apiResponse2;
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
    }
</script>