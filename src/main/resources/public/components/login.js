
export default {
  template: `
<div class="container d-flex justify-content-center align-items-center" style="height: 75vh;">
    <div class="card shadow-lg p-4" style="max-width: 450px; width: 100%; border-radius: 12px;">
        <div class="text-center mb-4">
            <img src="assets/images/neural.png" alt="Ericsson" class="img-fluid" style="max-height: 80px;">
        </div>
        <h2 class="text-center text-primary mb-4">Login</h2>
        
        <form @submit.prevent="handleLogin">
            <div class="form-group">
                <label for="username" class="font-weight-semibold">Username</label>
                <input type="text" id="username" class="form-control" v-model="username" required placeholder="Enter your username">
            </div>

            <div class="form-group mt-3">
                <label for="password" class="font-weight-semibold">Password</label>
                <input type="password" id="password" class="form-control" v-model="password" required placeholder="Enter your password">
            </div>

            <button type="submit" class="btn btn-primary btn-block mt-4 py-2" :disabled="isLoading">
                {{ isLoading ? "Logging in..." : "Login" }}
            </button>

            <div v-if="errorMessage" class="alert alert-danger mt-3">
                <strong>Error:</strong> {{ errorMessage }}
            </div>
        </form>
    </div>
</div>


  `,
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
		this.isLoading = true;
		this.errorMessage = '';
		
      try {
        // Use the provided fetch call to authenticate.
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.username, password: this.password })
        });
		
		if (!response.ok) throw new Error('Invalid username or password');

        if (!response.ok) {
          // Attempt to parse error details from the response.
          const errorData = await response.json().catch(() => ({}));
          this.errorMessage = errorData.error || 'Login failed';
          return;
        }

        const data = await response.json();
        // Expecting the response to contain: data.jwt, data.username, and data.roles (an array).
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.roles.join(', '));
        localStorage.setItem('currentRole',data.roles[0]);


        // Change the view to data_import (or another appropriate view).
        this.$root.changeView('data_import');
        // Reload the page so that global state picks up the new authentication data.
        window.location.reload();
      } catch (error) {
        this.errorMessage = 'Error: ' + error.message;
      } finally {
	    this.isLoading = false;
    }
  }
  }
};
