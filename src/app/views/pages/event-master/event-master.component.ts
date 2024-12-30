import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, AlignDirective, ButtonDirective, DropdownComponent, DropdownDividerDirective, DropdownItemDirective, DropdownMenuDirective, DropdownToggleDirective, FormCheckInputDirective, FormControlDirective, FormLabelDirective,
   FormSelectDirective, InputGroupComponent, InputGroupTextDirective, ThemeDirective, PageItemDirective, PageLinkDirective, PaginationComponent,
   FormFeedbackComponent,
   FormCheckLabelDirective,
   FormCheckComponent,
   ModalModule} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ApiService } from '../../services/api.service';
import { cilDelete } from '@coreui/icons';

@Component({
  selector: 'app-event-master',
  standalone: true,
  templateUrl: './event-master.component.html',
  styleUrl: './event-master.component.scss',
  imports: [HttpClientModule,RowComponent, ColComponent, TextColorDirective,ButtonDirective, IconDirective,CardComponent, 
    CardHeaderComponent, CardBodyComponent, TableDirective, TableColorDirective, TableActiveDirective, BorderDirective, 
    AlignDirective,InputGroupComponent, InputGroupTextDirective, FormControlDirective, FormLabelDirective,  PaginationComponent,
    PageItemDirective,PageLinkDirective,FormCheckInputDirective, ButtonDirective, ThemeDirective, DropdownComponent,ModalModule,
    FormCheckComponent, FormCheckLabelDirective,DropdownToggleDirective, DropdownMenuDirective,DropdownItemDirective, RouterLink, 
    DropdownDividerDirective, FormSelectDirective,ReactiveFormsModule,CommonModule,FormFeedbackComponent],
    providers:[ApiService]
})
export class EventMasterComponent implements OnInit {
  showform: boolean = false;
  eventForm: FormGroup;
  submitted = false;
  previewUrl: string | null = null;

  birthdaybackimg: File | null = null;
  birthdayperimg: File | null = null;

   @ViewChild('previewCanvas') previewCanvas!: ElementRef<HTMLCanvasElement>;
   icons = {cilDelete};
   
  constructor(private fb: FormBuilder, private api:ApiService) {
    this.eventForm = this.fb.group({
      id:[''],
      eventtype: ['Birthday', Validators.required],
      eventName: [null],
      empname: ['', Validators.required],
      dob: [null],
      evevtdate: ['', Validators.required],
      message: ['', Validators.required],
      eventlogo: [null],
      eventimg: [null],
      birthdaybackimg: [null],
      birthdayperimg: [null],
      birthdayimg:[null]
    });
  }

  ngOnInit(): void {
    this.eventForm.get('eventtype')?.valueChanges.subscribe((eventtype) => {
      this.updateValidators(eventtype);
    });
   }


  updateValidators(eventtype: string) {
    const eventlogoControl = this.eventForm.get('eventlogo');
    const eventimgControl = this.eventForm.get('eventimg');
    const eventnameControl = this.eventForm.get('eventName');
    if (eventtype === 'Festival' || eventtype === 'Sport/Office Event') {
      eventlogoControl?.setValidators([Validators.required]);
      eventimgControl?.setValidators([Validators.required]);
      eventnameControl?.setValidators([Validators.required]);
      eventlogoControl?.updateValueAndValidity();
      eventimgControl?.updateValueAndValidity();
      eventnameControl?.updateValueAndValidity();
    } else {
      eventlogoControl?.clearValidators();
      eventimgControl?.clearValidators();
      eventnameControl?.clearValidators();
      eventnameControl?.setValue(null);
      eventlogoControl?.setValue(null);
      eventimgControl?.setValue(null);
      eventlogoControl?.updateValueAndValidity();
      eventimgControl?.updateValueAndValidity();
      eventnameControl?.updateValueAndValidity();
    }
    const birthdayimgcontrol = this.eventForm.get('birthdaybackimg');
    const birthdayperimgControl = this.eventForm.get('birthdayperimg');
    const dobControl = this.eventForm.get('dob');
    if (eventtype === 'Birthday') {
      birthdayimgcontrol?.setValidators([Validators.required]);
      birthdayperimgControl?.setValidators([Validators.required]);
      dobControl?.setValidators([Validators.required]);
      birthdayimgcontrol?.updateValueAndValidity();
      birthdayperimgControl?.updateValueAndValidity();
      dobControl?.updateValueAndValidity();
    } else {
      birthdayimgcontrol?.clearValidators();
      birthdayperimgControl?.clearValidators();
      dobControl?.clearValidators();
      dobControl?.setValue(null);
      birthdayimgcontrol?.setValue(null);
      birthdayperimgControl?.setValue(null);
      birthdayimgcontrol?.updateValueAndValidity();
      birthdayperimgControl?.updateValueAndValidity();
      dobControl?.updateValueAndValidity();
    }
  }
  addevent(){
    this.showform=true;
  }
  onFileUpload(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Update the form control with the file
      this.eventForm.patchValue({
        [controlName]: file,
      });
      this.eventForm.get(controlName)?.updateValueAndValidity();

      // Assign the file to the corresponding variable for preview
      if (controlName === 'birthdayperimg') this.birthdayperimg = file;
      if (controlName === 'birthdaybackimg') this.birthdaybackimg = file;

      // Generate preview if both files are uploaded
      if (this.birthdayperimg && this.birthdaybackimg) this.generatePreview();
    }
  }

  async generatePreview(): Promise<void> {
    if (!this.birthdayperimg || !this.birthdaybackimg) {
      console.error('Missing files: birthdayperimg or birthdaybackimg');
      return;
    }
  
    const canvas = this.previewCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      return;
    }
  
    // Load and draw images
    try {
      const bgImage = await this.loadImage(URL.createObjectURL(this.birthdaybackimg));
      const logoImage = await this.loadImage(URL.createObjectURL(this.birthdayperimg));
      // Draw background
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  
      // Draw logo
      const logoWidth = 186;
      const logoHeight = 161;
      const padding = 40;
      const logoX = (canvas.width - logoWidth-padding);
      const logoY = 278
      ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
  
      // const logoWidth = 300;
      // const logoHeight = 300;
      // const logoX = canvas.width - logoWidth - 20; // Right side with padding
      // const logoY = 50; // Top padding
      // ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
  
      // const message = this.eventForm.get('message')?.value || 'Happy Birthday!';
      // ctx.font = 'bold 48px Arial';
      // ctx.fillStyle = 'white';
      // ctx.textAlign = 'center';
      // ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  
      // Add the employee's name
      const name = this.eventForm.get('eventName')?.value || 'Akshaya Jadhav';
      ctx.font = 'bold 18px cursive';
      ctx.fillStyle = '#3c3333';
      ctx.fillText(name, canvas.width / 2+35, canvas.height /2 + 161);
     
    } catch (error) {
      console.error('Error generating preview:', error);
    }
  }
 
  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        console.log('Image loaded:', src);
        resolve(img);
      };
      img.onerror = (err) => {
        console.error('Error loading image:', src, err);
        reject(err);
      };
      img.src = src;
    });
  }
  
  onSubmit(): void {
    this.submitted = true;

    if (this.eventForm.valid && this.previewCanvas) {
      const canvas = this.previewCanvas.nativeElement;

      // Convert canvas to blob for uploading
      canvas.toBlob((blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append('composedImage', blob, 'composed-image.png');
           console.log('Form Submitted with Composed Image',this.eventForm.value);
        }
      }, 'image/png');
    }
  }
  close(){
    this.showform=false;
  }
}
