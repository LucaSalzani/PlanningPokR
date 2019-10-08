import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-voting-result',
  templateUrl: './voting-result.component.html',
  styleUrls: ['./voting-result.component.scss']
})
export class VotingResultComponent implements OnInit {

  @Input() votes: number[];

  data: any[];
  ticks: any[] = ['1', '2', '3', '4', '5', '6', '7'];

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

    this.data = [];

    Object.keys(dataDict).sort().forEach( vote => {
      const dataPoint = {
        name: vote,
        value: dataDict[vote],
      };
      this.data.push(dataPoint);
    });
  }

}
