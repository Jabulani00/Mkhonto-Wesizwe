import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AngularFirestore } from '@angular/fire/compat/firestore';

Chart.register(...registerables);

interface ElectionData {
  ancPercentage: number;
  ancVotes: number;
  cellNumber: string;
  daPercentage: number;
  daVotes: number;
  effPercentage: number;
  effVotes: number;
  ifpPercentage: number;
  ifpVotes: number;
  leader: string;
  mkPercentage: number;
  mkVotes: number; // Changed to number
  municipality: string;
  nfpPercentage: number;
  nfpVotes: number;
  spoiltBallots: number;
  totalVotes: number;
  udmPercentage: number;
  udmVotes: number;
  vdNumber: number;
  voterRoll: number;
  voterTurnout: number;
  ward: string;
}

interface MkVotesByMunicipality {
  [municipality: string]: number;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit, AfterViewInit {
  @ViewChild('votesAndTurnoutChart', { static: true }) votesAndTurnoutChartCanvas!: ElementRef;
  @ViewChild('votesVsVoterRollChart', { static: true }) votesVsVoterRollChartCanvas!: ElementRef;
  votesVsVoterRollChart!: Chart;

  @ViewChild('mkVotesChartCanvas', { static: true }) mkVotesChartCanvas!: ElementRef;
  mkVotesChart!: Chart<'pie', number[], string>; // Specify type for Chart instance
  mkVotesByMunicipality: MkVotesByMunicipality = {}; // Use the defined interface

  votesAndTurnoutData: any[] = [];
  votesAndTurnoutChart!: Chart;

  // Properties to hold stats
  totalVoterRoll: number = 0;
  totalVoterTurnout: number = 0;
  totalSpoiltBallots: number = 0;
  totalVotes: number = 0;

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.loadVotesAndTurnoutData();
    this.fetchMkVotesData();
  }

  fetchMkVotesData() {
    this.afs.collection<ElectionData>('electionData').snapshotChanges().subscribe((snapshot) => {
      const data = snapshot.map((doc) => doc.payload.doc.data() as ElectionData);
      console.log('Fetched data:', data); // Log fetched data

      // Aggregate MK votes by municipality
      this.mkVotesByMunicipality = data.reduce((acc: MkVotesByMunicipality, item: ElectionData) => {
        acc[item.municipality] = (acc[item.municipality] || 0) + item.mkVotes;
        return acc;
      }, {});

      console.log('MK Votes by Municipality:', this.mkVotesByMunicipality); // Log aggregated data

      // Create pie chart
      this.createMkVotesChart();
    }, (error) => {
      console.error('Error fetching data from Firestore:', error);
    });
  }

  createMkVotesChart() {
    const labels = Object.keys(this.mkVotesByMunicipality);
    const values = Object.values(this.mkVotesByMunicipality);

    if (this.mkVotesChart) {
      this.mkVotesChart.destroy(); // Destroy existing chart before creating a new one
    }

    this.mkVotesChart = new Chart<'pie', number[], string>(this.mkVotesChartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            // Add more colors as needed
          ],
        }],
      },
    });
  }

  ngAfterViewInit() {
    this.createVotesAndTurnoutChart();
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

  loadVotesAndTurnoutData() {
    this.afs.collection<ElectionData>('electionData').snapshotChanges().subscribe((snapshot) => {
      const data = snapshot.map((doc) => doc.payload.doc.data() as ElectionData);
      console.log('Fetched data:', data); // Log fetched data

      this.votesAndTurnoutData = data.reduce<any[]>((acc, item) => [
        ...acc,
        { label: 'ANC Votes', value: item.ancVotes },
        { label: 'DA Votes', value: item.daVotes },
        { label: 'EFF Votes', value: item.effVotes },
        { label: 'IFP Votes', value: item.ifpVotes },
        { label: 'MK Votes', value: +item.mkVotes }, // Ensure mkVotes is a number
        { label: 'NFP Votes', value: item.nfpVotes },
        { label: 'UDM Votes', value: item.udmVotes },
        { label: 'Total Votes', value: item.totalVotes },
        { label: 'Spoilt Ballots', value: item.spoiltBallots },
        { label: 'Voter Turnout', value: item.voterTurnout },
        { label: 'Voter Roll', value: item.voterRoll },
      ], []);

      console.log('Transformed data for votes and turnout:', this.votesAndTurnoutData); // Log transformed data

      // Aggregate stats
      this.totalVoterRoll = data.reduce((acc, item) => acc + item.voterRoll, 0);
      this.totalVoterTurnout = data.reduce((acc, item) => acc + item.voterTurnout, 0);
      this.totalSpoiltBallots = data.reduce((acc, item) => acc + item.spoiltBallots, 0);
      this.totalVotes = data.reduce((acc, item) => acc + item.totalVotes, 0);

      const votesVsVoterRollData = data.map((item) => ({
        total: item.totalVotes,
        voterRoll: item.voterRoll,
      }));

      console.log('Data for Votes vs Voter Roll chart:', votesVsVoterRollData); // Log data for votes vs voter roll

      this.createVotesAndTurnoutChart();
      this.createVotesVsVoterRollChart(votesVsVoterRollData);
    }, (error) => {
      console.error('Error fetching data from Firestore:', error);
    });
  }

  createVotesAndTurnoutChart() {
    if (this.votesAndTurnoutChart) {
      this.votesAndTurnoutChart.destroy(); // Destroy existing chart before creating a new one
    }

    this.votesAndTurnoutChart = new Chart(this.votesAndTurnoutChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.votesAndTurnoutData.map((data) => data.label),
        datasets: [
          {
            label: 'Votes and Turnout',
            data: this.votesAndTurnoutData.map((data) => data.value),
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#9ACD32',
              '#8A2BE2',
              '#FFA500',
              '#800080',
              '#00FF00',
              '#DC143C',
              '#00CED1',
              '#FF4500',
            ],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createVotesVsVoterRollChart(data: { total: number; voterRoll: number }[]) {
    if (this.votesVsVoterRollChart) {
      this.votesVsVoterRollChart.destroy(); // Destroy existing chart before creating a new one
    }

    this.votesVsVoterRollChart = new Chart(this.votesVsVoterRollChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Votes vs Voter Roll'],
        datasets: [
          {
            label: 'Total Votes',
            data: data.map((item) => item.total),
            backgroundColor: data.map((item) =>
              item.total > item.voterRoll ? 'red' : 'green'
            ),
          },
          {
            label: 'Voter Roll',
            data: data.map((item) => item.voterRoll),
            backgroundColor: 'gray',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
