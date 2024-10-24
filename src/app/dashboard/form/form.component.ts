import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VehicleService } from 'src/app/service/vehicle.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
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
  formattedTime: string;

  imageUrl = '../../assets/information.png';
  searchImageUrl = 'assets/search.png';
  filteredVehicles: any[] = [];
  selectedBranch: string = 'All Vehicles';
  
  count_step:number = 0;
  total_step = 1;
  checkedItem = [
    { name: "Fleet Wise Report", formName: "fleet", vehicle: false },
    { name: "Vehicle Wise Report", formName: "vehicle", vehicle: false },
    { name: "Trip Wise", formName: "trip", vehicle: false },
    { name: "Driving Scorecard Report", formName: "driving", vehicle: true }
  ]
  daysCalender: number[] = [];
  username: string;
  constructor(private fb: FormBuilder, private vehicleService: VehicleService,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.vehicleService.getVehicleData().subscribe((data) => {
      this.vehicleList = data.vehicles;
      this.filteredVehicles = this.vehicleList;
    })
    this.daysCalender = this.generateNumbers(28);
    this.formattedTime = this.getFormattedTime();
    this.username = data.username;
  }

  ngOnInit(): void {
    this.ScheduleReport = this.fb.group({
      fleet: [false],
      vehicle: [false],
      trip: [false],
      driving: [false],
      userEmail: ["", [Validators.required, Validators.email]],
      vehicleSearch: [""],
      branch: [this.selectedBranch]
    })
    this.ScheduleReport.get('vehicle')?.valueChanges.subscribe(value => {
      this.showVehicleList = value;
    });
    this.ScheduleReport.get('branch')?.valueChanges.subscribe(value => {
      this.selectedBranch = value;
      this.filteredVehicleList();
    });
    this.ScheduleReport.get('vehicleSearch')?.valueChanges.subscribe(() => {
      this.filteredVehicleList();
    });
  }

  onCheckedBox(name: string){
    const index = this.selectedCheckbox.indexOf(name);
    if (index > -1) {
        this.selectedCheckbox.splice(index, 1);
    } else {
        this.selectedCheckbox.push(name);
    }
  }
  showInput() {
    this.showEmail = !this.showEmail;
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

  
  putEmail() {
    let enteredEmail = this.ScheduleReport.get('userEmail');
    if (enteredEmail && enteredEmail.valid && this.emailList.length < 5) {
      this.emailList.push(enteredEmail.value);
      enteredEmail.reset();
      //console.log(this.emailList);
    }
    else if (this.emailList.length == 5) {
      alert("you cannot add more than 5 emails");
      enteredEmail?.reset();
    }
  }

  removeEmail(email: string) {
    const index = this.emailList.indexOf(email);
    if (index !== -1) {
      this.emailList.splice(index, 1);
    }
  }

  onVehicleSelect(vehicle: any) {
    const index = this.selectedVehicles.indexOf(vehicle.vin);
    if (index === -1) {
        this.selectedVehicles.push(vehicle.vin);
    } else {
        this.selectedVehicles.splice(index, 1);
    }
    console.log('Selected Vehicles:', this.selectedVehicles);
  }

  get additionalCount(){
    return this.selectedVehicles.length > 1 ? this.selectedVehicles.length - 1 : 0;
  } 
  nextStep(){
    if(this.validateForm()){
        if(this.count_step<this.total_step){
          this.count_step++;
          //this.nextValue = "Done";
        }
        else{
          this.saveToLocalStorage();
          console.log("data saved");
        }
      }
    }
    reportCheckBox: boolean = false;
    reportVehicles: boolean = false;
    reportEmail: boolean = false;
    validateForm(){
      if(this.selectedCheckbox.length == 0){
        this.reportCheckBox = true;
        return false
      } else{
        this.reportCheckBox = false;
      }


      if(this.selectedCheckbox.includes("Vehicle Wise Report") && this.selectedVehicles.length == 0){
        this.reportVehicles = true;
        return false;
      } else {
        this.reportVehicles = false;
      }

      
      if(this.emailList.length == 0){
        this.reportEmail = true;
        return false;
      } else{
        this.reportEmail = false;
      }
      return true;
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
  prevStep(){
    if(this.count_step==1){
      this.count_step--;
      //this.nextValue = "Next>";
    }
  }
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
  this.value = event.target.value;
  this.selectedOption = this.value ? this.cases.indexOf(this.value) : -1;
  
  this.selectedDay = null;
  this.selectedQuarter = null;
  this.selectedYear = null;
  this.selectedDayCal = null;
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

generateNumbers(count: number): number[] {
  const numbers: number[] = [];
  for (let i = 1; i <= count; i++) {
    numbers.push(i);
  }
  return numbers;
}


  saveToLocalStorage() {
    const reportData = {
      selectedCheckbox: this.selectedCheckbox,
      emailList: this.emailList,
      selectedVehicles: this.selectedVehicles,
      scheduledTime: this.formattedTime,
      selectedDay: this.selectedDay,
      selectedDayCal: this.selectedDayCal,
      value : this.value,
      selectedQuarter: this.selectedQuarter,
      selectedYear : this.selectedYear
    };

    localStorage.setItem(this.username, JSON.stringify(reportData));
    alert('Data saved to local storage!');
  }

}
