export default {
  template: `
   <div class="container py-5">
    <div class="d-flex align-items-center justify-content-between mb-4">
        <h2 class="fw-bold text-primary mb-0">Manage Users</h2>
        <button class="btn btn-primary btn-sm shadow-sm" data-bs-toggle="modal" data-bs-target="#userModal">
            <i class="bi bi-person-plus me-2"></i> Add User
        </button>
    </div>

    <!-- Data Table -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="card-body p-0">
            <table id="usersTable" class="table table-hover align-middle mb-0" 
                   style="min-width: 800px;">
                <thead class="table-light">
                    <tr>
                        <th class="ps-4">ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th style="width: 100px;"></th>
                        <th style="width: 100px;"></th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Data populated via DataTables -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 shadow">
                <div class="modal-header border-bottom-0 pb-0">
                    <h5 class="modal-title fw-bold" id="modalTitle">Add New User</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body pt-0">
                    <form id="userForm" class="needs-validation" novalidate>
                        <input type="hidden" id="userId">
                        
                        <div class="mb-3">
                            <label for="username" class="form-label fw-semibold">Username</label>
                            <div class="input-group">
                                <span class="input-group-text border-end-0 bg-transparent">
                                    <i class="bi bi-person"></i>
                                </span>
                                <input type="text" class="form-control border-start-0" 
                                       id="username" required placeholder="john_doe">
                            </div>
                            <div class="invalid-feedback">Please enter a valid username</div>
                        </div>

                        <div class="mb-3" id="passwordGroup">
                            <label for="password" class="form-label fw-semibold">Password</label>
                            <div class="input-group">
                                <span class="input-group-text border-end-0 bg-transparent">
                                    <i class="bi bi-lock"></i>
                                </span>
                                <input type="password" class="form-control border-start-0" 
                                       id="password" placeholder="••••••••">
                            </div>
                            <div class="form-text text-muted small">
                                Minimum 6 characters with at least one number
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="role" class="form-label fw-semibold">Role</label>
                            <div class="input-group">
                                <span class="input-group-text border-end-0 bg-transparent">
                                    <i class="bi bi-person-badge"></i>
                                </span>
                                <select class="form-select border-start-0" id="role" required>
                                    <option value="">Select Role</option>
                                    <option value="ADMIN">Administrator</option>
                                    <option value="TEACHER">Teacher</option>
                                </select>
                            </div>
                            <div class="invalid-feedback">Please select a valid role</div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-top-0 pt-0">
                    <button type="button" class="btn btn-link text-secondary" 
                            data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary rounded-pill px-4" 
                            id="saveUser">
                        <span class="spinner-border spinner-border-sm me-2 d-none" 
                              role="status" aria-hidden="true"></span>
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 shadow">
                <div class="modal-body text-center p-4">
                    <i class="bi bi-exclamation-triangle display-3 text-danger mb-3"></i>
                    <h5 class="fw-bold mb-3">Confirm Deletion</h5>
                    <p class="mb-4">Are you sure you want to permanently delete this user?</p>
                    <button type="button" class="btn btn-outline-secondary me-3" 
                            data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger rounded-pill px-4" 
                            id="confirmDelete">
                        <span class="spinner-border spinner-border-sm me-2 d-none" 
                              role="status" aria-hidden="true"></span>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification -->
    <div class="position-fixed top-0 end-0 p-3" style="z-index: 1050;">
        <div id="alertToast" class="toast align-items-center" role="alert">
            <div class="toast-body d-flex align-items-center">
                <div class="toast-icon me-3">
                    <i class="bi fs-4" :class="toastType === 'success' ? 'bi-check-circle text-success' : 'bi-exclamation-triangle text-danger'"></i>
                </div>
                <div>
                    <strong class="me-auto" id="toastTitle">Success</strong>
                    <div class="text-muted small" id="toastMessage">User added successfully</div>
                </div>
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    </div>
</div>
  `,

  data() {
    return {
      dataTable: null,
      userToDelete: null,
      editMode: false,
      apiLinks: {} // Will hold the endpoints from localStorage
    };
  },

  mounted() {
    // Load API links from localStorage so that all components can use them
    const storedLinks = localStorage.getItem('links');
    if (storedLinks) {
      this.apiLinks = JSON.parse(storedLinks);
    }
    this.initDataTable();
    this.initializeEventListeners();
  },

  methods: {
    initDataTable() {
      this.dataTable = $('#usersTable').DataTable({
        ajax: {
          // Use the GET all users endpoint from stored links
          url: this.apiLinks.getAllUsers.href,
          dataSrc: '',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
        },
        columns: [
          { data: 'id' },
          { data: 'username' },
          { 
            data: 'roles',
            render: data => data ? data : ''
          },
          {
            data: null,
            orderable: false,
            className: 'text-center',
            render: (data, type, row) => `
              <button class="btn btn-primary btn-sm edit-user me-2" data-id="${row.id}">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-danger btn-sm delete-user" data-id="${row.id}">
                <i class="bi bi-trash"></i> Delete
              </button>
            `
          }
        ],
        dom: 'Blfrtip'
      });
    },

    initializeEventListeners() {
      // User modal events
      const userModal = new bootstrap.Modal(document.getElementById('userModal'));
      const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
      const toast = new bootstrap.Toast(document.getElementById('alertToast'));

      // Edit user button click
      $('#usersTable').on('click', '.edit-user', (e) => {
        const id = $(e.currentTarget).data('id');
        const userData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
        this.showUserModal(userData);
      });

      // Delete user button click
      $('#usersTable').on('click', '.delete-user', (e) => {
        this.userToDelete = $(e.currentTarget).data('id');
        deleteModal.show();
      });

      // Save user button click
      $('#saveUser').on('click', () => this.saveUser());

      // Show password field when adding new user, hide when editing
      $('#userModal').on('show.bs.modal', () => {
        const passwordGroup = document.getElementById('passwordGroup');
        const password = document.getElementById('password');
        const username = document.getElementById('username');
        if (this.editMode) {
          passwordGroup.style.display = 'block';
          password.required = false;
          username.readOnly = true;
          username.required = false;
        } else {
          username.readOnly = false;
          username.required = true;
          passwordGroup.style.display = 'block';
          password.required = true;
        }
      });

      // Confirm delete
      $('#confirmDelete').on('click', () => this.deleteUser());

      // Reset form on modal close
      $('#userModal').on('hidden.bs.modal', () => {
        document.getElementById('userForm').reset();
        this.editMode = false;
      });
    },

    showUserModal(userData = null) {
      this.editMode = !!userData;
      const modalTitle = document.getElementById('modalTitle');
      const passwordGroup = document.getElementById('passwordGroup');
      
      if (userData) {
        modalTitle.textContent = 'Edit User';
        document.getElementById('userId').value = userData.id;
        document.getElementById('username').value = userData.username;
        document.getElementById('role').value = userData.roles[0];
        passwordGroup.style.display = 'none';
      } else {
        modalTitle.textContent = 'Add New User';
        document.getElementById('userId').value = '';
        passwordGroup.style.display = 'block';
      }
      
      new bootstrap.Modal(document.getElementById('userModal')).show();
    },

    saveUser() {
      const form = $('#userForm')[0];
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const userData = {
        username: $('#username').val(),
        roles: [$('#role').val()],
        password: $('#password').val() || undefined
      };

      const endpoint = this.editMode 
        ? this.apiLinks.updateUserById.href.replace('{id}', $('#userId').val())
        : this.apiLinks.registerUser.href;
      const method = this.editMode ? 'PUT' : 'POST';

      $.ajax({
        url: endpoint,
        method: method,
        contentType: 'application/json',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
        data: JSON.stringify(userData),
        success: () => {
          this.showToast('Success', `User ${this.editMode ? 'updated' : 'created'} successfully!`, 'success');
          this.dataTable.ajax.reload();
          $('#userModal').modal('hide');
        },
        error: (jqXHR) => {
          if (jqXHR.status === 409) {
            this.showToast('Error', 'Username already taken', 'error');
          } else if (jqXHR.status === 403) {
            this.showToast('Error', 'Admins cannot remove their own admin role', 'error');
          } else {
            const error = jqXHR.responseJSON || {};
            this.showToast('Error', error.message || 'Operation failed', 'error');
          }
        }
      });
    },

    deleteUser() {
      const endpoint = this.apiLinks.deleteUserById.href.replace('{id}', this.userToDelete);
      
      $.ajax({
        url: endpoint,
        method: this.apiLinks.deleteUserById.method,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
        success: () => {
          this.showToast('Success', 'User deleted successfully!', 'success');
          this.dataTable.ajax.reload();
          $('#deleteModal').modal('hide');
        },
        error: (jqXHR) => {
          if (jqXHR.status === 403) {
            this.showToast('Error', 'Admins cannot delete themselves', 'error');
          } else {
            this.showToast('Error', 'Failed to delete user', 'error');
          }
        }
      });
    },

    showToast(title, message, type) {
      const toast = document.getElementById('alertToast');
      document.getElementById('toastTitle').textContent = title;
      document.getElementById('toastMessage').textContent = message;
      toast.className = `toast ${type === 'error' ? 'bg-danger text-white' : 'bg-success text-white'}`;
      new bootstrap.Toast(toast).show();
    }
  }
};