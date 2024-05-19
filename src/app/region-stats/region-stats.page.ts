import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface Statistics {
  totalVoterRoll: number;
  totalVoterTurnout: number;
  totalSpoiltBallots: number;
  totalVotes: number;
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
  currentMunicipality: string='';
  totalVoterRoll: number = 0;
  totalVoterTurnout: number = 0;
  totalSpoiltBallots: number = 0;
  totalVotes: number = 0;
  fraudAlerts: FraudAlert[] = [];

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
            totalVotes: 0
          };

          electionData.forEach((data) => {
            statistics.totalVoterRoll += data.voterRoll;
            statistics.totalVoterTurnout += data.voterTurnout;
            statistics.totalSpoiltBallots += data.spoiltBallots;
            statistics.totalVotes += data.totalVotes;
          });

          this.totalVoterRoll = statistics.totalVoterRoll;
          this.totalVoterTurnout = statistics.totalVoterTurnout;
          this.totalSpoiltBallots = statistics.totalSpoiltBallots;
          this.totalVotes = statistics.totalVotes;
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
}