import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IS_ELECTRON } from '../../../../app.constants';
import {
  TaskAttachment,
  TaskAttachmentCopy,
  TaskAttachmentType,
} from '../task-attachment.model';
import { T } from '../../../../t.const';

interface TaskAttachmentSelectType {
  type: TaskAttachmentType;
  title: string;
}

@Component({
  selector: 'dialog-edit-task-attachment',
  templateUrl: './dialog-edit-task-attachment.component.html',
  styleUrls: ['./dialog-edit-task-attachment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogEditTaskAttachmentComponent {
  types: TaskAttachmentSelectType[];
  attachmentCopy: TaskAttachmentCopy;
  T: typeof T = T;

  constructor(
    private _matDialogRef: MatDialogRef<DialogEditTaskAttachmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.attachmentCopy = { ...this.data.attachment } as TaskAttachmentCopy;
    if (!this.attachmentCopy.type) {
      this.attachmentCopy.type = 'LINK';
    }

    this.types = [
      { type: 'LINK', title: T.F.ATTACHMENT.DIALOG_EDIT.TYPES.LINK },
      { type: 'IMG', title: T.F.ATTACHMENT.DIALOG_EDIT.TYPES.IMG },
    ];
    if (IS_ELECTRON) {
      this.types.push({ type: 'FILE', title: T.F.ATTACHMENT.DIALOG_EDIT.TYPES.FILE });
    }
  }

  close(attachment?: TaskAttachment): void {
    this._matDialogRef.close(attachment);
  }

  submit(): void {
    // don't submit invalid data
    if (!this.attachmentCopy.path || !this.attachmentCopy.type) {
      return;
    }

    if (
      this.attachmentCopy.type === 'LINK' &&
      this.attachmentCopy.path &&
      // don't prepend for all valid RFC3986 URIs
      !this.attachmentCopy.path.match(
        /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
      )
    ) {
      this.attachmentCopy.path = 'http://' + this.attachmentCopy.path;
    }

    this.close(this.attachmentCopy);
  }

  mapTypeToLabel(type: TaskAttachmentType): string {
    switch (type) {
      case 'FILE':
        return T.F.ATTACHMENT.DIALOG_EDIT.LABELS.LINK;
      case 'IMG':
        return T.F.ATTACHMENT.DIALOG_EDIT.LABELS.IMG;
      case 'LINK':
      default:
        return T.F.ATTACHMENT.DIALOG_EDIT.LABELS.LINK;
    }
  }

  trackByIndex(i: number, p: any): number {
    return i;
  }
}
