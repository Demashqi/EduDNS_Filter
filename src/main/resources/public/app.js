const app = Vue.createApp({
  data() {
    // Retrieve stored JWT and roles from localStorage.
    const jwt = localStorage.getItem('jwt');
    let role = localStorage.getItem('role') || ''; // Available roles (possibly comma-separated)
    let currentRole = localStorage.getItem('currentRole') || ''; // The selected role

    // If there are multiple roles and no currentRole has been set,
    // default to the first role.
    if (role.includes(',') && !currentRole) {
      currentRole = role.split(',')[0].trim();
      localStorage.setItem('currentRole', currentRole);
    }

    let defaultView = 'login'; // Default view

    if (jwt) {
      // Set the default view based on the selected role.
      if (currentRole === 'ADMIN') {
        defaultView = 'dashboard';
      } else if (currentRole === 'TEACHER') {
        defaultView = 'blocked_domains';
      }
    }

    return {
      currentView: defaultView,
      role,        // All available roles
      currentRole  // The currently selected role
    };
  },

  methods: {
      changeView(newView) {
      this.currentView = newView;
    },

    // When the user changes roles (from the navbar), update the global state,
    // store the new role in localStorage, update the view, and load the new restricted components.
    changeRole(newRole) {
      authState.currentRole = newRole; // Update global reactive authState
      localStorage.setItem('currentRole', newRole);
      this.updateViewBasedOnRole(newRole);
      // Load the role-specific components for the new role,
      // then force the view to update.
      loadRestrictedComponents().then(() => {
        this.$forceUpdate();
      });
    },

    updateViewBasedOnRole(role) {
      if (role === 'ADMIN') {
        this.currentView = 'dashboard';
      } else if (role === 'TEACHER') {
        this.currentView = 'blocked_domains';
      }
    }
  }
});

// Create a global reactive auth state so that child components can inject it.
const authState = Vue.reactive({
  isLoggedIn: !!localStorage.getItem('jwt'),
  username: localStorage.getItem('username') || '',
  role: localStorage.getItem('role') || '',
  currentRole: localStorage.getItem('currentRole') || ''
});
app.provide('authState', authState);

// ------------------------------
// Component loading configuration
// ------------------------------

// Unrestricted components that are always loaded.
const unrestrictedComponents = [
  "navbar.js",
  "login.js"
];

// Role-based (restricted) components.
const restrictedComponentFiles = {
  ADMIN: [
    "admin/domain_logs.js",
    "admin/register.js",
    "admin/dashboard.js",
    "aside_menu.js" // Now allowed for ADMIN
  ],
  TEACHER: [
    "teacher/blocked_domains.js",
    "aside_menu.js"  ]
};

/**
 * loadComponent:
 *  - Fetches a JS file from the server.
 *  - If withAuth is true, sends the JWT as an Authorization header.
 *  - Creates a Blob URL from the script text and dynamically imports it as an ES module.
 *  - Registers the component with Vue using the filename (without folder or .js extension) as the component name.
 */
async function loadComponent(file, withAuth = false) {
  try {
    const headers = {};
    if (withAuth) {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        console.warn(`Skipping ${file} - JWT not available.`);
        return; // Skip if no JWT is available.
      }
      headers['Authorization'] = `Bearer ${jwt}`;
    }
    const response = await fetch(`./components/${file}`, { headers });
    if (!response.ok) {
      this.logout();
      throw new Error(`Failed to fetch ${file}: ${response.statusText}`);
    }
    const scriptText = await response.text();
    
    // Create a Blob from the script text and generate a Blob URL.
    const blob = new Blob([scriptText], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    // Dynamically import the module from the Blob URL.
    const module = await import(blobUrl);

    // Clean up the Blob URL.
    URL.revokeObjectURL(blobUrl);

    // Extract the component name from the file path.
    const componentName = file.split('/').pop().replace(".js", "");
    app.component(componentName, module.default || module);
  } catch (error) {
    console.error(`Error loading component: ${file}`, error);
  }
}

/**
 * loadComponents:
 * 1. Loads all unrestricted components (no JWT required).
 * 2. If a JWT exists, loads the role-based (restricted) components for the current role.
 * 3. Mounts the Vue app.
 */
async function loadComponents() {
  // Step 1: Load unrestricted components.
  for (const file of unrestrictedComponents) {
    await loadComponent(file, false);
  }

  // Step 2: Load restricted components if a JWT exists.
  const jwt = localStorage.getItem('jwt');
  const currentRole = localStorage.getItem('currentRole');
  if (jwt && currentRole && restrictedComponentFiles[currentRole]) {
    for (const file of restrictedComponentFiles[currentRole]) {
      await loadComponent(file, true);
    }
  } else {
    console.warn("No JWT found; skipping restricted components.");
  }

  // Mount the Vue app after components are loaded.
  app.mount("#app");
}

/**
 * loadRestrictedComponents:
 * Loads role-based components for the current role.
 * This function can be called when the user changes roles.
 */
async function loadRestrictedComponents() {
  const currentRole = localStorage.getItem('currentRole');
  if (!currentRole || !restrictedComponentFiles[currentRole]) return;
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    console.warn("No JWT found; cannot load restricted components.");
    return;
  }
  for (const file of restrictedComponentFiles[currentRole]) {
    await loadComponent(file, true);
  }
}

async function logout() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("currentRole");
  this.authState.isLoggedIn = false;
  this.authState.username = "";
  this.authState.role = "";
  this.authState.currentRole = "";
  this.changeView('login');
}

// Initial component load.
loadComponents();
