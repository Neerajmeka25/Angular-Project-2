import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VehicleService } from 'src/app/service/vehicle.service';
import { EditComponent } from '../edit/edit.component';
import { AuthService } from 'src/app/service/auth.service';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  selected: Date | null = null;
  selectedtwo: Date | null = null;
  emailList: string[] = [];
  vehicleList: any[] = [];
  isButtonVisible = false;
  ButtonValue: string = "+ Add";
  showEmail: boolean = false;
  ScheduleReport !: FormGroup;
  enteredEmail: any;
  showVehicleList: boolean = false;
  selectedVehicles: string[] = [];
  selectedCheckbox: string[] = [];
  //nextValue: string = "Next>";
  //formattedTime: string;

  imageUrl = '../../assets/information.png';
  searchImageUrl = 'assets/search.png';
  filteredVehicles: any[] = [];
  selectedBranch: string = 'All Vehicles';

  count_step: number = 0;
  total_step = 1;
  checkedItem = [
    { name: "Fleet Wise Report", formName: "fleet", vehicle: false },
    { name: "Vehicle Wise Report", formName: "vehicle", vehicle: false },
    { name: "Trip Wise", formName: "trip", vehicle: false },
    { name: "Driving Scorecard Report", formName: "driving", vehicle: true }
  ]
  branches = [
    { value: 'All Vehicles', label: 'All Vehicles' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'thane', label: 'Thane' },
    { value: 'pune', label: 'Pune' }
];

  daysCalender: number[] = [];
  username: string = this.auth.loggedinuser;




  @Input() openEdit!: () => void;

  constructor(private fb: FormBuilder, private vehicleService: VehicleService, @Inject(MAT_DIALOG_DATA) public data: any, private route: Router, private dialog: MatDialogRef<FormComponent>, private dialog1: MatDialog, private auth: AuthService,
    private cd: ChangeDetectorRef) {
    this.vehicleService.getVehicleData().subscribe((data) => {
      this.vehicleList = data.vehicles;
      this.filteredVehicles = this.vehicleList;
    })
    this.daysCalender = this.generateNumbers(28);
    //this.formattedTime = this.getFormattedTime();
    //this.username = data?.username;
  }

  ngOnInit(): void {
    this.ScheduleReport = this.fb.group({
      fleet: [false],
      vehicle: [false],
      trip: [false],
      driving: [false],
      userEmail: ["", [Validators.required, Validators.email]],
      vehicleSearch: [""],
      branch: [this.selectedBranch],
      reportInterval: [''],
      time: ['09:30']
    })
    this.ScheduleReport.valueChanges.subscribe(() => {
      this.validateForm();
    });
    this.ScheduleReport.get('vehicle')?.valueChanges.subscribe(value => {
      this.showVehicleList = value;
      this.validateForm();
    });
    this.ScheduleReport.get('branch')?.valueChanges.subscribe(value => {
      this.selectedBranch = value;
      this.filteredVehicleList();
    });
    this.ScheduleReport.get('vehicleSearch')?.valueChanges.subscribe(() => {
      this.filteredVehicleList();
    });
    this.updateTimeInput();
    const storeData = localStorage.getItem(this.username)
    if (storeData) {
      const userData = JSON.parse(storeData);
      //console.log(userData,userData.email_list.email_list,userData.vehicle_list.vin_list);
      this.ScheduleReport.patchValue({
        fleet: userData.reports?.reports_list.includes("Fleet Wise Report") || false,
        vehicle: userData.reports?.reports_list.includes("Vehicle Wise Report") || false,
        trip: userData.reports?.reports_list.includes("Trip Wise") || false,
        driving: userData.reports?.reports_list.includes("Driving Scorecard Report") || false,
        //userEmail: userData.email_list?.email_list[0] || '',
        reportInterval: userData.schedule_interval || '',
        time: userData.schedule_time || '09:30'
      });
      userData.email_list.email_list.forEach((email: string) => {
        this.emailList.push(email);
      });
      userData.vehicle_list.vin_list.forEach((vehicle: any) => {
        this.selectedVehicles.push(vehicle);
      });
      userData.reports.reports_list.forEach((data: string) => {
        this.selectedCheckbox.push(data);
      });
      this.toggleOnOff = userData.skip_weekend;
      console.log("vechicles",this.filteredVehicles, this.selectedCheckbox,this.emailList);
      this.validateForm();
    }
    console.log(this.selectedVehicles);
    
    //console.log('Form values after patch:', this.ScheduleReport.value);
   //console.log(this.selectedCheckbox);
  }

  onCheckedBox(name: string) {
    const index = this.selectedCheckbox.indexOf(name);
    if (index > -1) {
      this.selectedCheckbox.splice(index, 1);
    } else {
      this.selectedCheckbox.push(name);
    }
    this.validateForm();
  }

  showInput() {
    this.showEmail = !this.showEmail;
    if(this.ButtonValue == 'Cancel'){
      this.dupEmail = '';
    }
    this.ButtonValue = this.showEmail ? 'Cancel' : '+ Add';
  }


  filteredVehicleList() {
    const vehicleSearch = this.ScheduleReport.get('vehicleSearch')?.value.toLowerCase();
    const branch = this.selectedBranch;
    this.filteredVehicles = this.vehicleList.filter(vehicle => {
      const matchesBranch = branch === 'All Vehicles' || vehicle.branch.toLowerCase() === branch.toLowerCase();
      const matchesSearch = !vehicleSearch || vehicle.registration_number.toLowerCase().includes(vehicleSearch);
      return matchesBranch && matchesSearch;
    });
  }

  dupEmail: string = '';
  putEmail() {
    const enteredEmail = this.ScheduleReport.get('userEmail')?.value;
    //console.log(enteredEmail);
    if (this.emailList.length >= 5) {
      this.dupEmail = 'Cannot add more than 5 emails.';
      return;
    }

    if (this.emailList.includes(enteredEmail)) {
      this.dupEmail = 'Duplicate email cannot be added.';
      this.ScheduleReport.get('userEmail')?.reset();
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(enteredEmail)) {
      this.emailList.push(enteredEmail);
      this.ScheduleReport.get('userEmail')?.reset();
      //console.log(this.emailList);
      this.dupEmail = '';
    } else {
      this.dupEmail = '*Enter a valid email';
    }
  }

  removeEmail(email: string) {
    const index = this.emailList.indexOf(email);
    if (index !== -1) {
      this.emailList.splice(index, 1);
    }
  }

  onVehicleSelect(vehicle: any) {
    const index = this.selectedVehicles.indexOf(vehicle.registration_number);
    if (index === -1) {
      this.selectedVehicles.push(vehicle.registration_number);
    } else {
      this.selectedVehicles.splice(index, 1);
    }
    console.log('Selected Vehicles:', this.selectedVehicles);
  }

  get additionalCount() {
    return this.selectedVehicles.length > 2 ? this.selectedVehicles.length - 2 : 0;
  }

  validationMessage = '';
  nextStep() {
    if (this.validateForm()) {
      if (this.count_step < this.total_step) {
        this.count_step++;
        //this.nextValue = "Done";
      }
      else {
          const selectedInterval = this.ScheduleReport.get('reportInterval')?.value;
          if (!selectedInterval) {
            this.validationMessage = 'Please select a report interval before submitting.';
            return;
          }
          else {
            this.saveToLocalStorage();
            this.dialog.close(true);
            console.log("data saved");
          }
        }
    }
  }

  closeForm(){
    this.dialog.close();

  }
  reportCheckBox: boolean = false;
  reportVehicles: boolean = false;
  reportEmail: boolean = false;
  isFormValid = false;
  validateForm() {
    this.reportCheckBox = this.selectedCheckbox.length === 0;
    this.reportVehicles = this.selectedCheckbox.includes("Vehicle Wise Report") && this.selectedVehicles.length === 0;
    this.reportEmail = this.emailList.length == 0;
    this.isFormValid = !(this.reportCheckBox || this.reportVehicles || this.reportEmail);
    return this.isFormValid;
  }

  /*
    validateForm() {
// Check if no checkbox is selected
if (this.selectedCheckbox.length == 0) {
  this.reportCheckBox = true;
  return false;
} else {
  this.reportCheckBox = false; // Clear error if valid
}

// Check if "Vehicle Wise Report" is selected but no vehicle is chosen
if (this.selectedCheckbox.includes("Vehicle Wise Report") && this.selectedVehicles.length == 0) {
  this.reportVehicles = true;
  return false;
} else {
  this.reportVehicles = false; // Clear error if valid
}

// Check if no email is entered
if (this.emailList.length == 0) {
  this.reportEmail = true;
  return false;
} else {
  this.reportEmail = false; // Clear error if valid
}

// If all checks pass, return true
return true;
}

  */
  prevStep() {
    if (this.count_step == 1) {
      this.count_step--;
      //this.nextValue = "Next>";
    }
    else {
      this.dialog.close();
    }
  }
  /*
  hours: number = 12;
  minutes: number = 0;
  ampm: string = 'AM';

  increment() {
    if (this.minutes === 59) {
      this.minutes = 0;
      if (this.hours === 12) {
        this.hours = 1;
      } else {
        this.hours++;
      }
    } else {
      this.minutes++;
    }
    this.updateFormattedTime();
  }

  decrement() {
    if (this.minutes === 0) {
      this.minutes = 59;
      if (this.hours === 1) {
        this.hours = 12;
      } else {
        this.hours--;
      }
    } else {
      this.minutes--;
    }
    this.updateFormattedTime();
  }


  toggleAmPm() {
    this.ampm = this.ampm === 'AM' ? 'PM' : 'AM';
    this.updateFormattedTime();
  }

  formatTime(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  getFormattedTime(): string {
    return `${this.formatTime(this.hours)}:${this.formatTime(this.minutes)} ${this.ampm}`;
  }
  updateFormattedTime() {
    this.formattedTime = this.getFormattedTime(); // Call the method to get the updated formatted time
  }
*/

  hours: number = 9;
  minutes: number = 30;
  ampm: string = 'AM';
  updateTimeInput() {
    const timeString = `${this.hours < 10 ? '0' : ''}${this.hours}:${this.minutes < 10 ? '0' : ''}${this.minutes}`;
    this.ScheduleReport.patchValue({ time: timeString });
  }

  increment() {
    const currentTime = this.ScheduleReport.get('time')?.value;
    const [hourPart, minutePart] = currentTime.split(':');
    this.hours = parseInt(hourPart, 10);
    this.minutes = parseInt(minutePart.split(' ')[0], 10);
    this.minutes = this.minutes + 15;
    if (this.minutes === 60) {
      this.minutes = 0;
      this.hours++;
      if (this.hours === 12) {
        this.ampm = this.ampm === 'AM' ? 'PM' : 'AM';
      }
      if (this.hours === 13) {
        this.hours = 1;
      }
    }
    this.updateTimeInput();
  }

  decrement() {
    const currentTime = this.ScheduleReport.get('time')?.value;
    const [hourPart, minutePart] = currentTime.split(':');
    this.hours = parseInt(hourPart, 10);
    this.minutes = parseInt(minutePart.split(' ')[0], 10);
    this.minutes = this.minutes - 15;
    if (this.minutes < 0) {
      this.minutes = 45;
      this.hours--;
      if (this.hours === 0) {
        this.hours = 12;
        this.ampm = this.ampm === 'AM' ? 'PM' : 'AM';
      }
    }
    this.updateTimeInput();
  }

  toggleAmPm() {
    this.ampm = this.ampm === 'AM' ? 'PM' : 'AM';
    this.updateTimeInput();
  }


  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  cases = ['Weekly', 'Every 2 Weeks', 'Monthly', 'Quarterly', 'Yearly'];

  value: string | null = null;
  selectedOption!: number;
  selectedDay: string | null = null;
  selectedDayCal: number | null = null;
  selectedQuarter: string | null = null;
  selectedYear: string | null = null;

  quarters = ['Last Day of the Quarter', 'First Day of the Quarter', 'Custom'];
  yearly = ['Last Day of the Year', 'First Day of the Year', 'Custom'];

  onChange(event: any) {
    this.validationMessage = '';
    this.value = event.target.value;
    this.selectedOption = this.value ? this.cases.indexOf(this.value) : -1;
    /*this.selectedDay = null;
    this.selectedQuarter = null;
    this.selectedYear = null;
    this.selectedDayCal = null;*/
  }


  selectValue(day: string): void {
    this.selectedDay = this.selectedDay === day ? null : day;
  }

  selectDay(day: number): void {
    this.selectedDayCal = this.selectedDayCal === day ? null : day;
  }

  selectQuarter(quarter: string): void {
    this.selectedQuarter = this.selectedQuarter === quarter ? null : quarter;
  }

  selectYear(year: string): void {
    this.selectedYear = this.selectedYear === year ? null : year;
  }


  openlast() {
    this.dialog1.open(EditComponent, {
      width: '500px',
      height: '250px'
    });
  }

  generateNumbers(count: number): number[] {
    const numbers: number[] = [];
    for (let i = 1; i <= count; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  
  saveToLocalStorage() {
    const reportData = {
      dataUser: this.username,
      reports: {
        reports_list: this.selectedCheckbox,
      },
      vehicle_list: {
        vin_list: this.selectedVehicles,
      },
      email_list: {
        email_list: this.emailList,
      },
      schedule_date: this.ScheduleReport.get('date')?.value || new Date().toISOString().split('T')[0],
      schedule_time: this.ScheduleReport.get('time')?.value || '09:00:00',
      schedule_time_ampm: this.ampm,
      selectedDay: this.selected,
      selectedQuater: this.selectedQuarter,
      selectedYear: this.selectedYear,
      schedule_interval: this.value,
      schedule_day: this.selectedDay || this.selectedDayCal, 
      skip_weekend: this.toggleOnOff,
    };

    localStorage.setItem(this.username, JSON.stringify(reportData));
    console.log("Data saved to local storage:", reportData);
  }

  toggleOnOff: boolean = false;
  filteredDays: string[] = this.days;

  Toggle() {
    this.toggleOnOff = !this.toggleOnOff;
    this.filteredDays = this.toggleOnOff
      ? this.days.filter(day => day !== 'Saturday' && day !== 'Sunday')
      : this.days;

  }

  /*toggleWeekends(date: Date): boolean {
    const day = date.getDay()
    return this.toggleOnOff ? (day !== 0 && day !== 6) : true;
  }*/
  dateClass = (date: Date): string => {
    const day = date.getDate();
    return (day === 29 || day === 30 || day === 31) ? 'hidden-date' : '';
  }
  dateFilter = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const day = date.getDay()
    return date >= today && (!this.toggleOnOff || (day !== 0 && day !== 6));
  }

  monthFilter(date: Date): boolean {
    const month = date.getMonth();

    return month == 0 || month == 3 || month == 6 || month == 9;

  }



}
