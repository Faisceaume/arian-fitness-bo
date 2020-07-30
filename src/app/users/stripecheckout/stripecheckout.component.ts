import { Component, OnInit, Input, HostListener } from '@angular/core';
import { StripecheckoutService } from './stripecheckout.service';
import { AuthService } from 'src/app/auth/auth.service';

declare var StripeCheckout: StripeCheckoutStatic;

@Component({
  selector: 'app-stripecheckout',
  templateUrl: './stripecheckout.component.html',
  styleUrls: ['./stripecheckout.component.css']
})
export class StripecheckoutComponent implements OnInit {

  @Input()amount = 50;
  @Input()description;
  

  constructor(private paymentService: StripecheckoutService, private auth: AuthService) { }

  handler: StripeCheckoutHandler;

  ngOnInit() {
    this.handler = StripeCheckout.configure({
      key: 'pk_test_yDtGdgPw6nE62qq046y2WgUn00T98s5X3b',
      image: '/your-avatar.png',
      locale: 'auto',
      token: token => {
        //this.paymentService.processPayment(token, this.amount);
      }
    });
  }

  async checkout(e) {
    const user = await this.auth.getUser();
    this.handler.open({
        name: 'Faisceaume',
        description: this.description,
        amount: this.amount,
        email: user.email,
    });
    e.preventDefault();
  }

  @HostListener('window:popstate')
  onPopstate() {
    this.handler.close();
  }

}
