import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto,
} from '@shared/paged-listing-component-base';
import {
  ClinicDetailsServiceProxy,
  ClinicDetailsDto,
  ClinicDetailsDtoPagedResultDto,
} from '@shared/service-proxies/service-proxies';
import { CreateClinicDetailsDialogComponent } from './create-clinic-details/create-clinic-details-dialog.component';
import { EditClinicDetailsDialogComponent } from './edit-clinic-details/edit-clinic-details-dialog.component';

class PagedClinicDetailsRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  templateUrl: './clinic-details.component.html',
  animations: [appModuleAnimation()]
})
export class ClinicDetailsComponent extends PagedListingComponentBase<ClinicDetailsDto> {
  clinicDetails: ClinicDetailsDto[] = [];
  keyword = '';
  advancedFiltersVisible = false;

  constructor(
    injector: Injector,
    private _clinicDetailsService: ClinicDetailsServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }

  list(
    request: PagedClinicDetailsRequestDto,
    pageNumber: number,
    finishedCallback: Function
  ): void {
    request.keyword = this.keyword;

    this._clinicDetailsService
      .getAll(
        request.keyword,
        request.skipCount,
        request.maxResultCount
      )
      .pipe(
        finalize(() => {
          finishedCallback();
        })
      )
      .subscribe((result: ClinicDetailsDtoPagedResultDto) => {
        this.clinicDetails = result.items;
        this.showPaging(result, pageNumber);
      });
  }

  delete(clinicDetails: ClinicDetailsDto): void {
    abp.message.confirm(
      this.l('ClinicDetailsDeleteWarningMessage', clinicDetails.name),
      undefined,
      (result: boolean) => {
        if (result) {
          this._clinicDetailsService
            .delete(clinicDetails.id)
            .pipe(
              finalize(() => {
                abp.notify.success(this.l('SuccessfullyDeleted'));
                this.refresh();
              })
            )
            .subscribe(() => { });
        }
      }
    );
  }

  createClinicDetails(): void {
    this.showCreateOrEditClinicDetailsDialog();
  }

  editClinicDetails(clinicDetails: ClinicDetailsDto): void {
    this.showCreateOrEditClinicDetailsDialog(clinicDetails.id);
  }

  showCreateOrEditClinicDetailsDialog(id?: number): void {
    let createOrEditClinicDetailsDialog: BsModalRef;
    if (!id) {
      createOrEditClinicDetailsDialog = this._modalService.show(
        CreateClinicDetailsDialogComponent,
        {
          class: 'modal-lg',
        }
      );
    } else {
      createOrEditClinicDetailsDialog = this._modalService.show(
        EditClinicDetailsDialogComponent,
        {
          class: 'modal-lg',
          initialState: {
            id: id,
          },
        }
      );
    }

    createOrEditClinicDetailsDialog.content.onSave.subscribe(() => {
      this.refresh();
    });
  }

  clearFilters(): void {
    this.keyword = '';
    this.getDataPage(1);
  }
}
