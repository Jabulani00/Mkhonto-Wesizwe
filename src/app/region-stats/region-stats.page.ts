import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import Chart from 'chart.js/auto';

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
  nfpVotes: number;
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
  nfpVotes: number = 0;
  udmVotes: number = 0;
  fraudAlerts: FraudAlert[] = [];

  chart: any;
  barChart: any;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.getCurrentUserMunicipality();
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
          querySnapshot.forEach((doc: any) => {
            const data = doc.data();
            this.currentMunicipality = data.municipality;
            this.fetchStatistics();
            this.fetchFraudAlerts();
          });
        })
        .catch((error: any) => {
          console.error('Error getting user municipality:', error);
        });
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
            nfpVotes: 0,
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
            statistics.nfpVotes += data.nfpVotes;
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
          this.nfpVotes = statistics.nfpVotes;
          this.udmVotes = statistics.udmVotes;

          this.updateChart();
          this.updateBarChart();
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
          const fraudAlerts: FraudAlert[] = electionData.filter((data) => {
            const totalVotes = data.totalVotes;
            const voterRoll = data.voterRoll;
            return totalVotes > voterRoll;
          }).map((data) => ({
            municipality: data.municipality,
            ward: data.ward,
            totalVotes: data.totalVotes,
            voterRoll: data.voterRoll
          }));

          this.fraudAlerts = fraudAlerts;
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
        labels: ['ANC Votes', 'DA Votes', 'EFF Votes', 'IFP Votes', 'MK Votes', 'NFP Votes', 'UDM Votes'],
        datasets: [{
          data: [
            this.ancVotes,
            this.daVotes,
            this.effVotes,
            this.ifpVotes,
            this.mkVotes,
            this.nfpVotes,
            this.udmVotes
          ],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#FF5733',
            '#C70039',
            '#900C3F',
            '#581845'
          ],
        }]
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
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
