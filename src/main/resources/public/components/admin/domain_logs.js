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
              <th>Block/Unblock</th>
              <th>Delete</th>
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
      logToDelete: null,
      domainBlockStatus: {} // Store domain block status
    };
  },

  mounted() {
    this.fetchBlockedDomains();
    this.initDataTable();
    this.initializeEventListeners();
  },

  methods: {
    // Method to refresh the data table
    refreshTable() {
      this.fetchBlockedDomains().then(() => {
        this.dataTable.ajax.reload(); // Reload the data in the table
        this.showToast('Success', 'Table refreshed successfully!', 'success');
      });
    },

    // Fetch the current list of blocked domains
    async fetchBlockedDomains() {
      try {
        const response = await fetch('/api/admin/blocklist', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
        });
        
        if (response.ok) {
          const blockedDomains = await response.json();
          
          // Reset the domain status map
          this.domainBlockStatus = {};
          
          // Update the domain status map
          blockedDomains.forEach(item => {
            this.domainBlockStatus[item.domain] = true;
          });
          
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error fetching blocked domains:", error);
        return false;
      }
    },

    initDataTable() {
      this.dataTable = $('#domainLogsTable').DataTable({
        responsive: true,
        ajax: {
          url: '/api/admin/domain-logs',
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
            // Block/Unblock toggle column
            data: null,
            orderable: false,
            className: 'text-center',
            render: (data, type, row) => {
              const domain = row.domain;
              const isBlocked = this.domainBlockStatus[domain] || false;
              
              return `
                <div class="form-check form-switch d-flex justify-content-center">
                  <input class="form-check-input block-toggle" type="checkbox" 
                    id="blockToggle_${row.id}" 
                    data-domain="${domain}" 
                    ${isBlocked ? 'checked' : ''}>
                  <label class="form-check-label ms-2" for="blockToggle_${row.id}">
                    ${isBlocked ? 'Blocked' : 'Unblocked'}
                  </label>
                </div>
              `;
            }
          },
          {
            // Delete column
            data: null,
            orderable: false,
            className: 'text-center',
            render: (data, type, row) => `
              <button class="btn btn-danger btn-sm delete-log" data-id="${row.id}">
                <i class="bi bi-trash"></i> Delete
              </button>
            `
          }
        ],
        drawCallback: () => {
          // Update toggle states after table redraw
          $('.block-toggle').each((i, toggle) => {
            const domain = $(toggle).data('domain');
            const isBlocked = this.domainBlockStatus[domain] || false;
            $(toggle).prop('checked', isBlocked);
            $(toggle).next('label').text(isBlocked ? 'Blocked' : 'Unblocked');
          });
        }
      });
    },

    initializeEventListeners() {
      const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

      // Delete log button click
      $('#domainLogsTable').on('click', '.delete-log', (e) => {
        this.logToDelete = $(e.currentTarget).data('id');
        deleteModal.show();
      });

      // Toggle block/unblock switch
      $('#domainLogsTable').on('change', '.block-toggle', (e) => {
        const domain = $(e.currentTarget).data('domain');
        const isBlocked = $(e.currentTarget).prop('checked');
        
        if (isBlocked) {
          this.blockDomain(domain, e.currentTarget);
        } else {
          this.unblockDomain(domain, e.currentTarget);
        }
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

    async blockDomain(domain, toggleElement) {
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
          this.domainBlockStatus[domain] = true;
          $(toggleElement).next('label').text('Blocked');
          this.showToast('Success', `${domain} has been blocked!`, 'success');
        } else if(response.status === 400) {
          this.showToast('Info', 'Domain is already blocked', 'success');
          this.domainBlockStatus[domain] = true;
          $(toggleElement).prop('checked', true);
          $(toggleElement).next('label').text('Blocked');
        } else {
          this.showToast('Error', 'Failed to block the domain', 'error');
          this.domainBlockStatus[domain] = false;
          $(toggleElement).prop('checked', false);
          $(toggleElement).next('label').text('Unblocked');
        }
      } catch (error) {
        this.showToast('Error', error.message, 'error');
        this.domainBlockStatus[domain] = false;
        $(toggleElement).prop('checked', false);
        $(toggleElement).next('label').text('Unblocked');
      }
    },

    async unblockDomain(domain, toggleElement) {
      try {
        const response = await fetch(`/api/admin/blocklist/name/${domain}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });

        if (response.ok) {
          this.domainBlockStatus[domain] = false;
          $(toggleElement).next('label').text('Unblocked');
          this.showToast('Success', `${domain} has been unblocked!`, 'success');
        } else if(response.status === 404){
          this.showToast('Info', 'Domain is not blocked', 'success');
          this.domainBlockStatus[domain] = false;
          $(toggleElement).prop('checked', false);
          $(toggleElement).next('label').text('Unblocked');
        } else {
          this.showToast('Error', 'Failed to unblock the domain', 'error');
          this.domainBlockStatus[domain] = true;
          $(toggleElement).prop('checked', true);
          $(toggleElement).next('label').text('Blocked');
        }
      } catch (error) {
        this.showToast('Error', error.message, 'error');
        this.domainBlockStatus[domain] = true;
        $(toggleElement).prop('checked', true);
        $(toggleElement).next('label').text('Blocked');
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