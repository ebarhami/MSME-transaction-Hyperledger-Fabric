<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">    
      
        <p><router-link to="/">Home</router-link>&nbsp;          
        <!-- <router-link to="/castBallot">Cast Ballot</router-link>&nbsp; -->
        <router-link to="/QueryAll">My Asset</router-link></p>
        <router-link to="/queryWithQueryString">Profile</router-link>&nbsp;
        <router-link to="/queryByKey">Report</router-link>&nbsp;
        <router-link to="/getCurrentStanding">Available Asset</router-link>&nbsp;
        <router-link to="/castBallot">Create Asset</router-link>&nbsp;
        <router-link to="/issueToken">Issue Token</router-link>&nbsp;
      
      <router-view></router-view>
    </div>
</template>

<script>

export default {
  name: 'app'  
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.chart-wrapper {
  width: 100%;
  height: 700px;
}
.echarts {
  width: 100%;
  height: 100%;
}

#loader {
  position:fixed;
  padding-top: 250px;
}

.chart-wrapper {
  position:fixed;
  padding-left:32%;
}

.create-asset {
  width: 600px;
	height: 100px;
	
	position: absolute;
	top:0;
	bottom: 0;
	left: 0;
	right: 0;
  	
	margin: auto;
}

.my-asset {
  width: 600px;
	height: 100px;
	
	position: absolute;
	top:0;
	bottom: 0;
	left: 0;
	right: 0;
  	
	margin: auto;
}

.table {
  width: 600px;
	height: 100px;
	
	position: absolute;
	top:0;
	bottom: 0;
	left: 0;
	right: 0;
  	
	margin: auto;
}

.posts {
  width: 600px;
	height: 300px;
	
	position: absolute;
	top:0;
	bottom: 0;
	left: 0;
	right: 0;
  	
	margin: auto;
}
</style>
