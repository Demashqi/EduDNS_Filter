export default {
  template: `
   <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <!-- Logo and Title -->
    <div v-if="!authState.isLoggedIn" class="d-flex w-100 justify-content-center">
      <img src="assets/images/neural.png" alt="Ericsson" class="img-fluid m-2" style="max-height: 30px;">
      <a class="navbar-brand text-center" href="#">Domain Name System</a>
    </div>

    <div v-else class="d-flex align-items-center">
      <img src="assets/images/neural.png" alt="Ericsson" class="img-fluid m-2" style="max-height: 30px;">
      <a class="navbar-brand" href="#">Domain Name System</a>
    </div>

    <!-- Toggler -->
    <button v-if="authState.isLoggedIn" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Navbar links -->
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        
        <li v-if="authState.isLoggedIn" class="nav-item">
          <span class="nav-link text-white font-weight-bold">
            {{ authState.username }}
          </span>
        </li>
        <li v-if="authState.isLoggedIn && authState.role.includes(',')" class="nav-item dropdown">
       <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" 
   data-bs-toggle="dropdown" aria-expanded="false">
   Select Role
</a>

          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li v-for="role in authState.role.split(',')" :key="role.trim()">
              <a class="dropdown-item text-truncate" href="#" @click="changeRole(role.trim())">
                {{ capitalizeRole(role.trim()) }}
              </a>
            </li>
          </ul>
        </li>
        <li v-if="authState.isLoggedIn" class="nav-item">
          <a class="nav-link text-white" href="#" @click="logout">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</nav>


  `,

  inject: ['authState'],
  methods: {
    logout() {
      localStorage.removeItem("jwt");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("currentRole");
      this.authState.isLoggedIn = false;
      this.authState.username = "";
      this.authState.role = "";
      this.authState.currentRole = "";
      this.$root.changeView('login');
    },
    goToLogin() {
      this.$root.changeView('login');
    },
    changeRole(newRole) {
      this.$root.changeRole(newRole);
    },

    capitalizeRole(role) {
      // Replace underscores or dashes with spaces, split the role into words
      const words = role.replace(/[-_]/g, ' ').split(' ');
  
      // Capitalize each word
      const capitalizedWords = words.map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );
  
      // Join the words back together and return the result
      return capitalizedWords.join(' ');
    }
  },
  mounted() {
    // Manually initialize Bootstrap dropdown
    const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))
    dropdownElementList.map(function (dropdownToggleEl) {
      return new bootstrap.Dropdown(dropdownToggleEl)
    })
  }
  
};
