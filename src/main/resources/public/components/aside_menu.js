export default {
  template: `
<div v-if="authState.isLoggedIn" 
     class="d-flex flex-column position-relative bg-white shadow-sm" 
     style="min-height: 100vh; border-radius: 0; 
            background: linear-gradient(180deg, #ffffff 0%, #f5f7fa 100%);">
    
    <!-- Toggle Button -->
    <div class="p-3 border-bottom">
        <button class="btn" 
                @click="toggleSidebar" 
                style="transition: transform 0.3s;">
            <i class="bi bi-list" 
               :class="{ 'rotate-180': sidebarOpen }"
               style="font-size: 1.25rem;"></i>
        </button>
    </div>

    <!-- Sidebar Content -->
    <aside :class="['flex-grow-1 overflow-hidden transition-width', 
                    sidebarOpen ? 'w-100' : 'w-20']"
           style="min-width: 70px; transition: all 0.3s cubic-bezier(0.65, 0, 0.35, 1);">
        
        <!-- Admin Panel -->
        <div v-if="authState.currentRole === 'ADMIN'" 
             class="d-flex flex-column p-3 h-100">
            
            <!-- User Info -->
            <div v-if="sidebarOpen" class="mb-4 text-center">
                <img src="assets/images/CyberSecurityShield.jpg" 
                     alt="User" class="img-fluid rounded-circle mb-2" 
                     style="width: 60px; height: 60px;">
                <h6 class="text-primary fw-bold mb-0">{{ authState.username }}</h6>
                <small class="text-muted">Administrator</small>
            </div>

            <!-- Navigation Links -->
            <div class="list-group list-group-flush">
                <button @click="changeView('dashboard')"
                        :class="['list-group-item list-group-item-action border-0 rounded-pill mb-2',
                                 selectedView === 'dashboard' ? 'active' : '']">
                    <i class="bi bi-speedometer2"></i>
                    <span v-if="sidebarOpen" class="m-3">Dashboard</span>
                </button>

                <button @click="changeView('domain_logs')"
                        :class="['list-group-item list-group-item-action border-0 rounded-pill mb-2',
                                 selectedView === 'domain_logs' ? 'active' : '']">
                    <i class="bi bi-journals"></i>
                    <span v-if="sidebarOpen" class="m-3">Domain Logs</span>
                </button>

                <button @click="changeView('register')"
                        :class="['list-group-item list-group-item-action border-0 rounded-pill mb-2',
                                 selectedView === 'register' ? 'active' : '']">
                    <i class="bi bi-person-plus"></i>
                    <span v-if="sidebarOpen" class="m-3">Register Users</span>
                </button>

                     <!-- Download Buttons (Bottom Section) -->
        <div class="mt-auto border-top pt-3" v-if="sidebarOpen">
            <div class="list-group list-group-flush">
                          
                <a href="/run-dns.bat" 
                   class="btn btn-outline-primary btn-sm w-100 mb-2 text-start"
                   download>
                    <i class="bi bi-download me-2"></i>
                    Configure DNS Server
                </a>

                   <a href="/restore-dns.bat" 
                   class="btn btn-outline-primary btn-sm w-100 text-start"
                   download>
                    <i class="bi bi-download me-2"></i>
                    Restore DNS Settings
                </a>
            </div>
        </div>
            </div>
        </div>
        

        <!-- Teacher Panel -->
        <div v-if="authState.currentRole === 'TEACHER'" 
             class="d-flex flex-column p-3 h-100">
            
            <!-- Navigation Links -->
            <div class="list-group list-group-flush">
                <button @click="changeView('blocked_domains')"
                        :class="['list-group-item list-group-item-action border-0 rounded-pill mb-2',
                                 selectedView === 'blocked_domains' ? 'active' : '']">
                    <i class="bi bi-shield-lock"></i>
                    <span v-if="sidebarOpen" class="m-3">Blocked Domains</span>
                </button>
            </div>
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
