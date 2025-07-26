//Select the book-btn button.
const bookBtn = document.querySelector('.book-btn');
//select the appointment-modal element.
const modal = document.getElementById('appointment-modal');
//select the date
const dateInput = document.getElementById('date');
//select the hour 
const hourSelect = document.getElementById('hour');
//submit
const successMsg = document.getElementById('appointment-success');

//that gives back the appointment list or an empty array if not found.
function getAppointments() {
    return JSON.parse(localStorage.getItem('appointments')) || [];
}

//save the appointments to localStorage in JSON format.
function saveAppointments(appointments) {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

//if the bbutton is found
if (bookBtn) {
  bookBtn.addEventListener('click', () => {     //then when the btn is clicked
    modal.style.display = 'flex';               //modal-window will be displayed
    successMsg.style.display = 'none';      //success message will be hidden
    const today = new Date();               // Set min date to today
    dateInput.min = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    dateInput.value = '';                   // Reset date input
    hourSelect.innerHTML = '';               // Reset hour select    
  });
}
//if the dateInput is found
if (dateInput) {
  dateInput.addEventListener('input', function() { // input sets every time when selected
    const d = new Date(this.value);                 //user selected date
    if (d.getDay() === 0 || d.getDay() === 6) { //check if the selected date is (6)Saturday or (0)Sunday
      alert('Please select a weekday (Monday to Friday).');
      this.value = '';                          //when 6 or 0 then reset the date input
      hourSelect.innerHTML = '';            // Reset hour select
      return;
    }

    //if the selected day is not Saturday or Sunday
    hourSelect.innerHTML = '';                  // Reset hour select
    const appointments = getAppointments();     //Get all earlier saved appointments
    // Loop through hours from 8 to 17
    for(let h=8; h<=17; h++) {
        // Check if the hour is already booked
        const isBooked = appointments.some(a => a.date === this.value && Number(a.hour) === h);
      const option = document.createElement('option');// Create an option element for each hour
      option.value = h;            // Set the value of the option to h
      option.textContent = `${h}:00 - ${h+1}:00`; // Set the text content of the option to show the hour range
      if (isBooked) option.disabled = true; // If the hour is booked, disable the option

      hourSelect.appendChild(option);  //ads the option to the hour select dropdown
    }
  });
}

//after all , close the pop up window , close the modal
function closeModal() {
  modal.style.display = 'none';
}


function submitAppointment() {
    //get the fullname input value
    const fullname = document.getElementById('fullname').value.trim();
    if (!fullname) {        //check if the fullname is empty
        alert('Please enter your full name!');
        return;
    }
  if(!dateInput.value || !hourSelect.value) {  //check if the date or hour is not selected
    alert('Please select a date and hour!');
    return;
  }
//get the booked appointments from localStorage
  const appointments = getAppointments(); 

  //check if the selected date and hour is already booked
  if (appointments.some(a => a.date === dateInput.value && a.hour === hourSelect.value)) {
    alert('This time slot is already booked!');
    return;
  }

  //if everything is ok , then push the new appointment to the appointments array
  appointments.push({name: fullname, date: dateInput.value, hour: hourSelect.value });
  saveAppointments(appointments);
  successMsg.style.display = 'block';
  setTimeout(closeModal, 1500);
}