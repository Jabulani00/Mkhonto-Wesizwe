import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Point, BubbleDataPoint } from 'chart.js';
import { map } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import 'chartjs-plugin-zoom';



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


  @ViewChild('percentageVotesChartCanvas') percentageVotesChartCanvas!: ElementRef;
  percentageVotesChart: Chart<'pie', number[], string>;


  votesAndTurnoutData: any[] = [];
  votesAndTurnoutChart!: Chart;

  // Properties to hold stats
  totalVoterRoll: number = 0;
  totalVoterTurnout: number = 0;
  totalSpoiltBallots: number = 0;
  totalVotes: number = 0;

  // Property to hold fraud alerts
  fraudAlerts: { municipality: string; ward: string; totalVotes: number; voterRoll: number }[] = [];

  constructor(private afs: AngularFirestore) { 
    this.percentageVotesChart = {} as Chart<'pie', number[], string>;
  }

  ngOnInit() {
    this.loadVotesAndTurnoutData();
    this.fetchMkVotesData();
    this.loadPercentageVotesData();
  }

  loadPercentageVotesData() {
    this.afs.collection<ElectionData>('electionData').snapshotChanges().pipe(
      map(snapshot => snapshot.map(doc => doc.payload.doc.data() as ElectionData)),
      take(1) // take only one snapshot
    ).subscribe(
      (data: ElectionData[]) => {
        console.log('Fetched data:', data);
  
        const totalVotes = data.reduce((total, item) => total + item.totalVotes, 0);
  
        const combinedVotes = data.reduce((combined, item) => {
          combined['ANC'] = (combined['ANC'] || 0) + item.ancVotes;
          combined['DA'] = (combined['DA'] || 0) + item.daVotes;
          combined['EFF'] = (combined['EFF'] || 0) + item.effVotes;
          combined['IFP'] = (combined['IFP'] || 0) + item.ifpVotes;
          combined['MK'] = (combined['MK'] || 0) + item.mkVotes;
          combined['NFP'] = (combined['NFP'] || 0) + item.nfpVotes;
          combined['UDM'] = (combined['UDM'] || 0) + item.udmVotes;
          return combined;
        }, {} as { [party: string]: number });
  
        const percentages = {
          ANC: this.calculatePercentage(combinedVotes['ANC'], totalVotes),
          DA: this.calculatePercentage(combinedVotes['DA'], totalVotes),
          EFF: this.calculatePercentage(combinedVotes['EFF'], totalVotes),
          IFP: this.calculatePercentage(combinedVotes['IFP'], totalVotes),
          MK: this.calculatePercentage(combinedVotes['MK'], totalVotes),
          NFP: this.calculatePercentage(combinedVotes['NFP'], totalVotes),
          UDM: this.calculatePercentage(combinedVotes['UDM'], totalVotes),
        };
  
        console.log('Combined Percentages:', percentages);
  
        // Update chart with new data
        this.updatePercentageVotesChart(percentages);
      },
      (error) => {
        console.error('Error fetching data from Firestore:', error);
      }
    );
  }
  
  calculatePercentage(votes: number, totalVotes: number): number {
    return (votes / totalVotes) * 100;
  }
  
  updatePercentageVotesChart(percentages: { [party: string]: number }) {
    // Check if chart has been initialized
    if (this.percentageVotesChart && this.percentageVotesChart.data) {
      // Update chart data
      this.percentageVotesChart.data.labels = Object.keys(percentages);
      this.percentageVotesChart.data.datasets[0].data = Object.values(percentages);
      // Update chart
      this.percentageVotesChart.update();
    } else {
      console.error('Percentage votes chart not initialized.');
    }
  }

  createPercentageVotesChart(percentages: { [party: string]: number }) {
    const canvas = this.percentageVotesChartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    this.percentageVotesChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(percentages),
        datasets: [{
          data: Object.values(percentages),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#9ACD32',
            '#8A2BE2',
            '#FFA500',
            '#800080',
          ],
        }],
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
      },
    });
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
      this.mkVotesChart.destroy();
    }
  
    this.mkVotesChart = new Chart<'pie', number[], string>(this.mkVotesChartCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#53A546',
            '#36A2EB',
            '#FFCE56',
            '#9ACD32', // Green
            '#8A2BE2', // Purple
            '#FFA500', // Orange
            '#800080', // Maroon
            '#00FF00', // Lime
            '#DC143C', // Crimson
            '#00CED1', // Dark Turquoise
            '#FF4500', // OrangeRed
            // Add more colors as needed
          ],
        }],
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



  ngAfterViewInit() {
    this.createVotesAndTurnoutChart();
    this.createPercentageVotesChart({});
  }

  segmentChanged(event: CustomEvent) {
    const selectedSegment = event.detail.value;
    const chartContainers = document.querySelectorAll('.chart-container');
  
    chartContainers.forEach((container) => {
      const chartContainer = container as HTMLElement;
      if (chartContainer.id === `${selectedSegment}-chart`) {
        chartContainer.style.display = 'block';
      } else {
        chartContainer.style.display = 'none';
      }
    });
  }

  loadVotesAndTurnoutData() {
    this.afs.collection<ElectionData>('electionData').snapshotChanges().subscribe(
      (snapshot) => {
        const data = snapshot.map((doc) => doc.payload.doc.data() as ElectionData);
        console.log('Fetched data:', data);
  
        // Initialize combined data
        const combinedData: { [key: string]: number } = {
          ancVotes: 0,
          daVotes: 0,
          effVotes: 0,
          ifpVotes: 0,
          mkVotes: 0,
          nfpVotes: 0,
          udmVotes: 0,
          totalVotes: 0,
          spoiltBallots: 0,
          voterTurnout: 0,
          voterRoll: 0,
        };
  
        // Combine data from all documents
        data.forEach((item) => {
          combinedData['ancVotes'] += item.ancVotes;
          combinedData['daVotes'] += item.daVotes;
          combinedData['effVotes'] += item.effVotes;
          combinedData['ifpVotes'] += item.ifpVotes;
          combinedData['mkVotes'] += item.mkVotes;
          combinedData['nfpVotes'] += item.nfpVotes;
          combinedData['udmVotes'] += item.udmVotes;
          combinedData['totalVotes'] += item.totalVotes;
          combinedData['spoiltBallots'] += item.spoiltBallots;
          combinedData['voterTurnout'] += item.voterTurnout;
          combinedData['voterRoll'] += item.voterRoll;
        });
  
        // Update other properties
        this.totalVoterRoll = combinedData['voterRoll'];
        this.totalVoterTurnout = combinedData['voterTurnout'];
        this.totalSpoiltBallots = combinedData['spoiltBallots'];
        this.totalVotes = combinedData['totalVotes'];
  
        // Update fraudAlerts
        this.fraudAlerts = data.filter((item) => item.totalVotes > item.voterRoll).map((item) => ({
          municipality: item.municipality,
          ward: item.ward,
          totalVotes: item.totalVotes,
          voterRoll: item.voterRoll,
        }));
  
        // Create votesAndTurnoutData array with combined data
        this.votesAndTurnoutData = [
          { label: 'ANC Votes', value: combinedData['ancVotes'] },
          { label: 'DA Votes', value: combinedData['daVotes'] },
          { label: 'EFF Votes', value: combinedData['effVotes'] },
          { label: 'IFP Votes', value: combinedData['ifpVotes'] },
          { label: 'MK Votes', value: combinedData['mkVotes'] },
          { label: 'NFP Votes', value: combinedData['nfpVotes'] },
          { label: 'UDM Votes', value: combinedData['udmVotes'] },
          { label: 'Total Votes', value: combinedData['totalVotes'] },
          { label: 'Spoilt Ballots', value: combinedData['spoiltBallots'] },
          { label: 'Voter Turnout', value: combinedData['voterTurnout'] },
          { label: 'Voter Roll', value: combinedData['voterRoll'] },
        ];
  
        console.log('Transformed data for votes and turnout:', this.votesAndTurnoutData);
  
        // Create data for the createVotesVsVoterRollChart function
        const votesVsVoterRollData = [
          {
            total: combinedData['totalVotes'],
            voterRoll: combinedData['voterRoll']
          }
        ];
  
        this.createVotesAndTurnoutChart();
        this.createVotesVsVoterRollChart(votesVsVoterRollData);
      },
      (error) => {
        console.error('Error fetching data from Firestore:', error);
      }
    );
  }
  createVotesAndTurnoutChart() {
    if (this.votesAndTurnoutChart) {
      this.votesAndTurnoutChart.destroy();
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
            beginAtZero: true,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
  
}
