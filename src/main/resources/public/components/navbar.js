export default {
  template: `
   <nav class="navbar navbar-expand-lg navbar-dark" 
     style="background: linear-gradient(90deg,rgb(0, 175, 152) 0%,rgb(8, 59, 155) 100%); 
            box-shadow: 0 2px 15px rgba(0,0,0,0.1); border-radius: 0;">
  <div class="container-fluid px-4">
    <!-- Logo and Title -->
    <div class="d-flex align-items-center">
      <img src="assets/images/CyberSecurityShield.jpg" alt="EduDNS" 
           class="img-fluid me-2" style="max-height: 35px; border-radius: 6px;">
      <a class="navbar-brand fw-bold text-white" href="#" 
         style="font-size: 1.25rem; letter-spacing: -0.5px;">
        EduDNS Filter
      </a>
    </div>

    <!-- Toggler -->
    <button v-if="authState.isLoggedIn" class="navbar-toggler border-0 shadow-none" 
            type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Navbar links -->
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto align-items-lg-center">
        <!-- Authenticated State -->
        <template v-if="authState.isLoggedIn">
          <!-- Username Badge -->
          <li class="nav-item me-3 d-none d-lg-block">
            <span class="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill"
                  style="font-size: 0.9rem;">
              {{ authState.username }}
            </span>
          </li>

          <!-- Role Selector -->
          <li v-if="authState.role.includes(',')" class="nav-item dropdown me-3">
            <a class="nav-link dropdown-toggle text-white" href="#" 
               id="roleDropdown" role="button" data-bs-toggle="dropdown" 
               style="transition: all 0.3s; padding: 0.75rem 1.25rem;">
              <i class="bi bi-person-gear me-2"></i>
              {{ selectedRole }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end shadow" 
                style="border-radius: 10px; border: none;">
              <li v-for="role in authState.role.split(',')" :key="role.trim()">
                <a class="dropdown-item d-flex align-items-center" href="#" 
                   @click="changeRole(role.trim())">
                  <i class="bi bi-check2 me-2 text-primary" 
                     v-if="selectedRole === role.trim()"></i>
                  {{ capitalizeRole(role.trim()) }}
                </a>
              </li>
            </ul>
          </li>

          <!-- Logout Button -->
          <li class="nav-item">
            <a class="nav-link btn-sm px-4 py-2 rounded-pill" 
               href="#" @click="logout" 
               style="transition: transform 0.2s; font-weight: 500;">
              <i class="bi bi-box-arrow-right me-2"></i> Logout
            </a>
          </li>
        </template>
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
