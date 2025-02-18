export default {
  template: `
<div v-if="authState.isLoggedIn" class="d-flex flex-column border-end bg-light" style="min-height: 100vh;">
  <!-- Toggle Button Always Visible at the Top -->
  <div class="d-flex justify-content-start p-2">
    <button class="btn btn-outline-black" @click="toggleSidebar">
      <i class="bi bi-square-half"></i>
    </button>
  </div>
  
  <!-- Sidebar -->
  <aside :class="['d-flex flex-column p-3', sidebarOpen ? 'w-100' : 'w-auto']" 
         style="min-height: 100vh; width: 100px; transition: width 0.3s;">
    
    <!-- Admin-only Buttons -->
    <div v-if="authState.currentRole === 'ADMIN'">
     <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'dashboard' ? 'btn-active' : 'btn-dashboard']"
              @click="changeView('dashboard')">
        <i class="bi bi-file-earmark-text"></i>
        <span class="ms-2" v-if="sidebarOpen">Dashboard</span>
      </button>
      <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'domain_logs' ? 'btn-active' : 'btn-secondary']"
              @click="changeView('domain_logs')">
        <i class="bi bi-file-earmark-arrow-up"></i>
        <span class="ms-2" v-if="sidebarOpen">Domain Logs</span>
      </button>

      <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'register' ? 'btn-active' : 'btn-primary']"
              @click="changeView('register')">
        <i class="bi bi-file-earmark-text"></i>
        <span class="ms-2" v-if="sidebarOpen">Register Users</span>
      </button>
    </div>

    <!-- Teachers-only Buttons -->
    <div v-if="authState.currentRole === 'TEACHER'">
      <button :class="['btn', 'w-100', 'mb-2', 'd-flex', 'align-items-center', selectedView === 'blocked_domains' ? 'btn-active' : 'btn-success']"
              @click="changeView('blocked_domains')">
        <i class="bi bi-server"></i>
        <span class="ms-2" v-if="sidebarOpen">Blocked Domains</span>
      </button>
    </div>

  </aside>
</div>
  `,
  inject: ['authState'],
  data() {
    return {
      sidebarOpen: true,
      selectedView: '' // Track the active tab
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    changeView(view) {
      this.selectedView = view; // Update active tab
      this.$emit('change-view', view); // Emit event to parent component
    }
  }
};
