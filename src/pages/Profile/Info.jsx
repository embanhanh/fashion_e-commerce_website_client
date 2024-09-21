import {FaPenToSquare} from 'react-icons/fa6'
import './Info.css'

function Info() {
    return (
        <>
            <form class="row g-3">
                <div className="d-flex flex-row bd-highlight mb-3">
                    <div className="container profile-container">
                        <div className="profile-pic-container">
                            
                        </div>
                        <button className="btn btn-edit-profile bg-dark text-white col-2">
                            <FaPenToSquare className="m-2" />
                            Edit Profile
                        </button>
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="inputFisrtName" class="form-label">First Name</label>
                    <input type="input" class="form-control" id="inputFisrtName" />
                </div>

                <div class="col-6">
                    <label for="inputLastName" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="inputLastName" />
                </div>

                <div class="col-6">
                    <label for="inputAddress" class="form-label">Phone Number</label>
                    <input type="text" class="form-control" id="inputAddress" />
                </div>
                
                <div class="col-md-6">
                    <label for="inputEmail" class="form-label">Email</label>
                    <input type="email" class="form-control" id="inputEmail" />
                </div>

                <div class="col-12">
                    <label for="inputAddress" class="form-label">Address</label>
                    <input type="text" class="form-control" id="inputAddress" placeholder="Apartment, studio, or floor" />
                </div>
            </form>
        </>
    );
}

export default Info;