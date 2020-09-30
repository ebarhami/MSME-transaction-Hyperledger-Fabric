<template>
  
  <div class="table">
    <v-card
      color="#385F73"
      dark
    >
      <v-card-title class="headline">Profile</v-card-title>

    </v-card>
    <br>
    <br>

    

    <br>
    <span v-if="getResponse">
        <b-table :data="data" :columns="columns"></b-table>
    </span>
  </div>
</template>

<script>

    import PostsService from "@/services/apiService";
    import StorageService from "@/services/localStorageService";    
    
    export default {
        data() {
            return {
                data: [
                    { 'id': 1, 'attribute': 'username', 'value': 'ensof' },
                    { 'id': 2, 'first_name': 'first_name', 'last_name': '123', 'date': '2016-12-15 06:00:53', 'gender': 'Male' },
                    { 'id': 3, 'first_name': 'last_name', 'last_name': 'asf', 'date': '2016-04-26 06:26:28', 'gender': 'Female' },
                    { 'id': 4, 'first_name': 'token', 'last_name': '10000', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
                ],
                columns: [
                    {
                        field: 'id',
                        label: 'No',
                        width: '40',
                        numeric: true
                    },
                    {
                        field: 'attribute',
                        label: 'Attribute',
                    },
                    {
                        field: 'value',
                        label: 'Value',
                    },
                ],
                getResponse: {
                    data: ""
                },
            }
        }, 

        beforeMount(){
          this.getMyProfile();
        },

        methods : {
            async getMyProfile(){
                this.username = StorageService.getUsername();
                this.identity = StorageService.getIdentity();

                if (!this.username || !this.identity) {
                    console.log("!thislogin");
                    
                    let response = 'Please Login First';
                    this.postResponse.data = response;
                } else {
                    const apiResponse = await PostsService.getProfile(
                        this.username,
                        this.identity
                    );
                    console.log("apiResponse");
                    console.log(apiResponse.data);

                    if (apiResponse.data.error) {
                        // console.log(apiResponse);
                        console.log(apiResponse.data.error);
                        this.getResponse.data = apiResponse;
                    } else {
                        var response = [];
                        let i = 1;
                        for (let key in apiResponse.data) {
                            response.push({
                                id: i++,
                                attribute: key,
                                value: apiResponse.data[key]
                            });
                        }
                        this.data = await response;
                        this.getResponse.data = apiResponse.data;
                    }
                }
            },
        }
    }
</script>