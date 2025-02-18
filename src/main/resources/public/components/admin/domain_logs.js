export default {
  template: `
  <div class="container py-4">
    <h2 class="fw-bold text-primary mb-1">Domain Logs</h2>

    <!-- Buttons for delete all logs and refresh table -->
    <div class="d-flex justify-content-center mt-3">
      <button class="btn btn-danger me-2" @click="deleteAllLogs">
        <i class="bi bi-trash"></i> Delete All Logs
      </button>
      <button class="btn btn-primary" @click="refreshTable">
        <i class="bi bi-arrow-clockwise"></i> Refresh Table
      </button>
    </div>

    <!-- Domain Logs Management Table -->
    <div class="card shadow-sm border-0">
      <div class="card-body p-4">
        <table id="domainLogsTable" class="table table-striped table-bordered w-100">
          <thead>
            <tr>
              <th>ID</th>
              <th>Domain</th>
              <th>Status</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
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
            Are you sure you want to delete this log?
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
      logToDelete: null
    };
  },

  mounted() {
    this.initDataTable();
    this.initializeEventListeners();
  },

  methods: {
    // Method to refresh the data table
    refreshTable() {
      this.dataTable.ajax.reload(); // Reload the data in the table
      this.showToast('Success', 'Table refreshed successfully!', 'success');
    },

    initDataTable() {
      this.dataTable = $('#domainLogsTable').DataTable({
        responsive: true,
        ajax: {
          url: '/api/admin/domain-logs', // Change this to your logs endpoint
          dataSrc: '',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
        },
        columns: [
          { data: 'id' },
          { data: 'domain' },
          {
            data: 'blocked',
            render: (data) => {
              return data
                ? '<i class="bi bi-x-circle text-danger"> Blocked</i>' // Blocked icon
                : '<i class="bi bi-check-circle text-success"> Unblocked</i>'; // Not blocked icon
            }
          },
          { data: 'timestamp' },
          {
            data: null,
            orderable: false,
            className: 'text-center',
            render: (data, type, row) => `
              <button class="btn btn-danger btn-sm delete-log" data-id="${row.id}">
                <i class="bi bi-trash"></i> Delete
              </button>
              <button class="btn btn-warning btn-sm block-domain" data-domain="${row.domain}">
                <i class="bi bi-lock"></i> Block
              </button>
              <button class="btn btn-success btn-sm unblock-domain" data-domain="${row.domain}">
                <i class="bi bi-unlock"></i> Unblock
              </button>
            `
          }
        ]
      });
    },

    initializeEventListeners() {
      const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

      // Delete log button click
      $('#domainLogsTable').on('click', '.delete-log', (e) => {
        this.logToDelete = $(e.currentTarget).data('id');
        deleteModal.show();
      });

      // Block domain button click
      $('#domainLogsTable').on('click', '.block-domain', (e) => {
        const domain = $(e.currentTarget).data('domain');
        this.blockDomain(domain);
      });

      // Unblock domain button click
      $('#domainLogsTable').on('click', '.unblock-domain', (e) => {
        const domain = $(e.currentTarget).data('domain');
        this.unblockDomain(domain);
      });

      // Confirm delete
      $('#confirmDelete').on('click', () => this.deleteDomainLog());
    },

    async deleteDomainLog() {
      try {
        const response = await fetch(`/api/admin/domain-logs/${this.logToDelete}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
        });

        if (response.ok) {
          this.showToast('Success', 'Domain log deleted successfully!', 'success');
          this.dataTable.ajax.reload();
        } else {
          this.showToast('Error', 'Failed to delete domain log', 'error');
        }
      } catch (error) {
        this.showToast('Error', error.message, 'error');
      } finally {
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
      }
    },

    async deleteAllLogs() {
      try {
        const response = await fetch(`/api/admin/domain-logs`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
        });

        if (response.ok) {
          this.showToast('Success', 'All domain logs deleted successfully!', 'success');
          this.dataTable.ajax.reload();
        } else {
          this.showToast('Error', 'Failed to delete all domain logs', 'error');
        }
      } catch (error) {
        this.showToast('Error', error.message, 'error');
      }
    },

    async blockDomain(domain) {
      try {
        const response = await fetch('/api/admin/blocklist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          },
          body: JSON.stringify({ domain })
        });

        if (response.ok) {
          this.showToast('Success', `${domain} has been added to the blocklist!`, 'success');
        } else if(response.status === 400) {
          this.showToast('Error', 'Domain is already blocked', 'error');
        } else {
          this.showToast('Error', 'Failed to block the domain', 'error');
        }
      } catch (error) {
        this.showToast('Error', error.message, 'error');
      }
    },

    async unblockDomain(domain) {
      try {
        const response = await fetch(`/api/admin/blocklist/name/${domain}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });

        if (response.ok) {
          this.showToast('Success', `${domain} has been removed from the blocklist!`, 'success');
          this.dataTable.ajax.reload(); // Reload the table to reflect changes
        } else if(response.status === 404){
          this.showToast('Error', 'Domain is not blocked', 'error');
        } else {
          this.showToast('Error', 'Failed to unblock the domain', 'error');
        }
      } catch (error) {
        this.showToast('Error', error.message, 'error');
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
