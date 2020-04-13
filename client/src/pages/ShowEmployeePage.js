import React from 'react';
import { Redirect } from 'react-router-dom';
import Loading from '../components/Loading';
import EmployeeData from '../components/Employees';
import {Link} from 'react-router-dom';
import {Modal, Button} from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
class ShowEmployeePage extends React.Component {
    
    state = {
      loading: true,
      data: null,
      modalStatAdd:false,
      modalStatDelete:false,
      emp_id:'',
      last: '',
      first: '',
      dob: new Date(new Date().setHours(0, 0, 0)),
      rest: '',
      department: '',
      sup_id: '123',
      hasDepartment: false,
      departmentOptions: [],
      hourly_rate:''
    }
    componentDidMount() {
      this.getAllEmpHandler();
    }
    idInputHandler = (e) => {
      this.setState({ emp_id: e.target.value });
    };

    lastInputHandler = (e) => {
      this.setState({ last: e.target.value });
    };
  
    firstInputHandler = (e) => {
      this.setState({ first: e.target.value });
    };
  
    dobInputHandler = (date) => {
      this.setState({ dob: date });
    }; 
  
    restInputHandler = (day) => {
      this.setState({ rest: day.value });
    };
  
    dpInputHandler = (e) => {
      this.setState({ department: e.value });
    }
  
    hourlyRateInputHandler = (e) => {
      this.setState({ hourly_rate: e.target.value });
    };
  
    redirect = () => {
  
      this.props.history.push('/add-department')
    }
    getDeparmentInfo = async() => {
  
      await fetch('http://localhost:5000/api/departments')
        .then(res => res.json())
        .then(data1 => {
  
          let departments = [];
  
          for( let i = 0; i < data1.length; i++ ){
        
            departments.push(data1[i].department_name);
          }
  
          if( departments.length > 0 ){
  
            this.setState({
              hasDepartment: true,
              departmentOptions: departments
            });
          }
          
        })
        .catch(err => console.log("API ERROR: ", err));
    }
    removeEmpHandler = async(event) => {

      event.preventDefault();
  
      await fetch('http://localhost:5000/api/employees/delete', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
          { 
            Emp_ID: this.state.emp_id, 
             })
      }).then(function(res){
        return res.json(); //error here
      }).then(function(data){
        console.log(data);
      }).catch((error) => {
        console.log(error);
      });
      this.changeModalStatDelete();
    };
    getAllEmpHandler = async() => {
      
      await fetch("http://localhost:5000/api/employees")
        .then(res => res.json())
        .then(data => {

          for( let i = 0; i < data.length; i++ ){
            
            data[i].dob = data[i].dob.split("T")[0];
          
          }

          this.setState({
            loading: false,
            data: data
          });
          
        })
        .catch(err => console.log("API ERROR: ", err));
      console.log(this.state.data);
        this.getDeparmentInfo();
    }
    addEmpHandler = async(event) => {

      event.preventDefault();
  
      await fetch('http://localhost:5000/api/employees', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
          { 
            emp_id: this.state.emp_id, 
            last_name: this.state.last, 
            first_name: this.state.first, 
            dob: this.state.dob, 
            rest_day: this.state.rest,
            department: this.state.department,
            hourly_rate: this.state.hourly_rate
             })
      }).then(function(res){
        return res.json(); //error here
      }).then(function(data){
        console.log(data);
      }).catch((error) => {
        console.log(error);
      });
      this.changeModalStatAdd();
    }
    changeModalStatAdd = () =>
    {
      this.setState({modalStatAdd:!this.state.modalStatAdd});
    }
    changeModalStatDelete = () =>
    {
      this.setState({modalStatDelete:!this.state.modalStatDelete});
    }
    render() {
      if(this.state.loading) {
        return <Loading />;
      }

      if(!this.state.data) {
        return(
          <div>
            <h1>No Employee Now</h1>
          </div>
        )
      }
      const options = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
      ];
      return (
        <div>
          <div className="text-center">
            <h1>Employee Data</h1>
          </div>
          <br/>
          <EmployeeData empdata={this.state.data}/>
          <br/>
          <Button variant ='primary' onClick = {this.changeModalStatAdd}>Add Employee</Button>{' '}
          <Modal show = {this.state.modalStatAdd}
          centered>
            <Modal.Header closeButton onClick={this.changeModalStatAdd}>Add Employee</Modal.Header>
              <Modal.Body>
              <label htmlFor='empid'>Employee id</label>
              <label htmlFor='empid'>Emp ID</label>
              <input 
                placeholder="Emp ID..." id='empid' 
                value={this.state.emp_id}
                onChange={this.idInputHandler} 
                required
              />
              <br/>
            
              <label htmlFor='ln'>Last Name</label>
              <input 
                placeholder="last name..." id='ln' 
                value={this.state.last}
                onChange={this.lastInputHandler} 
                required
              />
              <br/>

              <label htmlFor='fn'>First Name</label>
              <input 
                placeholder="first name..." id='fn'
                value={this.state.first}
                onChange={this.firstInputHandler} 
                required
              />
              <br/>
              <label htmlFor='hr'>Hourly Rate</label>
              <input 
                placeholder="$" id='hr'
                value={this.state.hourly_rate}
                onChange={this.hourlyRateInputHandler}
                required
              />
              <br/>

              <label>Day of Birth</label>
              <DatePicker
                selected={this.state.dob}
                onChange={this.dobInputHandler}
              />
              <br/>

              <label>Rest Day</label>
              <Dropdown options={options} onChange={this.restInputHandler} 
                value={this.state.rest} placeholder="Select a Day" />
              <br/>

              <label>Department</label>
              
              {this.state.hasDepartment &&
                (<Dropdown options={this.state.departmentOptions} onChange={this.dpInputHandler} 
                value={this.state.department} placeholder="Select a Department" />)}
              
              {!this.state.hasDepartment &&
                (<div>
                  <p>No Department found, Add New Department?</p><br/>
                  <button className='btn btn-link' onClick={this.redirect}>New</button>
                </div>)}
              <br/>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='primary' onClick ={this.addEmpHandler}>Confirm</Button>
                <Button variant='secondary' onClick ={this.changeModalStatAdd}>Cancel</Button>
              </Modal.Footer>
          </Modal>

          <Button variant ='danger' onClick = {this.changeModalStatDelete}>Delete</Button>{' '}
          <Modal show = {this.state.modalStatDelete}
          centered>
            <Modal.Header closeButton onClick={this.changeModalStatDelete}>Delete Employee</Modal.Header>
              <Modal.Body>
              <label htmlFor='empid'>Employee id</label>
              <input 
                placeholder="Employee id..." id='empid'
                value={this.state.emp_id}
                onChange={this.idInputHandler} 
                required
              />
              </Modal.Body>
              <Modal.Footer>
                <Button variant='primary' onClick ={this.removeEmpHandler}>Delete</Button>
                <Button variant='secondary' onClick ={this.changeModalStatDelete}>Cancel</Button>
              </Modal.Footer>
          </Modal>
        </div>
      );
    }
  }

export default ShowEmployeePage;