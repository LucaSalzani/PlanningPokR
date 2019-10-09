import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-story-manually-modal',
  templateUrl: './add-story-manually-modal.component.html',
  styleUrls: ['./add-story-manually-modal.component.scss']
})
export class AddStoryManuallyModalComponent {
  newStoryId: string;
  newStoryTitle: string;

  constructor(public activeModal: NgbActiveModal) { }

  close(): void {
    this.activeModal.close({
      newStoryId: this.newStoryId,
      newStoryTitle: this.newStoryTitle
    });
  }
}
