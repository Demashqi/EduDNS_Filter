
export default {
  template: `
<div class="container d-flex justify-content-center align-items-center" style="height: 80vh;">
    <div class="card border-0 shadow" style="max-width: 420px; width: 100%; border-radius: 18px; background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);">
        <div class="card-body p-5">
            <div class="text-center mb-5">
                <img src="assets/images/CyberSecurityShield.jpg" alt="EduDNS" class="img-fluid" style="max-height: 90px; transform: scale(1.2);">
            </div>

            <h2 class="text-center text-primary mb-4 fw-bold" style="letter-spacing: -0.5px;">Login</h2>
            
            <form @submit.prevent="handleLogin">
                <div class="form-floating mb-3">
                    <input type="text" id="username" class="form-control border-0 shadow-sm" 
                           v-model="username" required placeholder="Username"
                           style="background: #fcfdff; border-radius: 10px;">
                    <label for="username" class="text-muted ps-3">Username</label>
                </div>

                <div class="form-floating mb-4">
                    <input type="password" id="password" class="form-control border-0 shadow-sm" 
                           v-model="password" required placeholder="Password"
                           style="background: #fcfdff; border-radius: 10px;">
                    <label for="password" class="text-muted ps-3">Password</label>
                </div>

                <button type="submit" class="btn btn-primary w-100 py-3 fw-semibold mb-3" 
                        :disabled="isLoading" 
                        style="border-radius: 12px; transition: transform 0.2s;">
                    <span v-if="!isLoading">Login</span>
                    <span v-else class="d-flex align-items-center justify-content-center">
                        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                    </span>
                </button>

                <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show mt-3 mb-0" role="alert">
                    <i class="bi bi-exclamation-triangle me-2"></i> {{ errorMessage }}
                </div>
            </form>
        </div>
    </div>
</div>


  `,
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      isLoading: false
    };
  },
  methods: {
    handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';
      
      $.ajax({
        url: '/api/auth/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          username: this.username,
          password: this.password
        }),
        success: (data) => {
          localStorage.setItem('jwt', data.jwt);
          localStorage.setItem('username', data.username);
          localStorage.setItem('role', data.roles.join(', '));
          localStorage.setItem('currentRole', data.roles[0]);
          localStorage.setItem('links', JSON.stringify(data._links));
          
          this.$root.changeView('data_import');
          window.location.reload();
        },
        error: (jqXHR) => {
          try {
            const errorData = jqXHR.responseJSON || {};
            this.errorMessage = errorData.error || 'Login failed';
          } catch (e) {
            this.errorMessage = 'An unexpected error occurred';
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }}