import React from "react";
import { useSelector } from "react-redux";
import AddFriends from "./AddFriends";
import "./friendsPage.css";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const FriendsPage = () => {
  const currentUser = useSelector((state) => state.users.currentUser);
  const { addQueryParam, params } = useCustomNavigation();
  const expenses = useSelector((state) => state.expenses.expenses);

  const userFriends = currentUser?.friends;
  const getOweLabel = (friend) => {};
  return (
    <div className="friends-page py-2">
      {params.addModel && <AddFriends />}
      <div className="align-items-center d-flex justify-content-between">
        <h5 className="mb-0">Your Friends</h5>
        <button
          className="btn-bordered p-1"
          onClick={() => {
            addQueryParam("addModel", "open");
          }}
        >
          Add Friend
        </button>
      </div>

      {userFriends?.length > 0 ? (
        <div className="user-list">
          {userFriends.map((friend) => (
            <div key={friend.userId} className="friend-item">
              <div className="user-info">
                <div className="user-profile">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <span>{friend.name}</span>
                {/* Owe/Owed Status */}

                <span className="owe-label">{getOweLabel(friend)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no friends added yet.</p>
      )}
    </div>
  );
};

export default FriendsPage;
