import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import useLogout from "/src/hooks/useLogout";

const LogoutButton = () => {
    const { loading, logout } = useLogout();
    const [showPopup, setShowPopup] = useState(false);

    const handleLogout = () => {
        // Display confirmation popup
        setShowPopup(true);
    };

    const handleConfirmLogout = () => {
        // Call logout function
        logout();
        // Close the popup
        setShowPopup(false);
    };

    const handleCancelLogout = () => {
        // Close the popup
        setShowPopup(false);
    };

    return (
        <div className='mt-auto' >
            {!loading ? (
                <div className="flex items-center">
 <BiLogOut
      className='w-6 h-6 text-blue-500 cursor-pointer flip-horizontal'
      onClick={handleLogout}
      style={{ color: 'red' }}
    />                   <span className="text-red-500 ml-2" onClick={handleLogout}style={{ color: 'red' }}>Log out</span>
                </div>
            ) : (
                <span className='loading loading-spinner'></span>
            )}

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>Are you sure you want to Logout?</p>
						<div className="popup-buttons">
                <button onClick={handleConfirmLogout} className="logoutpopup-button">Yes,  Logout</button>
                <button onClick={handleCancelLogout} className="logoutpopup-button">Cancel</button>
            </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .flip-horizontal {
                    transform: scaleX(-1);
                  }
                  
                .popup-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                }

                .popup-buttons {
                    display: flex;
					flex-direction: column; /* Change the direction to column */
                    margin-top: 20px;
                }
				.popup-buttons button {
                    margin-right: 10px; /* Adjust spacing between buttons */
                }
				.logoutpopup-button {
					width: 100%;
					max-width: 400px;
					height: 45.38px;
					padding: 10px 20px;
					border-radius: 10px;
					font-size: 16px;
					background-color: white; /* Set background color to white */
					color: #000; /* Set text color to black */
					border: 1px solid red; /* Set border color to red */
					cursor: pointer;
					text-align: center;
					transition: background-color 0.3s, color 0.3s, border-color 0.3s; /* Add transition for smooth hover effect */
				}
			
				.logoutpopup-button:hover {
					background-color: #17A2B8; /* Change background color to blue when hovered */
					color: white; /* Change text color to white when hovered */
					border-color: white; /* Change border color to white when hovered */
				}
				.popup-buttons button + button {
					margin-top: 10px; /* Add margin to the top of the second button */
				}
            `}</style>
        </div>
    );
};
export default LogoutButton;
