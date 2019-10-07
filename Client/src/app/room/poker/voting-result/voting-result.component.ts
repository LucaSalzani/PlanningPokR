import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-voting-result',
  templateUrl: './voting-result.component.html',
  styleUrls: ['./voting-result.component.scss']
})
export class VotingResultComponent implements OnInit {

  @Input() votes: number[];

  data: any;
  options: any;

  constructor() { }

  ngOnInit(): void {
    const dataDict: { [vote: string]: number } = {};

    this.votes.forEach(element => {
      const key = element ? element.toString() : 'No Vote';
      if (dataDict[key]) {
        dataDict[key] = dataDict[key] + 1;
      } else {
        dataDict[key] = 1;
      }
    });

    this.data = {
      labels: [
        ...(Object.keys(dataDict))
      ],
      series: [
        ...(Object.entries(dataDict).map(([_, value]) => value))
      ]
    };

    this.options = {
      donut: true,
      height: 300
    };
  }

}
