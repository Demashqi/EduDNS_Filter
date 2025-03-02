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
        domainBlockStatus: {},
        apiLinks: {}
      };
    },
  
    mounted() {
      const storedLinks = localStorage.getItem('links');
      if (storedLinks) {
        this.apiLinks = JSON.parse(storedLinks);
      }
      this.fetchBlockedDomains();
      this.initDataTable();
      this.initializeEventListeners();
    },
  
    methods: {
      refreshTable() {
        this.fetchBlockedDomains().then(() => {
          this.dataTable.ajax.reload();
          this.showToast('Success', 'Table refreshed successfully!', 'success');
        });
      },
  
      fetchBlockedDomains() {
        return $.ajax({
          url: this.apiLinks.getBlockedDomains.href,
          method: 'GET',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
          success: (blockedDomains) => {
            this.domainBlockStatus = {};
            blockedDomains.forEach(item => {
              this.domainBlockStatus[item.domain] = true;
            });
          },
          error: () => {
            this.showToast('Error', 'Failed to fetch blocked domains', 'error');
          }
        });
      },
  
      initDataTable() {
        this.dataTable = $('#domainLogsTable').DataTable({
          responsive: true,
          ajax: {
            url: this.apiLinks.getDomainLogs.href,
            dataSrc: '',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
          },
          columns: [
            { data: 'id' },
            { data: 'domain' },
            {
              data: 'blocked',
              render: data => data 
                ? '<i class="bi bi-shield-fill-check text-success"></i> Blocked'
                : '<i class="bi bi-shield-slash text-danger"></i> Unblocked'
            },
            { data: 'timestamp' },
            {
              data: null,
              orderable: false,
              className: 'text-center',
              render: (data) => {
                const domain = data.domain;
                const isBlocked = this.domainBlockStatus[domain] || false;
                return `
                  <div class="form-check form-switch">
                    <input class="form-check-input block-toggle" 
                           type="checkbox" 
                           data-domain="${domain}"
                           ${isBlocked ? 'checked' : ''}>
                    <label class="form-check-label">${isBlocked ? 'Blocked' : 'Unblocked'}</label>
                  </div>
                `;
              }
            },
            {
              data: null,
              orderable: false,
              className: 'text-center',
              render: data => `
                <button class="btn btn-sm btn-danger delete-log" data-id="${data.id}">
                  <i class="bi bi-trash"></i> Delete
                </button>
              `
            }
          ],
          drawCallback: () => {
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
        const deleteModal = new bootstrap.Modal($('#deleteModal')[0]);
  
        $('#domainLogsTable').on('click', '.delete-log', (e) => {
          this.logToDelete = $(e.currentTarget).data('id');
          deleteModal.show();
        });
  
        $('#domainLogsTable').on('change', '.block-toggle', (e) => {
          const domain = $(e.currentTarget).data('domain');
          const isBlocked = $(e.currentTarget).prop('checked');
          isBlocked 
            ? this.blockDomain(domain, e.currentTarget)
            : this.unblockDomain(domain, e.currentTarget);
        });
  
        $('#confirmDelete').on('click', () => this.deleteDomainLog());
      },
  
      deleteDomainLog() {
        const deleteUrl = this.apiLinks.deleteDomainLogById.href
          .replace("{id}", this.logToDelete);
  
        $.ajax({
          url: deleteUrl,
          method: this.apiLinks.deleteDomainLogById.method,
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
          success: () => {
            this.showToast('Success', 'Domain log deleted successfully!', 'success');
            this.dataTable.ajax.reload();
            $('#deleteModal').modal('hide');
          },
          error: () => {
            this.showToast('Error', 'Failed to delete domain log', 'error');
          }
        });
      },
  
      deleteAllLogs() {
        $.ajax({
          url: this.apiLinks.deleteDomainLogs.href,
          method: this.apiLinks.deleteDomainLogs.method,
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
          success: () => {
            this.showToast('Success', 'All domain logs deleted successfully!', 'success');
            this.dataTable.ajax.reload();
          },
          error: () => {
            this.showToast('Error', 'Failed to delete all domain logs', 'error');
          }
        });
      },
  
      blockDomain(domain, toggleElement) {
        $.ajax({
          url: this.apiLinks.addBlockedDomain.href,
          method: this.apiLinks.addBlockedDomain.method,
          contentType: 'application/json',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
          data: JSON.stringify({ domain }),
          statusCode: {
            200: () => {
              this.domainBlockStatus[domain] = true;
              $(toggleElement).next('label').text('Blocked');
              this.showToast('Success', `${domain} has been blocked!`, 'success');
            },
            409: () => {
              this.showToast('Info', 'Domain is already blocked', 'success');
              this.domainBlockStatus[domain] = true;
              $(toggleElement).prop('checked', true);
              $(toggleElement).next('label').text('Blocked');
            }
          },
          error: () => {
            this.showToast('Error', 'Failed to block domain', 'error');
            this.domainBlockStatus[domain] = false;
            $(toggleElement).prop('checked', false);
            $(toggleElement).next('label').text('Unblocked');
          }
        });
      },
  
      unblockDomain(domain, toggleElement) {
        const deleteUrl = this.apiLinks.deleteBlockedDomainByName.href
          .replace("{domain}", domain);
  
        $.ajax({
          url: deleteUrl,
          method: this.apiLinks.deleteBlockedDomainByName.method,
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
          statusCode: {
            200: () => {
              this.domainBlockStatus[domain] = false;
              $(toggleElement).next('label').text('Unblocked');
              this.showToast('Success', `${domain} has been unblocked!`, 'success');
            },
            404: () => {
              this.showToast('Info', 'Domain is not blocked', 'success');
              this.domainBlockStatus[domain] = false;
              $(toggleElement).prop('checked', false);
              $(toggleElement).next('label').text('Unblocked');
            }
          },
          error: () => {
            this.showToast('Error', 'Failed to unblock domain', 'error');
            this.domainBlockStatus[domain] = true;
            $(toggleElement).prop('checked', true);
            $(toggleElement).next('label').text('Blocked');
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