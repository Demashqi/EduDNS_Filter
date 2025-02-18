export default {
  template: `
    <div class="container py-4">
      <h2 class="fw-bold text-primary mb-1">Manage Users</h2>
      <!-- User Management Table -->
      <div class="card shadow-sm border-0">
        <div class="card-body p-4">
          <table id="usersTable" class="table table-striped table-bordered w-100">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      <!-- Add/Edit User Modal -->
      <div class="modal fade" id="userModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalTitle">Add New User</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="userForm">
                <input type="hidden" id="userId">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" class="form-control" id="username" required>
                </div>
                <div class="mb-3" id="passwordGroup">
                  <label for="password" class="form-label">Password</label>
                    <input 
                    type="password" 
                    class="form-control" 
                    id="password"
                  >
                  <div class="form-text">Password must be at least 6 characters long and contain at least one number</div>
                </div>
                <div class="mb-3">
                  <label for="role" class="form-label">Role</label>
                  <select class="form-select" id="role" required>
                    <option value="">Select Role</option>
                    <option value="ADMIN">Admin</option>
                    <option value="TEACHER">Teacher</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="saveUser">Save</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Deletion</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete this user?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-danger" id="confirmDelete">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Alert Toast -->
      <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div id="alertToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <strong class="me-auto" id="toastTitle">Notification</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body" id="toastMessage"></div>
        </div>
      </div>
    </div>
  `,

  data() {
    return {
      dataTable: null,
      userToDelete: null,
      editMode: false
    };
  },

  mounted() {
    this.initDataTable();
    this.initializeEventListeners();
  },

  methods: {
    initDataTable() {
      this.dataTable = $('#usersTable').DataTable({
        ajax: {
          url: '/api/admin/users',
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
        dom: 'Blfrtip',
        buttons: [
          {
            text: '<i class="bi bi-plus-circle"></i> Add New User',
            className: 'btn btn-success mb-3',
            action: () => this.showUserModal()
          }
        ],
        buttons: [
          {
            text: '<i class="bi bi-plus-circle me-1"></i> Add User',
            className: 'btn btn-success mx-3',
            action: () => this.showUserModal()
          }
        ]
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

      // Save user
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

    async saveUser() {
      const form = document.getElementById('userForm');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const userId = document.getElementById('userId').value;
      const userData = {
        username: document.getElementById('username').value,
        roles: [document.getElementById('role').value], 
        password: document.getElementById('password').value !== '' ? document.getElementById('password').value : null

      };

      if (!this.editMode) {
        userData.password = document.getElementById('password').value;
      }

      try {
        const response = await fetch(
          this.editMode ? `/api/admin/users/${userId}` : '/api/admin/register',
          {
            method: this.editMode ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify(userData)
          }
        );

        if (response.ok) {
          this.showToast('Success', `User ${this.editMode ? 'updated' : 'created'} successfully!`, 'success');
          this.dataTable.ajax.reload();
          bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        } else if (response.status === 409) {
          this.showToast('Error', 'Username already taken', 'error');
        }
        else if(response.status === 403) {
          this.showToast('Error', 'Admins cannot remove their own admin role.', 'error');

        } 
        
        else {
          const error = await response.json();
          this.showToast('Error', error.message || 'Operation failed', 'error');
        }
      } catch (error) {
        this.showToast('Error', error.message, 'error');
      }
    },

    async deleteUser() {
      try {
        const response = await fetch(`/api/admin/users/${this.userToDelete}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
        });

        if (response.ok) {
          this.showToast('Success', 'User deleted successfully!', 'success');
          this.dataTable.ajax.reload();
        } else if(response.status === 403) {
          this.showToast('Error', 'Admins cannot delete themselves.', 'error');

        } else {
          this.showToast('Error', 'Failed to delete user', 'error');
        }
      } catch (error) {
        this.showToast('Error', error.message, 'error');
      } finally {
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
      }
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