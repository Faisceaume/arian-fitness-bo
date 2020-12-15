import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { MatDialogConfig, MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  displayedColumns: string[] = ['title', 'content', 'picture', 'status', 'timestamp', 'username', 'action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private notificationsService: NotificationsService,
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.notificationsService.getAllNotifications();
    this.notificationsService.notificationsSubject.subscribe(data => {
      this.dataSource = new MatTableDataSource( data );
      this.sort = this.dataSource.sort;
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {create: true, update: false};
    this.matDialog.open(DialogNotificationComponent, dialogConfig);
  }

  openDialogPic(key: string) {
    const dialogPicConfig = new MatDialogConfig();
    dialogPicConfig.autoFocus = true;
    dialogPicConfig.width = '40%';
    dialogPicConfig.data = {create: true, update: false, id: key};
    this.matDialog.open(DialogPicNotificationComponent, dialogPicConfig);
  }

  onEdit(id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {create: false, update: true, key: id};
    this.matDialog.open(DialogNotificationComponent, dialogConfig);
  }

  onDelete(id: string) {
    if (confirm('Are you sure to delete this notication')) {
      this.notificationsService.deleteNotification(id);
    }
  }

  changeStatus(status: string, id: string) {
    if (status === 'online') {
      status = 'offline';
    } else if (status === 'offline') {
      status = 'draft';
    } else if(status === 'draft') {
       status = 'online';
    }
    this.notificationsService.updateStatusNotification(status, id);
  }

}


@Component({
  selector: 'app-dialogNotification',
  templateUrl: './dialogNoification.component.html',
  styleUrls: ['./dialogNotification.component.css']
})
export class DialogNotificationComponent implements OnInit {

  form: FormGroup;
  isLoadData = false;

  constructor(
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogNotificationComponent>
    ) {}

  ngOnInit() {

    if( this.data.create ) {
      this.initForm();
    }
    if ( this.data.update ) {
      this.notificationsService.getOneNotification(this.data.key);
      this.notificationsService.notificationOneSubject.subscribe(data => {
        this.form = this.formBuilder.group({
          title: [data.title, Validators.required],
          content: [data.content, Validators.required],
          status: [data.status, Validators.required]
        });
        this.isLoadData = true;
      });
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  createNewNotification() {
    const data = this.form.value;
    this.notificationsService.createNotification(data);
    this.dialogRef.close();
  }

  updateNotification() {
    const data = this.form.value;
    this.notificationsService.updateNotification(data, this.data.key);
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}






@Component({
  selector: 'app-dialogPicNotification',
  templateUrl: './dialog-pic-notification.component.html',
  styleUrls: ['./dialog-pic-notification.component.css']
})
export class DialogPicNotificationComponent implements OnInit {

  form: FormGroup;
  isLoadData = false;
  isImage = false;

  constructor(
    private notificationsService: NotificationsService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogNotificationComponent>
    ) {}

  ngOnInit() {
    this.notificationsService.getOneNotification(this.data.id);
    this.notificationsService.notificationOneSubject.subscribe(data => {
        if (data.image) {
          this.isImage = true;
          this.sharedService.fileUrl = data.image;
        } else {
          this.sharedService.fileUrl = null;
        }
        this.sharedService.currentNotification = data;
        this.isLoadData = true;
      });
  }


}
