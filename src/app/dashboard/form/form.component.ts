import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private vehicleService: VehicleService) {
    this.vehicleService.getVehicleData().subscribe((data) => {
      this.vehicleList = data.vehicles;
      this.filteredVehicles = this.vehicleList;
    })
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

  nextStep(){
    if(this.count_step<this.total_step){
      console.log('Selected Vehicles before next step:', this.selectedVehicles);
      this.count_step++;
    }
    else{
      alert("Last Page")
    }
  }

  prevStep(){
    if(this.count_step==1){
      this.count_step--;
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
  }


  toggleAmPm() {
    this.ampm = this.ampm === 'AM' ? 'PM' : 'AM';
  }

  formatTime(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
  

  days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  cases = ['Weekly','Every 2 Weeks','Monthly','Quaterly','Yearly'];
  value : any;
  selectedOption!: number;
  onChange(e: any){
    this.value = e.target.value;
    console.log(this.value);
    this.selectedOption = this.cases.indexOf(this.value);
  }

}
