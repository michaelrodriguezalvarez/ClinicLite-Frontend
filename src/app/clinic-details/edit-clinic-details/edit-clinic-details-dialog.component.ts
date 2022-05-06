import {
  Component,
  Injector,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AppComponentBase } from '@shared/app-component-base';
import {
  ClinicDetailsServiceProxy,
  ClinicDetailsDto
} from '@shared/service-proxies/service-proxies';

@Component({
  templateUrl: 'edit-clinic-details-dialog.component.html'
})
export class EditClinicDetailsDialogComponent extends AppComponentBase
  implements OnInit {
  saving = false;
  clinicDetails: ClinicDetailsDto = new ClinicDetailsDto();
  id: number;

  @Output() onSave = new EventEmitter<any>();

  constructor(
    injector: Injector,
    public _clinicDetailsService: ClinicDetailsServiceProxy,
    public bsModalRef: BsModalRef
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._clinicDetailsService.get(this.id).subscribe((result: ClinicDetailsDto) => {
      this.clinicDetails = result;
    });
  }

  save(): void {
    this.saving = true;

    this._clinicDetailsService.update(this.clinicDetails).subscribe(
      () => {
        this.notify.info(this.l('SavedSuccessfully'));
        this.bsModalRef.hide();
        this.onSave.emit();
      },
      () => {
        this.saving = false;
      }
    );
  }
}
