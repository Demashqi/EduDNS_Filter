export default {
  template: `
    <div class="container py-4">
      <h2 class="fw-bold text-primary mb-1">Manage Blocked Domains</h2>
      <!-- Blocked Domain Management Table -->
      <div class="card shadow-sm border-0">
        <div class="card-body p-4">
          <table id="blockedDomainsTable" class="table table-striped table-bordered w-100">
            <thead>
              <tr>
                <th>ID</th>
                <th>Domain</th>
                <th>Actions</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      <!-- Add/Edit Blocked Domain Modal -->
      <div class="modal fade" id="blockedDomainModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalTitle">Add New Blocked Domain</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form id="blockedDomainForm">
                <input type="hidden" id="blockedDomainId">
                <div class="mb-3">
                  <label for="domain" class="form-label">Domain</label>
                  <input type="text" class="form-control" id="domain" required>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" id="saveBlockedDomain">Save</button>
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
              Are you sure you want to delete this domain?
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
      domainToDelete: null,
      editMode: false
    };
  },

  mounted() {
    this.initDataTable();
    this.initializeEventListeners();
  },

  methods: {
    initDataTable() {
      this.dataTable = $('#blockedDomainsTable').DataTable({
        responsive: true,
        ajax: {
          url: '/api/admin/blocklist',
          dataSrc: '',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
        },
        columns: [
          { data: 'id' },
          { data: 'domain' },
          {
            data: null,
            orderable: false,
            className: 'text-center',
            render: (data, type, row) => `
              <button class="btn btn-primary btn-sm edit-domain me-2" data-id="${row.id}">
                <i class="bi bi-pencil"></i> Edit
              </button>
              <button class="btn btn-danger btn-sm delete-domain" data-id="${row.id}">
                <i class="bi bi-trash"></i> Delete
              </button>
            `
          }
        ],
        dom: 'Blfrtip',
        buttons: [
          {
            text: '<i class="bi bi-plus-circle"></i> Add New Blocked Domain',
            className: 'btn btn-success mx-3',
            action: () => this.showBlockedDomainModal()
          }
        ]
      });
    },

    initializeEventListeners() {
      // Blocked Domain modal events
      const blockedDomainModal = new bootstrap.Modal(document.getElementById('blockedDomainModal'));
      const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
      const toast = new bootstrap.Toast(document.getElementById('alertToast'));

      // Edit domain button click
      $('#blockedDomainsTable').on('click', '.edit-domain', (e) => {
        const id = $(e.currentTarget).data('id');
        const domainData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
        this.showBlockedDomainModal(domainData);
      });

      // Delete domain button click
      $('#blockedDomainsTable').on('click', '.delete-domain', (e) => {
        this.domainToDelete = $(e.currentTarget).data('id');
        deleteModal.show();
      });

      // Save domain
      $('#saveBlockedDomain').on('click', () => this.saveBlockedDomain());

      // Confirm delete
      $('#confirmDelete').on('click', () => this.deleteBlockedDomain());

      // Reset form on modal close
      $('#blockedDomainModal').on('hidden.bs.modal', () => {
        document.getElementById('blockedDomainForm').reset();
        this.editMode = false;
      });
    },

    showBlockedDomainModal(domainData = null) {
      this.editMode = !!domainData;
      const modalTitle = document.getElementById('modalTitle');
      
      if (domainData) {
        modalTitle.textContent = 'Edit Blocked Domain';
        document.getElementById('blockedDomainId').value = domainData.id;
        document.getElementById('domain').value = domainData.domain;
      } else {
        modalTitle.textContent = 'Add New Blocked Domain';
        document.getElementById('blockedDomainId').value = '';
      }
      
      new bootstrap.Modal(document.getElementById('blockedDomainModal')).show();
    },

    async saveBlockedDomain() {
      const form = document.getElementById('blockedDomainForm');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const domainId = document.getElementById('blockedDomainId').value;
      const domainData = {
        domain: document.getElementById('domain').value
      };

      try {
        const response = await fetch(
          this.editMode ? `/api/admin/blocklist/${domainId}` : '/api/admin/blocklist',
          {
            method: this.editMode ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            },
            body: JSON.stringify(domainData)
          }
        );

        if (response.ok) {
          this.showToast('Success', `Blocked Domain ${this.editMode ? 'updated' : 'created'} successfully!`, 'success');
          this.dataTable.ajax.reload();
          bootstrap.Modal.getInstance(document.getElementById('blockedDomainModal')).hide();
        } else {
          const error = await response.json();
          this.showToast('Error', error.message || 'Operation failed', 'error');
        }
      } catch (error) {
        this.showToast('Error', error.message, 'error');
      }
    },

    async deleteBlockedDomain() {
      try {
        const response = await fetch(`/api/admin/blocklist/${this.domainToDelete}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
        });

        if (response.ok) {
          this.showToast('Success', 'Blocked Domain deleted successfully!', 'success');
          this.dataTable.ajax.reload();
        } else {
          this.showToast('Error', 'Failed to delete domain', 'error');
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
