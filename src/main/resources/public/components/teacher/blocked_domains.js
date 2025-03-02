export default {
  template: `
   <div class="container py-5">
    <div class="d-flex align-items-center justify-content-between mb-4">
        <h2 class="fw-bold text-primary mb-0">Manage Blocked Domains</h2>
        <button class="btn btn-primary btn-sm shadow-sm" data-bs-toggle="modal" data-bs-target="#blockedDomainModal">
            <i class="bi bi-plus-lg me-2"></i> Add Domain
        </button>
    </div>

    <!-- Data Table -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="card-body p-0">
            <table id="blockedDomainsTable" class="table table-hover align-middle mb-0" 
                   style="min-width: 600px;">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Domain</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                    <tbody>
                    <!-- Data populated via DataTables -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" id="blockedDomainModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 shadow">
                <div class="modal-header border-bottom-0 pb-0">
                    <h5 class="modal-title fw-bold" id="modalTitle">Add New Blocked Domain</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body pt-0">
                    <form id="blockedDomainForm" class="needs-validation" novalidate>
                        <input type="hidden" id="blockedDomainId">
                        <div class="mb-3">
                            <label for="domain" class="form-label fw-semibold">Domain Name</label>
                            <div class="input-group">
                                <span class="input-group-text border-end-0 bg-transparent">
                                    <i class="bi bi-globe"></i>
                                </span>
                                <input type="text" class="form-control border-start-0" 
                                       id="domain" required placeholder="example.com">
                            </div>
                            <div class="invalid-feedback">Please enter a valid domain</div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-top-0 pt-0">
                    <button type="button" class="btn btn-link text-secondary" 
                            data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary rounded-pill px-4" 
                            id="saveBlockedDomain">
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
                    <p class="mb-4">Are you sure you want to permanently delete this domain?</p>
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
                    <div class="text-muted small" id="toastMessage">Domain added successfully</div>
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
        domainToDelete: null,
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
        // Use the GET blocked domains endpoint from the stored links
        this.dataTable = $('#blockedDomainsTable').DataTable({
          responsive: true,
          ajax: {
            url: this.apiLinks.getBlockedDomains.href,
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
                <button class="btn btn-sm btn-outline-primary edit-domain" data-id="${row.id}">
                  <i class="bi bi-pencil"></i>
                </button>
              `
            },
            {
              data: null,
              orderable: false,
              className: 'text-center',
              render: (data, type, row) => `
                <button class="btn btn-sm btn-outline-danger delete-domain" data-id="${row.id}">
                  <i class="bi bi-trash"></i>
                </button>
              `
            }
          ],
          dom: 'Blfrtip'
        });
      },
  
      initializeEventListeners() {
        // Modal instances for blocked domain and delete confirmation
        const blockedDomainModal = new bootstrap.Modal(document.getElementById('blockedDomainModal'));
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  
        // Edit domain button click
        $('#blockedDomainsTable').on('click', '.edit-domain', (e) => {
          const id = $(e.currentTarget).data('id');
          const domainData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
          this.showBlockedDomainModal(domainData);
        });
  
        // Delete domain button click
        // Instead of using the id, we use the domain value (as expected by the delete endpoint)
        $('#blockedDomainsTable').on('click', '.delete-domain', (e) => {
          const rowData = this.dataTable.row($(e.currentTarget).closest('tr')).data();
          this.domainToDelete = rowData.domain;
          deleteModal.show();
        });
  
        // Save domain button
        $('#saveBlockedDomain').on('click', () => this.saveBlockedDomain());
  
        // Confirm delete button
        $('#confirmDelete').on('click', () => this.deleteBlockedDomain());
  
        // Reset form when modal closes
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
  
      saveBlockedDomain() {
        const form = $('#blockedDomainForm')[0];
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
      
        const domainId = $('#blockedDomainId').val();
        const domainData = { domain: $('#domain').val() };
        const endpoint = this.editMode 
          ? `${this.apiLinks.addBlockedDomain.href}/${domainId}`
          : this.apiLinks.addBlockedDomain.href;
        const method = this.editMode ? 'PUT' : 'POST';
      
        $.ajax({
          url: endpoint,
          method: method,
          contentType: 'application/json',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
          data: JSON.stringify(domainData),
          success: () => {
            this.showToast(
              'Success', 
              `Blocked Domain ${this.editMode ? 'updated' : 'created'} successfully!`, 
              'success'
            );
            this.dataTable.ajax.reload();
            $('#blockedDomainModal').modal('hide');
          },
          error: (jqXHR) => {
            // Handle 409 Conflict specifically
            if (jqXHR.status === 409) {
              this.showToast(
                'Conflict', 
                jqXHR.responseJSON?.message || 'Domain already exists in the blocklist', 
                'warning'
              );
            } else {
              // Handle other errors
              const error = jqXHR.responseJSON || {};
              this.showToast(
                'Error', 
                error.message || 'Operation failed', 
                'error'
              );
            }
          }
        });
      },
  
      deleteBlockedDomain() {
        const deleteUrl = this.apiLinks.deleteBlockedDomainByName.href
          .replace('{domain}', this.domainToDelete);
  
        $.ajax({
          url: deleteUrl,
          method: this.apiLinks.deleteBlockedDomainByName.method,
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
          success: () => {
            this.showToast('Success', 'Blocked Domain deleted successfully!', 'success');
            this.dataTable.ajax.reload();
            $('#deleteModal').modal('hide');
          },
          error: () => {
            this.showToast('Error', 'Failed to delete domain', 'error');
          }
        });
      },
  
      showToast(title, message, type) {
        const toast = $('#alertToast');
        $('#toastTitle').text(title);
        $('#toastMessage').text(message);
        toast.removeClass().addClass(`toast ${type === 'error' ? 'bg-danger text-white' : 'bg-success text-white'}`);
        new bootstrap.Toast(toast[0]).show();
      }
    }  
};
