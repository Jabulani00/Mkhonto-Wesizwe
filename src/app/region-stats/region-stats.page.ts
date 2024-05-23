import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-zoom';


interface Statistics {
  totalVoterRoll: number;
  totalVoterTurnout: number;
  totalSpoiltBallots: number;
  totalVotes: number;
  ancVotes: number;
  daVotes: number;
  effVotes: number;
  ifpVotes: number;
  mkVotes: number;
  actsaVotes: number;
  udmVotes: number;
}

interface FraudAlert {
  municipality: string;
  ward: number;
  totalVotes: number;
  voterRoll: number;
}

@Component({
  selector: 'app-region-stats',
  templateUrl: './region-stats.page.html',
  styleUrls: ['./region-stats.page.scss']
})
export class RegionStatsPage implements OnInit {
  @ViewChild('votesVsVoterRollChart') votesVsVoterRollChart!: ElementRef;
  @ViewChild('generalStatsChart') generalStatsChart!: ElementRef;
  @ViewChild('lineChart') lineChart!: ElementRef;
  @ViewChild('radarChart') radarChart!: ElementRef;

  currentMunicipality: string = '';
  totalVoterRoll: number = 0;
  totalVoterTurnout: number = 0;
  totalSpoiltBallots: number = 0;
  totalVotes: number = 0;
  ancVotes: number = 0;
  daVotes: number = 0;
  effVotes: number = 0;
  ifpVotes: number = 0;
  mkVotes: number = 0;
  actsaVotes: number = 0;
  udmVotes: number = 0;
  fraudAlerts: FraudAlert[] = [];

  chart: any;
  barChart: any;
  line: any;
  radar: any;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const user = await this.auth.currentUser;

    if (!user) {
      this.router.navigate(['/login']);  // Redirect to login if not authenticated
    } else {
      this.getCurrentUserMunicipality();
    }
  }

  async getCurrentUserMunicipality() {
    const user = await this.auth.currentUser;
    const userEmail = user?.email;

    if (userEmail) {
      this.firestore
        .collection('Users')
        .ref.where('email', '==', userEmail)
        .get()
        .then((querySnapshot: any) => {
          if (querySnapshot.empty) {
            console.error('No matching user document found.');
            return;
          }
          querySnapshot.forEach((doc: any) => {
            const data = doc.data();
            this.currentMunicipality = data.municipality;
            console.log('User municipality:', this.currentMunicipality);
            this.fetchStatistics();
            this.fetchFraudAlerts();
          });
        })
        .catch((error: any) => {
          console.error('Error getting user municipality:', error);
        });
    } else {
      console.error('No user is currently logged in.');
    }
  }

  fetchStatistics() {
    this.firestore
      .collection('electionData', (ref) =>
        ref.where('municipality', '==', this.currentMunicipality)
      )
      .valueChanges()
      .subscribe(
        (electionData: any[]) => {
          if (!electionData.length) {
            console.warn('No election data found for municipality:', this.currentMunicipality);
            return;
          }

          const statistics: Statistics = {
            totalVoterRoll: 0,
            totalVoterTurnout: 0,
            totalSpoiltBallots: 0,
            totalVotes: 0,
            ancVotes: 0,
            daVotes: 0,
            effVotes: 0,
            ifpVotes: 0,
            mkVotes: 0,
            actsaVotes: 0,
            udmVotes: 0,
          };

          electionData.forEach((data) => {
            statistics.totalVoterRoll += data.voterRoll;
            statistics.totalVoterTurnout += data.voterTurnout;
            statistics.totalSpoiltBallots += data.spoiltBallots;
            statistics.totalVotes += data.totalVotes;
            statistics.ancVotes += data.ancVotes;
            statistics.daVotes += data.daVotes;
            statistics.effVotes += data.effVotes;
            statistics.ifpVotes += data.ifpVotes;
            statistics.mkVotes += data.mkVotes;
            statistics.actsaVotes += data.actsaVotes;
            statistics.udmVotes += data.udmVotes;
          });

          this.totalVoterRoll = statistics.totalVoterRoll;
          this.totalVoterTurnout = statistics.totalVoterTurnout;
          this.totalSpoiltBallots = statistics.totalSpoiltBallots;
          this.totalVotes = statistics.totalVotes;
          this.ancVotes = statistics.ancVotes;
          this.daVotes = statistics.daVotes;
          this.effVotes = statistics.effVotes;
          this.ifpVotes = statistics.ifpVotes;
          this.mkVotes = statistics.mkVotes;
          this.actsaVotes = statistics.actsaVotes;
          this.udmVotes = statistics.udmVotes;

          this.updateChart();
          this.updateBarChart();
          this.updateLineChart();
          this.updateRadarChart();
        },
        (error) => {
          console.error('Error fetching statistics:', error);
        }
      );
  }

  fetchFraudAlerts() {
    this.firestore
      .collection('electionData', (ref) =>
        ref.where('municipality', '==', this.currentMunicipality)
      )
      .valueChanges()
      .subscribe(
        (electionData: any[]) => {
          if (!electionData.length) {
            console.warn('No election data found for municipality:', this.currentMunicipality);
            return;
          }

          const fraudAlerts: FraudAlert[] = electionData
            .filter((data) => data.totalVotes > data.voterRoll)
            .map((data) => ({
              municipality: data.municipality,
              ward: data.ward,
              totalVotes: data.totalVotes,
              voterRoll: data.voterRoll,
            }));

          this.fraudAlerts = fraudAlerts;
          console.log('Fraud alerts:', this.fraudAlerts);
        },
        (error) => {
          console.error('Error fetching fraud alerts:', error);
        }
      );
  }

  segmentChanged(event: CustomEvent) {
    const selectedSegment = event.detail.value;
    const chartContainers = document.querySelectorAll('.chart-container');

    chartContainers.forEach(container => {
      const chartContainer = container as HTMLElement;
      if (chartContainer.id === `${selectedSegment}-chart`) {
        chartContainer.style.display = 'block';
      } else {
        chartContainer.style.display = 'none';
      }
    });
  }

  updateChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.votesVsVoterRollChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['ANC Votes', 'DA Votes', 'EFF Votes', 'IFP Votes', 'MK Votes', 'ACTSA Votes'],
        datasets: [{
          data: [
            this.ancVotes,
            this.daVotes,
            this.effVotes,
            this.ifpVotes,
            this.mkVotes,
            this.actsaVotes,
           
          ],
          backgroundColor: [
            '#F7C50C',
            '#2364A7',
            '#F71A17',
            '#000000',
            '#53A546',
            '#06B014',
            
          ],
        }]
      },
      options: {
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'xy',
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  updateBarChart() {
    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart(this.generalStatsChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Total Voter Roll', 'Total Voter Turnout', 'Total Spoilt Ballots', 'Total Votes'],
        datasets: [{
          data: [
            this.totalVoterRoll,
            this.totalVoterTurnout,
            this.totalSpoiltBallots,
            this.totalVotes
          ],
          backgroundColor: '#36A2EB'
        }]
      },
      options: {
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'xy',
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  updateLineChart() {
    if (this.line) {
      this.line.destroy();
    }

    this.line = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['ANC Votes', 'DA Votes', 'EFF Votes', 'IFP Votes', 'MK Votes', 'ActionSA Votes'],
        datasets: [{
          label: 'Votes Over Time',
          data: [
            this.ancVotes,
            this.daVotes,
            this.effVotes,
            this.ifpVotes,
            this.mkVotes,
            this.actsaVotes
            
          ],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: true,
        }]
      },
      options: {
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'xy',
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  updateRadarChart() {
    if (this.radar) {
      this.radar.destroy();
    }

    this.radar = new Chart(this.radarChart.nativeElement, {
      type: 'radar',
      data: {
        labels: ['ANC Votes', 'DA Votes', 'EFF Votes', 'IFP Votes', 'MK Votes', 'ActionSA Votes'],
        datasets: [{
          label: 'Votes Distribution',
          data: [
            this.ancVotes,
            this.daVotes,
            this.effVotes,
            this.ifpVotes,
            this.mkVotes,
            this.actsaVotes
           
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: true,
        }]
      },
      options: {
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'xy',
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
