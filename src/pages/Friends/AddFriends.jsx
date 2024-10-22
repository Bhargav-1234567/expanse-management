import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faUser } from "@fortawesome/free-solid-svg-icons";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { addFriend, removeFriend } from "../../redux/slices/usersSlice";

const AddFriends = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const currentUser = useSelector((state) => state.users.currentUser);
  const { removeQueryParam } = useCustomNavigation();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users?.filter(
    (user) =>
      user.userId !== currentUser.userId &&
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isFriend = (userId) =>
    currentUser.friends?.some((friend) => friend.userId === userId);

  const handleAddFriend = (friendId) => {
    dispatch(addFriend({ currentUserId: currentUser.userId, friendId }));
  };

  const handleUnfriend = (friendId) => {
    dispatch(removeFriend({ currentUserId: currentUser.userId, friendId }));
  };

  const getOweLabel = (friend) => {
    if (friend.amount === 0) return null;
    return friend.isOwe
      ? `You owe $${friend.amount.toFixed(2)}`
      : `They owe you $${friend.amount.toFixed(2)}`;
  };

  return (
    <div className="add-friends-model">
      <div className="align-items-center d-flex justify-content-between mb-3">
        <h4 className="mb-0">Find and Add Friends</h4>
        <FontAwesomeIcon
          icon={faClose}
          onClick={() => {
            removeQueryParam("addModel");
          }}
        />
      </div>

      <input
        type="text"
        placeholder="Search users by username or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-100"
      />

      <div className="user-list">
        {filteredUsers.length ? (
          filteredUsers.map((user) => {
            const friend = currentUser.friends?.find(
              (friend) => friend.userId === user.userId
            );
            return (
              <div className="user-info" key={user.userId}>
                <div className="user-profile">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <span>{user.username}</span>

                {friend && getOweLabel(friend) && (
                  <span className="owe-label">{getOweLabel(friend)}</span>
                )}

                {isFriend(user.userId) ? (
                  <button
                    onClick={() => handleUnfriend(user.userId)}
                    className="btn-filled"
                  >
                    Unfriend
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddFriend(user.userId)}
                    className="btn-filled"
                  >
                    Add Friend
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default AddFriends;
