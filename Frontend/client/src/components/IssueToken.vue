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
        <b-numberinput placeholder="insert token amount" v-model="price" :min="0"></b-numberinput>
    </b-field>
    <b-button type="is-primary" @click="createAsset">Issue Token</b-button>
    <br>
    <br>
  </div>  
</template>

<script>
    export default {
        data() {
            return {
                data: [
                    { 'id': 1, 'first_name': 'Jesse', 'last_name': 'Simmons' },
                    { 'id': 2, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male' },
                    { 'id': 3, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female' },
                    { 'id': 4, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
                    { 'id': 5, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female' }
                ],
                columns: [
                    {
                        field: 'id',
                        label: 'No',
                        width: '40',
                        numeric: true
                    },
                    {
                        field: 'first_name',
                        label: 'Attribute',
                    },
                    {
                        field: 'last_name',
                        label: 'Value',
                    },
                ]
            }
        }
    }
</script>