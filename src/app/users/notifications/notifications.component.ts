import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { MatDialogConfig, MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  displayedColumns: string[] = ['title', 'content', 'status', 'timestamp', 'user', 'action'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  users: any[];

  constructor(
    private notificationsService: NotificationsService,
    private matDialog: MatDialog,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.notificationsService.getAllNotifications();
    this.userService.getAllUsers();
    this.notificationsService.notificationsSubject.subscribe(data => {
      this.userService.userSubject.subscribe((data: any[]) => {
        this.users = data.map(d => { return  {id: d.id, nom: d.nom, prenom: d.prenom}});
      });
      this.dataSource = new MatTableDataSource( data );
      this.sort = this.dataSource.sort;
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {create: true, update: false, users: this.users};
    this.matDialog.open(DialogNotificationComponent, dialogConfig);
  }

  onEdit(id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';
    dialogConfig.data = {create: false, update: true, key: id, users: this.users};
    this.matDialog.open(DialogNotificationComponent, dialogConfig);
  }

  onDelete(id: string) {
    if (confirm("Are you sure to delete this notication")) {
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
    this.notificationsService.updateStatusNotification(status, id)
                             .then(() => console.log('notification status change to ' + status))
                             .catch(err => console.log('Erreur mise à jour du statut' + err));
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
  users: any[];
  userSelected: any;

  constructor(
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogNotificationComponent>,
    private userService: UsersService
    ) {}

  ngOnInit() {
    if( this.data.create ) {
      this.initForm();
    }
    if ( this.data.update ) {
      this.initForm();
      this.notificationsService.getOneNotification(this.data.key);
      this.notificationsService.notificationOneSubject.subscribe(data => {
        this.userSelected = data.user;
        this.form.patchValue({
          title: data.title,
          content: data.content,
          status: data.status,
          user: {id: data.user, nom: data.user.nom, prenom: data.user.prenom}
        });
        this.isLoadData = true;
      });
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      user: ['', Validators.required],
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
