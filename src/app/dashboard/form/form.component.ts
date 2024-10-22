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
  
  imageUrl = '../../assets/information.png';
  searchImageUrl = 'assets/search.png';
  filteredVehicles: any[] = [];
  selectedBranch: string = 'All Vehicles';

  constructor(private fb: FormBuilder, private vehicleService: VehicleService) {
    this.vehicleService.getVehicleData().subscribe((data) => {
      this.vehicleList = data.vehicles;
      this.filteredVehicles = this.vehicleList;
      console.log(this.vehicleList);
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
    vehicle.selected = !vehicle.selected;
    if (vehicle.selected) {
      this.selectedVehicles.push(vehicle.vin);
    } else {
      this.selectedVehicles = this.selectedVehicles.filter(vin => vin !== vehicle.vin);
    }
    console.log('Selected Vehicles:', this.selectedVehicles);
  }

  // checkedItem = [
  //   { name: "Fleet Wise Report", formName: "fleet", vehicle: false },
  //   { name: "Vehicle Wise Report", formName: "vehicle", vehicle: true },
  //   { name: "Trip Wise", formName: "trip", vehicle: false },
  //   { name: "Driving Scorecard Report", formName: "driving", vehicle: true }
  // ]

}
