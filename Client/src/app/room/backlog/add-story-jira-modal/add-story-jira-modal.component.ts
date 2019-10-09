import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { JiraStoryDto } from './jira-story.dto';

@Component({
  selector: 'app-add-story-jira-modal',
  templateUrl: './add-story-jira-modal.component.html',
  styleUrls: ['./add-story-jira-modal.component.scss']
})
export class AddStoryJiraModalComponent implements OnInit {
  @Input() roomId: string;

  public jiraStories: JiraStoryDto[];
  message: string;

  constructor(public activeModal: NgbActiveModal, private http: HttpClient) {
    this.jiraStories = [];
    this.message = 'Loading...';
  }

  ngOnInit() {
    let parameters = new HttpParams();
    parameters = parameters.append('roomId', this.roomId);

    this.http.get<JiraStoryDto[]>(`${environment.backendBaseUrl}api/jira/stories`, { params: parameters, responseType: 'json'})
    .subscribe(
      (stories: JiraStoryDto[]) => {
        this.jiraStories = stories;
        if (stories.length === 0) {
          this.message = 'No stories found';
        }
      },
      (error: HttpErrorResponse) => {
        this.message = `Error fetching stories (${error.status})`;
      }
    );
  }

  addStory(storyKey: string, storyTitle: string) {
    this.activeModal.close({
      newStoryId: storyKey,
      newStoryTitle: storyTitle
    });
  }
}
