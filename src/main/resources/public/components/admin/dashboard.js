export default {
    template: `
    <div class="container-fluid py-4">
      <h2 class="fw-bold text-primary mb-4">DNS Server Dashboard</h2>
      
      <!-- Summary Cards Row -->
      <div class="row g-4 mb-4">
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body">
              <h6 class="text-muted mb-2">Total Requests (24h)</h6>
              <h3 class="mb-0" id="totalRequests">-</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body">
              <h6 class="text-muted mb-2">Blocked Requests (24h)</h6>
              <h3 class="mb-0" id="blockedRequests">-</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body">
              <h6 class="text-muted mb-2">Unique Domains (24h)</h6>
              <h3 class="mb-0" id="uniqueDomains">-</h3>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-xl-3">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body">
              <h6 class="text-muted mb-2">Block Rate (24h)</h6>
              <h3 class="mb-0" id="blockRate">-</h3>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Charts Row -->
      <div class="row g-4 mb-4">
        <!-- Traffic Over Time -->
        <div class="col-12 col-xl-8">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body">
              <h5 class="card-title mb-4">Traffic Over Time</h5>
              <div class="chart-container" style="position: relative; height: 300px;">
                <canvas id="trafficChart"></canvas>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Request Distribution -->
        <div class="col-12 col-xl-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-body">
              <h5 class="card-title mb-4">Request Distribution</h5>
              <div class="chart-container" style="position: relative; height: 300px;">
                <canvas id="distributionChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    data() {
      return {
        chartOptions: {
          traffic: {
            type: 'line',
            data: {
              labels: [],
              datasets: [
                {
                  label: 'Allowed Requests',
                  data: [],
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  tension: 0.4
                },
                {
                  label: 'Blocked Requests',
                  data: [],
                  borderColor: 'rgba(255, 99, 132, 1)',
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  tension: 0.4
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: {
                intersect: false,
                mode: 'index'
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0
                  }
                }
              }
            }
          },
          distribution: {
            type: 'doughnut',
            data: {
              labels: ['Allowed', 'Blocked'],
              datasets: [{
                data: [0, 0],
                backgroundColor: [
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(255, 99, 132, 0.8)'
                ]
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }
          }
        },
        apiLinks: {}
      };
    },
    created() {
      this.charts = {
        traffic: null,
        distribution: null
      };
    },
    async mounted() {
      const storedLinks = localStorage.getItem('links');
      if (storedLinks) {
        this.apiLinks = JSON.parse(storedLinks);
      }
  
      if (typeof Chart === 'undefined') return;
  
      await this.$nextTick();
      this.initializeCharts();
      this.fetchAndUpdateData();
  
      window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
      if (this.charts.traffic) this.charts.traffic.destroy();
      if (this.charts.distribution) this.charts.distribution.destroy();
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      initializeCharts() {
        const trafficCtx = document.getElementById('trafficChart')?.getContext('2d');
        const distributionCtx = document.getElementById('distributionChart')?.getContext('2d');
      
        if (!trafficCtx || !distributionCtx) return;
  
        const trafficConfig = JSON.parse(JSON.stringify(this.chartOptions.traffic));
        const distributionConfig = JSON.parse(JSON.stringify(this.chartOptions.distribution));
      
        this.charts.traffic = new Chart(trafficCtx, trafficConfig);
        this.charts.distribution = new Chart(distributionCtx, distributionConfig);
      },
      fetchAndUpdateData() {
        $.ajax({
          url: this.apiLinks.getDomainLogs.href,
          method: 'GET',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` },
          success: (logs) => this.updateDashboard(logs),
          error: () => this.showToast('Error', 'Failed to fetch DNS logs', 'error')
        });
      },
      updateDashboard(logs) {
        if (!Array.isArray(logs)) return;
  
        const now = Date.now();
        const last24h = logs.filter(log => {
          const logDate = new Date(log.timestamp);
          return logDate > new Date(now - 24 * 60 * 60 * 1000);
        });
  
        this.updateSummaryCards(last24h);
        this.updateCharts(last24h, now);
      },
      updateSummaryCards(last24h) {
        const totalRequests = last24h.length;
        const blockedRequests = last24h.filter(log => log.blocked).length;
        const uniqueDomains = new Set(last24h.map(log => log.domain)).size;
        const blockRate = totalRequests > 0 
          ? ((blockedRequests / totalRequests) * 100).toFixed(1) 
          : '0.0';
  
        $('#totalRequests').text(totalRequests.toLocaleString());
        $('#blockedRequests').text(blockedRequests.toLocaleString());
        $('#uniqueDomains').text(uniqueDomains.toLocaleString());
        $('#blockRate').text(`${blockRate}%`);
      },
      updateCharts(last24h, now) {
        if (!this.charts.traffic || !this.charts.distribution) return;
  
        const { timeLabels, allowedData, blockedData } = this.processTimeSeriesData(last24h, now);
  
        this.charts.traffic.data.labels = timeLabels;
        this.charts.traffic.data.datasets[0].data = allowedData;
        this.charts.traffic.data.datasets[1].data = blockedData;
        this.charts.traffic.update('none');
  
        const [allowed, blocked] = [
          last24h.filter(log => !log.blocked).length,
          last24h.filter(log => log.blocked).length
        ];
        
        this.charts.distribution.data.datasets[0].data = [allowed, blocked];
        this.charts.distribution.update('none');
      },
      processTimeSeriesData(last24h, now) {
        const timeData = new Map();
        const hourFormat = { hour: '2-digit', minute: '2-digit' };
        
        for (let i = 23; i >= 0; i--) {
          const time = new Date(now - i * 60 * 60 * 1000);
          const timeLabel = time.toLocaleTimeString([], hourFormat);
          timeData.set(timeLabel, { allowed: 0, blocked: 0 });
        }
        
        last24h.forEach(log => {
          const logTime = new Date(log.timestamp);
          const timeLabel = logTime.toLocaleTimeString([], hourFormat);
          
          if (!timeData.has(timeLabel)) {
            const closestSlot = Array.from(timeData.keys()).reduce((prev, curr) => {
              const prevTime = new Date(`2025-03-01T${prev}`).getTime();
              const currTime = new Date(`2025-03-01T${curr}`).getTime();
              const logTimeMs = logTime.getTime();
              return Math.abs(currTime - logTimeMs) < Math.abs(prevTime - logTimeMs) ? curr : prev;
            });
            
            if (log.blocked) {
              timeData.get(closestSlot).blocked++;
            } else {
              timeData.get(closestSlot).allowed++;
            }
          } else {
            const data = timeData.get(timeLabel);
            data[log.blocked ? 'blocked' : 'allowed']++;
          }
        });
        
        return {
          timeLabels: Array.from(timeData.keys()),
          allowedData: Array.from(timeData.values()).map(v => v.allowed),
          blockedData: Array.from(timeData.values()).map(v => v.blocked)
        };
      },
      handleResize() {
        if (this.charts.traffic) this.charts.traffic.resize();
        if (this.charts.distribution) this.charts.distribution.resize();
      }
    }
  };